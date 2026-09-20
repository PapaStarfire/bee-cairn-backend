// Build Version: 1.0 — September 2026
// Rippily integration helpers — The Lost Travelers Club
// Shared by /api/rippily-webhook.js and /api/rippily-signup.js
//
// WHAT RIPPILY WEBHOOKS ACTUALLY DO (per go.rippily.com/help/waves/webhooks):
// A Wave sends an outbound POST to an external URL when a participant joins or
// leaves a Ripple. Two events exist: participant.joined and participant.left.
// Each webhook is signed with a secret key so the receiver can confirm the
// request genuinely came from Rippily.
//
// Direction matters. Webhooks are Rippily -> us. There is no inbound webhook and
// no documented server-to-server API for creating a Wave member, so website
// signups are enrolled through a Member Link instead. See api/rippily-signup.js.
//
// SIGNATURE SCHEME NOTE:
// Rippily's published documentation confirms that every payload is signed, but
// does not name the header, the digest encoding, or the signed string. Rather
// than guess one and fail silently, verifySignature tries the plausible
// variants, reports which one matched, and lets you pin it afterwards via
// RIPPILY_SIGNATURE_HEADER / RIPPILY_SIGNATURE_ENCODING / RIPPILY_SIGNATURE_SCHEME.
// Send one Test Event from Wave > Settings > Webhooks, read the detected scheme
// out of the logs, pin it, and the guessing stops.

'use strict';

const crypto = require('crypto');

// Header names Rippily might use for the signature. Ordered most to least likely.
const SIGNATURE_HEADERS = [
  'x-rippily-signature',
  'x-rippily-signature-256',
  'rippily-signature',
  'x-webhook-signature',
  'x-hub-signature-256',
  'x-signature',
  'signature'
];

// Header names that might carry a replay-protection timestamp.
const TIMESTAMP_HEADERS = [
  'x-rippily-timestamp',
  'rippily-timestamp',
  'x-webhook-timestamp',
  'x-timestamp'
];

// Header names that might carry a per-delivery id, used for deduplication.
const DELIVERY_ID_HEADERS = [
  'x-rippily-delivery',
  'x-rippily-delivery-id',
  'x-rippily-event-id',
  'x-webhook-id',
  'x-request-id'
];


// ── Raw body ────────────────────────────────────────────────────────────────
// An HMAC has to be computed over the exact bytes Rippily signed. Serverless
// platforms often parse JSON before the handler runs, which consumes the stream.
// Read the real bytes when they are still available and fall back to a
// re-serialised body otherwise, flagging that the bytes are no longer exact.
function readRawBody(req) {
  return new Promise((resolve) => {
    if (Buffer.isBuffer(req.body)) return resolve({ raw: req.body, exact: true });
    if (typeof req.body === 'string') return resolve({ raw: Buffer.from(req.body, 'utf8'), exact: true });

    if (req.readable) {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      req.on('end', () => resolve({ raw: Buffer.concat(chunks), exact: true }));
      req.on('error', () => resolve({ raw: Buffer.alloc(0), exact: true }));
      return;
    }

    if (req.body && typeof req.body === 'object') {
      // The platform parsed and consumed the stream before we got here. Key order
      // and whitespace may differ from what was signed, so signature checks are
      // best effort. Setting bodyParser:false on the route restores exactness.
      return resolve({ raw: Buffer.from(JSON.stringify(req.body), 'utf8'), exact: false });
    }

    resolve({ raw: Buffer.alloc(0), exact: true });
  });
}


