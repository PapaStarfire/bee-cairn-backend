// Build Version: 1.0 — September 2026
// Rippily traffic webhook receiver — The Lost Travelers Club
//
// PURPOSE:
// Receives participant.joined and participant.left events from a Rippily Wave,
// verifies the signature, normalises the payload into one stable shape, and
// forwards it to wherever the traffic record lives.
//
// RIPPILY SETUP (Wave > Settings > Webhooks, account holder only):
//   Webhook URL    https://<your-deployment>/api/rippily-webhook
//   Payload Format Standard (JSON)
//   Events         participant.joined, participant.left
//   Exclude Roles  administrators, so your own comings and goings stay out of
//                  the traffic numbers
//   Signing Secret copy it into RIPPILY_WEBHOOK_SECRET
// Webhooks require a Starter plan or higher.
//
// ENVIRONMENT:
//   RIPPILY_WEBHOOK_SECRET     required. The signing secret from the Wave.
//   RIPPILY_TRAFFIC_WEBHOOK    optional. Where verified events are forwarded,
//                              for example an n8n Traffic Log webhook.
//   RIPPILY_ALLOW_UNSIGNED     optional. "true" accepts unverified deliveries.
//                              Use only for the first Test Event, then remove.
//   RIPPILY_SIGNATURE_HEADER   optional. Pin the header once it is known.
//   RIPPILY_SIGNATURE_ENCODING optional. "hex" or "base64".
//   RIPPILY_SIGNATURE_SCHEME   optional. "body" or "timestamp.body".
//
// FIRST RUN:
// Set the secret, deploy, then press Send Test Event in the Wave. The handler
// logs a rippily.webhook.detected line naming the header, encoding, and signed
// string that matched. Pin those three values and the scheme is locked. If
// nothing matches, the rippily.webhook.unverified line lists the header names
// and digest shapes that did arrive, which is what the pinning needs.

'use strict';

const {
  readRawBody,
  headerValue,
  verifySignature,
  describeAuthHeaders,
  normalizeEvent,
  redactForLog,
  forward,
  applyCors,
  DELIVERY_ID_HEADERS
} = require('../lib/rippily');

// Per-instance counters. A serverless instance is short lived and there may be
// many at once, so these are a warm-instance health signal, never the numbers
// you report from. The durable record is whatever RIPPILY_TRAFFIC_WEBHOOK feeds.
const counters = {
  since: new Date().toISOString(),
  joined: 0,
  left: 0,
  other: 0,
  unverified: 0,
  forwardFailures: 0
};

// Small ring of recently seen delivery ids. Rippily retries a delivery that did
// not succeed, so a retry that arrives after we already forwarded is dropped.
const recentDeliveries = new Set();
const RECENT_LIMIT = 200;

function alreadyHandled(deliveryId) {
  if (!deliveryId) return false;
  if (recentDeliveries.has(deliveryId)) return true;
  recentDeliveries.add(deliveryId);
  if (recentDeliveries.size > RECENT_LIMIT) {
    recentDeliveries.delete(recentDeliveries.values().next().value);
  }
  return false;
}


module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'GET,POST,OPTIONS' });

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET is a health probe. Counts and configuration flags only, no participant
  // data, so the URL stays safe to open from a phone while you are mid event.
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      endpoint: 'rippily-webhook',
      secretConfigured: Boolean(process.env.RIPPILY_WEBHOOK_SECRET),
      unsignedAllowed: process.env.RIPPILY_ALLOW_UNSIGNED === 'true',
      forwarding: Boolean(process.env.RIPPILY_TRAFFIC_WEBHOOK),
      instanceCounters: counters,
      note: 'Counters are per warm instance and reset on cold start. Use the forward target for real totals.'
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.RIPPILY_WEBHOOK_SECRET;
  const allowUnsigned = process.env.RIPPILY_ALLOW_UNSIGNED === 'true';

  if (!secret && !allowUnsigned) {
    console.error('rippily.webhook.misconfigured: RIPPILY_WEBHOOK_SECRET is not set');
    // 503 rather than 200. Rippily will surface the failure in Recent Deliveries
    // instead of silently recording traffic we cannot trust.
    return res.status(503).json({ error: 'Webhook endpoint not configured' });
  }

  try {
    const { raw, exact } = await readRawBody(req);

    const verification = verifySignature({
      raw,
      headers: req.headers,
      secret,
      pin: {
        header: process.env.RIPPILY_SIGNATURE_HEADER,
        encoding: process.env.RIPPILY_SIGNATURE_ENCODING,
        scheme: process.env.RIPPILY_SIGNATURE_SCHEME
      }
    });

    if (verification.ok) {
      // Printed on every delivery until the three values are pinned. Once
      // RIPPILY_SIGNATURE_HEADER, _ENCODING and _SCHEME match this line, the
      // handler stops trying alternatives.
      if (!process.env.RIPPILY_SIGNATURE_HEADER) {
        console.log('rippily.webhook.detected:', JSON.stringify(verification.detected));
      }
    } else {
      counters.unverified += 1;
      console.warn('rippily.webhook.unverified:', JSON.stringify({
        reason: verification.reason,
        rawBodyExact: exact,
        headers: describeAuthHeaders(req.headers)
      }));

      if (!allowUnsigned) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    let payload;
    try {
      payload = raw.length ? JSON.parse(raw.toString('utf8')) : {};
    } catch {
      console.warn('rippily.webhook.unparseable: body was not JSON');
      // Still a 200. A malformed body is our problem to read, and a non-2xx
      // counts toward the failure streak that auto-disables the webhook.
      return res.status(200).json({ ok: true, ignored: 'unparseable_body' });
    }

    const delivery = headerValue(req.headers, DELIVERY_ID_HEADERS);
    const record = normalizeEvent(payload, { deliveryId: delivery && delivery.value });

    if (alreadyHandled(record.deliveryId)) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    if (record.action === 'joined') counters.joined += 1;
    else if (record.action === 'left') counters.left += 1;
    else counters.other += 1;

    console.log('rippily.traffic:', JSON.stringify({
      ...redactForLog(record),
      verified: verification.ok
    }));

    const result = await forward(process.env.RIPPILY_TRAFFIC_WEBHOOK, {
      ...record,
      verified: verification.ok
    });

    if (process.env.RIPPILY_TRAFFIC_WEBHOOK && !result.forwarded) {
      counters.forwardFailures += 1;
      console.error('rippily.traffic.forward_failed:', JSON.stringify(result));
    }

    // Always 200 once the signature is good. Forwarding is our downstream
    // concern, not a reason for Rippily to start counting failures.
    return res.status(200).json({ ok: true, event: record.event, action: record.action });

  } catch (error) {
    console.error('rippily.webhook.error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Ask the platform not to consume the request stream, so the HMAC is computed
// over the exact bytes Rippily signed. This must be assigned after the handler
// export, which replaces module.exports wholesale. lib/rippily.js degrades
// gracefully if a host ignores this, and reports in the logs that it did.
module.exports.config = { api: { bodyParser: false } };