// ── Signature verification ──────────────────────────────────────────────────
function headerValue(headers, names) {
  for (const name of names) {
    const value = headers[name];
    if (value) return { name, value: Array.isArray(value) ? value[0] : String(value) };
  }
  return null;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a), 'utf8');
  const right = Buffer.from(String(b), 'utf8');
  if (left.length !== right.length) return false;
  try {
    return crypto.timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

// Every digest Rippily could plausibly have sent, labelled so a match tells us
// exactly which convention is in use.
function buildDigests(secret, raw, timestamp) {
  const bases = [{ scheme: 'body', buf: raw }];
  if (timestamp) {
    bases.push({
      scheme: 'timestamp.body',
      buf: Buffer.concat([Buffer.from(`${timestamp}.`, 'utf8'), raw])
    });
  }

  const digests = [];
  for (const base of bases) {
    const mac = crypto.createHmac('sha256', secret).update(base.buf).digest();
    digests.push({ scheme: base.scheme, encoding: 'hex', value: mac.toString('hex') });
    digests.push({ scheme: base.scheme, encoding: 'base64', value: mac.toString('base64') });
  }
  return digests;
}

// Pull every comparable token out of a header value. Covers a bare digest,
// a prefixed one such as sha256=<digest>, and comma separated pairs such as
// t=<ts>,v1=<digest>.
function candidateTokens(value) {
  const tokens = [];
  for (const part of String(value).split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    tokens.push(trimmed);
    const eq = trimmed.indexOf('=');
    if (eq > -1) tokens.push(trimmed.slice(eq + 1).trim());
  }
  return tokens;
}

function verifySignature({ raw, headers, secret, pin = {} }) {
  if (!secret) return { ok: false, reason: 'no_secret_configured' };

  const timestamp = headerValue(headers, TIMESTAMP_HEADERS);
  let digests = buildDigests(secret, raw, timestamp && timestamp.value);

  // Once the scheme is known, pin it so only one comparison is ever made.
  if (pin.encoding) digests = digests.filter((d) => d.encoding === pin.encoding);
  if (pin.scheme) digests = digests.filter((d) => d.scheme === pin.scheme);
  if (!digests.length) return { ok: false, reason: 'no_digest_candidates' };

  const names = pin.header ? [pin.header.toLowerCase()] : SIGNATURE_HEADERS;
  const seen = [];

  for (const name of names) {
    const value = headers[name];
    if (!value) continue;
    seen.push(name);

    for (const token of candidateTokens(Array.isArray(value) ? value[0] : value)) {
      for (const digest of digests) {
        const match = digest.encoding === 'hex'
          ? safeEqual(token.toLowerCase(), digest.value)
          : safeEqual(token, digest.value);

        if (match) {
          return {
            ok: true,
            detected: { header: name, encoding: digest.encoding, scheme: digest.scheme }
          };
        }
      }
    }
  }

  return {
    ok: false,
    reason: seen.length ? 'signature_mismatch' : 'signature_header_missing',
    headersSeen: seen
  };
}

// Names and shapes only, never values. Enough to identify an unrecognised
// signature header without writing a live credential into the logs.
function describeAuthHeaders(headers) {
  const interesting = /signature|sign|hmac|timestamp|delivery|rippily|webhook|event/i;
  return Object.keys(headers || {})
    .filter((name) => interesting.test(name))
    .map((name) => {
      const value = Array.isArray(headers[name]) ? headers[name][0] : String(headers[name]);
      let looksLike = 'other';
      if (/^[a-f0-9]{64}$/i.test(value)) looksLike = 'sha256-hex';
      else if (/^[A-Za-z0-9+/]{43}=$/.test(value)) looksLike = 'sha256-base64';
      else if (value.includes('=')) looksLike = 'prefixed-or-pairs';
      return { name, length: value.length, looksLike };
    });
}


// ── Payload normalisation ───────────────────────────────────────────────────
// Rippily's docs describe the Standard (JSON) format as carrying "full event
// details" without publishing a field list. Probe the plausible shapes so the
// downstream record stays stable whatever the wire format turns out to be, and
// always carry the untouched payload alongside it.
function pick(source, paths) {
  for (const path of paths) {
    let cursor = source;
    let found = true;
    for (const key of path.split('.')) {
      if (cursor && typeof cursor === 'object' && key in cursor) cursor = cursor[key];
      else { found = false; break; }
    }
    if (found && cursor !== undefined && cursor !== null && cursor !== '') return cursor;
  }
  return undefined;
}

function probe(payload, keys) {
  const paths = [];
  for (const key of keys) paths.push(key, `data.${key}`, `payload.${key}`, `event.${key}`);
  return pick(payload, paths);
}

// A payload may name a thing inline ("ripple": "Cairn Hall") rather than nesting
// an object. Treat a bare string as the display name so it is not dropped.
function asObject(value) {
  if (typeof value === 'string') return { name: value };
  if (value && typeof value === 'object') return value;
  return {};
}

function subject(value, keys) {
  if (!value || typeof value !== 'object') return undefined;
  return pick(value, keys);
}

function toIso(value) {
  if (!value) return null;
  if (typeof value === 'number') {
    // Accept both seconds and milliseconds since the epoch.
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeEvent(payload, { deliveryId = null } = {}) {
  const body = payload && typeof payload === 'object' ? payload : {};

  // The event name may sit at the top level or inside an event/data envelope.
  let rawEvent = probe(body, ['event', 'type', 'event_type', 'eventType', 'name']);
  if (rawEvent && typeof rawEvent === 'object') {
    rawEvent = pick(rawEvent, ['type', 'name', 'event', 'event_type', 'eventType']);
  }
  const event = typeof rawEvent === 'string' ? rawEvent : 'unknown';

  let action = null;
  if (/join|enter/i.test(event)) action = 'joined';
  else if (/left|leave|exit|depart/i.test(event)) action = 'left';

  const person = asObject(probe(body, ['participant', 'user', 'member', 'profile', 'actor']));
  const room = asObject(probe(body, ['ripple', 'room', 'space']));
  const community = asObject(probe(body, ['wave', 'community', 'org']));

  return {
    source: 'rippily',
    event,
    action,
    occurredAt: toIso(probe(body, ['timestamp', 'occurred_at', 'occurredAt', 'created_at', 'createdAt', 'time']))
      || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    deliveryId: deliveryId || probe(body, ['id', 'delivery_id', 'deliveryId', 'event_id', 'eventId']) || null,
    participant: {
      id: subject(person, ['id', 'user_id', 'userId', 'participant_id', 'uuid']) || null,
      name: subject(person, ['name', 'display_name', 'displayName', 'full_name', 'username']) || null,
      tagname: subject(person, ['tagname', 'tag_name', 'handle', 'tag']) || null,
      email: subject(person, ['email', 'email_address', 'emailAddress']) || null,
      role: subject(person, ['role', 'member_role', 'memberRole'])
        || probe(body, ['role', 'member_role', 'memberRole']) || null
    },
    ripple: {
      id: subject(room, ['id', 'ripple_id', 'rippleId', 'uuid']) || null,
      shortId: subject(room, ['short_id', 'shortId', 'code', 'slug']) || null,
      name: subject(room, ['name', 'title', 'label']) || null
    },
    wave: {
      id: subject(community, ['id', 'wave_id', 'waveId', 'uuid']) || null,
      name: subject(community, ['name', 'title', 'label']) || null
    },
    raw: body
  };
}

// A log-safe projection. Counts and identifiers survive; names and email do not.
function redactForLog(record) {
  return {
    source: record.source,
    event: record.event,
    action: record.action,
    occurredAt: record.occurredAt,
    deliveryId: record.deliveryId,
    participantId: record.participant.id,
    role: record.participant.role,
    rippleId: record.ripple.id,
    rippleName: record.ripple.name,
    waveId: record.wave.id
  };
}


// ── Outbound forwarding ─────────────────────────────────────────────────────
// Forward before responding. Work scheduled after a serverless response may be
// killed mid flight, and a lost analytics event is worse than a few hundred
// milliseconds of latency. A forwarding failure never changes our status code:
// Rippily auto-disables a webhook after repeated non-2xx responses.
async function forward(url, body, { timeoutMs = 4000, headers = {} } = {}) {
  if (!url) return { forwarded: false, reason: 'not_configured' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    return { forwarded: response.ok, status: response.status };
  } catch (err) {
    return { forwarded: false, reason: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}


// ── CORS ────────────────────────────────────────────────────────────────────
// Defaults to the same open policy as /api/chat.js. Set RIPPILY_ALLOWED_ORIGINS
// to a comma separated list to restrict the signup endpoint to your own site.
function applyCors(req, res, { methods = 'GET,POST,OPTIONS' } = {}) {
  const allowList = (process.env.RIPPILY_ALLOWED_ORIGINS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const origin = req.headers.origin;

  if (!allowList.length) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowList[0]);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}


module.exports = {
  SIGNATURE_HEADERS,
  TIMESTAMP_HEADERS,
  DELIVERY_ID_HEADERS,
  readRawBody,
  headerValue,
  verifySignature,
  describeAuthHeaders,
  normalizeEvent,
  redactForLog,
  forward,
  applyCors
};
