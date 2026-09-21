// Build Version: 1.0 — September 2026
// Rippily integration test suite — The Lost Travelers Club
//
// Zero dependencies. Run with: npm test
//
// Exercises both Rippily endpoints against mock request and response objects
// and a real local HTTP sink, so the forwarding path is genuinely called rather
// than stubbed. The signature block covers every convention the receiver is
// built to auto-detect, because Rippily's documentation confirms that payloads
// are signed without publishing the header name or digest encoding.

'use strict';
const crypto = require('crypto');
const http = require('http');
const { Readable } = require('stream');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SECRET = 'whsec_test_secret_123';

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ', name); }
  else { fail++; console.log('  FAIL ', name, extra !== undefined ? JSON.stringify(extra) : ''); }
}

function mockRes() {
  const res = {
    statusCode: null, headers: {}, body: undefined, ended: false,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; return this; },
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; this.ended = true; return this; },
    end() { this.ended = true; return this; }
  };
  return res;
}

// Simulates bodyParser:false — handler reads the live stream.
function streamReq({ method = 'POST', headers = {}, raw = '', query = {} }) {
  const req = Readable.from([Buffer.from(raw, 'utf8')]);
  req.method = method;
  req.headers = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  req.query = query;
  req.socket = { remoteAddress: '203.0.113.7' };
  return req;
}

// Simulates a host that parsed the body first.
function parsedReq({ method = 'POST', headers = {}, body = {}, query = {} }) {
  return {
    method,
    headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
    body, query, readable: false,
    socket: { remoteAddress: '203.0.113.9' }
  };
}

function sign(raw, { encoding = 'hex', prefix = '', secret = SECRET, ts = null } = {}) {
  const buf = ts ? Buffer.concat([Buffer.from(`${ts}.`), Buffer.from(raw)]) : Buffer.from(raw);
  return prefix + crypto.createHmac('sha256', secret).update(buf).digest(encoding);
}

function fresh(mod) {
  delete require.cache[require.resolve(path.join(ROOT, mod))];
  delete require.cache[require.resolve(path.join(ROOT, 'lib/rippily.js'))];
  return require(path.join(ROOT, mod));
}

(async () => {
  // ── Local sink so forwarding is genuinely exercised ──
  const received = [];
  const receivedHeaders = [];
  const sink = http.createServer((req, res) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => {
      receivedHeaders.push(req.headers);
      received.push(JSON.parse(data));
      res.writeHead(200); res.end('{}');
    });
  });
  await new Promise((r) => sink.listen(0, '127.0.0.1', r));
  const SINK = `http://127.0.0.1:${sink.address().port}/hook`;

  const lib = require(path.join(ROOT, 'lib/rippily.js'));

  // ── 1. Signature scheme coverage ──
  console.log('\n[1] Signature verification across plausible schemes');
  const raw = JSON.stringify({ event: 'participant.joined' });
  const variants = [
    ['bare hex, x-rippily-signature', { 'x-rippily-signature': sign(raw) }, 'hex', 'body'],
    ['sha256= prefixed hex',          { 'x-rippily-signature': sign(raw, { prefix: 'sha256=' }) }, 'hex', 'body'],
    ['base64',                        { 'x-rippily-signature': sign(raw, { encoding: 'base64' }) }, 'base64', 'body'],
    ['uppercase hex',                 { 'x-rippily-signature': sign(raw).toUpperCase() }, 'hex', 'body'],
    ['x-hub-signature-256',           { 'x-hub-signature-256': sign(raw, { prefix: 'sha256=' }) }, 'hex', 'body'],
    ['stripe-style t=,v1= + ts',      { 'x-rippily-timestamp': '1700000000', 'x-rippily-signature': `t=1700000000,v1=${sign(raw, { ts: '1700000000' })}` }, 'hex', 'timestamp.body']
  ];
  for (const [label, headers, enc, scheme] of variants) {
    const v = lib.verifySignature({ raw: Buffer.from(raw), headers, secret: SECRET });
    check(label, v.ok && v.detected.encoding === enc && v.detected.scheme === scheme, v);
  }
  check('wrong secret rejected',
    lib.verifySignature({ raw: Buffer.from(raw), headers: { 'x-rippily-signature': sign(raw, { secret: 'nope' }) }, secret: SECRET }).ok === false);
  check('tampered body rejected',
    lib.verifySignature({ raw: Buffer.from(raw + ' '), headers: { 'x-rippily-signature': sign(raw) }, secret: SECRET }).ok === false);
  check('missing header reported',
    lib.verifySignature({ raw: Buffer.from(raw), headers: {}, secret: SECRET }).reason === 'signature_header_missing');
  check('pinned header ignores others',
    lib.verifySignature({ raw: Buffer.from(raw), headers: { 'x-hub-signature-256': sign(raw) }, secret: SECRET, pin: { header: 'x-rippily-signature' } }).ok === false);

  // ── 2. Payload normalisation across plausible shapes ──
  console.log('\n[2] Payload normalisation');
  const flat = lib.normalizeEvent({
    event: 'participant.joined', timestamp: '2026-09-20T10:00:00Z',
    participant: { id: 'u1', display_name: 'Ada', tagname: '@ada', role: 'member' },
    ripple: { id: 'r1', short_id: 'ab12cd34', name: 'The Cairn' },
    wave: { id: 'w1', name: 'Lost Travelers Club' }
  });
  check('flat: action joined', flat.action === 'joined', flat.action);
  check('flat: participant name', flat.participant.name === 'Ada');
  check('flat: ripple shortId', flat.ripple.shortId === 'ab12cd34');
  check('flat: wave name', flat.wave.name === 'Lost Travelers Club');
  check('flat: occurredAt iso', flat.occurredAt === '2026-09-20T10:00:00.000Z', flat.occurredAt);

  const nested = lib.normalizeEvent({
    type: 'participant.left',
    data: { user: { userId: 'u2', name: 'Bo' }, room: { rippleId: 'r2', title: 'Bee' }, community: { name: 'LTC' } }
  });
  check('nested: action left', nested.action === 'left', nested.action);
  check('nested: participant id', nested.participant.id === 'u2');
  check('nested: ripple name', nested.ripple.name === 'Bee');

  const enveloped = lib.normalizeEvent({
    event: { type: 'participant.joined' },
    ripple: 'Cairn Hall',
    participant: 'Wren'
  });
  check('event envelope unwrapped', enveloped.action === 'joined', enveloped.event);
  check('string ripple kept as name', enveloped.ripple.name === 'Cairn Hall', enveloped.ripple);
  check('string participant kept as name', enveloped.participant.name === 'Wren', enveloped.participant);

  check('epoch seconds handled', lib.normalizeEvent({ event: 'x', timestamp: 1700000000 }).occurredAt === '2023-11-14T22:13:20.000Z');
  check('unknown shape survives', lib.normalizeEvent({ mystery: true }).event === 'unknown');
  check('raw payload preserved', lib.normalizeEvent({ mystery: true }).raw.mystery === true);
  check('log projection drops PII', (() => {
    const l = lib.redactForLog(flat);
    return !('email' in l) && !('name' in l) && l.participantId === 'u1';
  })());

  // ── 3. Webhook endpoint ──
  console.log('\n[3] Webhook endpoint behaviour');
  process.env.RIPPILY_WEBHOOK_SECRET = SECRET;
  process.env.RIPPILY_TRAFFIC_WEBHOOK = SINK;
  delete process.env.RIPPILY_ALLOW_UNSIGNED;
  let webhook = fresh('api/rippily-webhook.js');

  const joinBody = JSON.stringify({
    event: 'participant.joined', timestamp: '2026-09-20T12:00:00Z',
    participant: { id: 'u9', display_name: 'Wren', email: 'wren@example.com', role: 'member' },
    ripple: { id: 'r9', name: 'Cairn Hall' }, wave: { id: 'w9', name: 'LTC' }
  });

  let res = mockRes();
  await webhook(streamReq({
    headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-001' },
    raw: joinBody
  }), res);
  check('signed delivery -> 200', res.statusCode === 200, res.body);
  check('action reported', res.body && res.body.action === 'joined', res.body);
  check('forwarded to sink', received.length === 1, received.length);
  check('forwarded email intact', received[0] && received[0].participant.email === 'wren@example.com');
  check('forwarded marked verified', received[0] && received[0].verified === true);

  res = mockRes();
  await webhook(streamReq({
    headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-001' },
    raw: joinBody
  }), res);
  check('retry deduplicated', res.statusCode === 200 && res.body.duplicate === true, res.body);
  check('duplicate not re-forwarded', received.length === 1, received.length);

  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': 'deadbeef' }, raw: joinBody }), res);
  check('bad signature -> 401', res.statusCode === 401, res.body);

  res = mockRes();
  await webhook(streamReq({ raw: joinBody }), res);
  check('no signature -> 401', res.statusCode === 401, res.body);

  const leaveBody = JSON.stringify({ event: 'participant.left', participant: { id: 'u9' }, ripple: { id: 'r9' } });
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign(leaveBody, { prefix: 'sha256=' }) }, raw: leaveBody }), res);
  check('leave event -> 200', res.statusCode === 200 && res.body.action === 'left', res.body);

  // Malformed body must NOT return non-2xx: repeated failures auto-disable the webhook.
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign('not json') }, raw: 'not json' }), res);
  check('unparseable body -> 200 (avoids auto-disable)', res.statusCode === 200 && res.body.ignored === 'unparseable_body', res.body);

  res = mockRes();
  await webhook(streamReq({ method: 'GET', raw: '' }), res);
  check('GET health -> 200', res.statusCode === 200 && res.body.ok === true);
  check('health has no PII', res.body && JSON.stringify(res.body).indexOf('wren@example.com') === -1);
  check('health counters', res.body.instanceCounters.joined === 1 && res.body.instanceCounters.left === 1, res.body.instanceCounters);

  res = mockRes();
  await webhook(streamReq({ method: 'OPTIONS', raw: '' }), res);
  check('OPTIONS -> 200', res.statusCode === 200);

  res = mockRes();
  await webhook(streamReq({ method: 'DELETE', raw: '' }), res);
  check('DELETE -> 405', res.statusCode === 405);

  // Host that pre-parsed the body: re-serialisation still verifies for simple payloads.
  res = mockRes();
  const reparsed = JSON.parse(joinBody);
  await webhook(parsedReq({
    headers: { 'x-rippily-signature': sign(JSON.stringify(reparsed)), 'x-rippily-delivery': 'd-002' },
    body: reparsed
  }), res);
  check('pre-parsed body path works', res.statusCode === 200, res.body);

  // Missing secret must fail closed.
  delete process.env.RIPPILY_WEBHOOK_SECRET;
  webhook = fresh('api/rippily-webhook.js');
  res = mockRes();
  await webhook(streamReq({ raw: joinBody }), res);
  check('no secret configured -> 503', res.statusCode === 503, res.body);

  // Explicit opt-in for the first Test Event.
  process.env.RIPPILY_ALLOW_UNSIGNED = 'true';
  webhook = fresh('api/rippily-webhook.js');
  res = mockRes();
  await webhook(streamReq({ raw: joinBody, headers: { 'x-rippily-delivery': 'd-003' } }), res);
  check('allow-unsigned opt-in -> 200', res.statusCode === 200, res.body);
  check('unsigned marked unverified', received[received.length - 1].verified === false);
  delete process.env.RIPPILY_ALLOW_UNSIGNED;

  // ── 4. Signup endpoint ──
  console.log('\n[4] Signup endpoint behaviour');
  process.env.RIPPILY_MEMBER_LINK = 'https://go.rippily.com/join/default';
  process.env.RIPPILY_MEMBER_LINKS = JSON.stringify({ newsletter: 'https://go.rippily.com/join/news' });
  process.env.RIPPILY_SIGNUP_WEBHOOK = SINK;
  let signup = fresh('api/rippily-signup.js');
  const before = received.length;

  res = mockRes();
  await signup(parsedReq({ body: { email: 'Trav@Example.COM ', name: 'Trav', channel: 'newsletter', consent: true } }), res);
  check('signup -> 200', res.statusCode === 200, res.body);
  check('per-channel link served', res.body.joinUrl === 'https://go.rippily.com/join/news', res.body);
  check('channel attributed', res.body.channel === 'newsletter');
  check('signup forwarded', received.length === before + 1);
  check('email normalised', received[before].email === 'trav@example.com', received[before].email);

  res = mockRes();
  await signup(parsedReq({ body: { email: 'x@y.io', channel: 'podcast' } }), res);
  check('unknown channel falls back to default link', res.body.joinUrl === 'https://go.rippily.com/join/default', res.body);
  check('fallback honestly reported as default', res.body.channel === 'default', res.body);

  res = mockRes();
  await signup(parsedReq({ body: { email: 'nope' } }), res);
  check('invalid email -> 400', res.statusCode === 400, res.body);

  res = mockRes();
  await signup(parsedReq({ body: {} }), res);
  check('missing email -> 400', res.statusCode === 400);

  res = mockRes();
  await signup(parsedReq({ method: 'GET', query: { channel: 'newsletter', redirect: '1' } }), res);
  check('GET redirect -> 302', res.statusCode === 302, res.body);
  check('redirect Location correct', res.headers.location === 'https://go.rippily.com/join/news', res.headers);

  res = mockRes();
  await signup(parsedReq({ method: 'GET', query: { channel: 'newsletter' } }), res);
  check('GET without redirect returns JSON link', res.statusCode === 200 && res.body.joinUrl === 'https://go.rippily.com/join/news');

  res = mockRes();
  await signup(parsedReq({ method: 'GET', query: { channel: '../../evil?x=1' } }), res);
  check('hostile channel sanitised', res.statusCode === 200 && res.body.channel === 'default', res.body);

  // Rate limit: 5 per minute per address, 6th is refused.
  let limited = false;
  for (let i = 0; i < 8; i++) {
    const r = mockRes();
    await signup(parsedReq({ body: { email: `burst${i}@example.com` } }), r);
    if (r.statusCode === 429) limited = true;
  }
  check('rate limit engages', limited);

  // No link configured at all must fail loudly, not hand back undefined.
  delete process.env.RIPPILY_MEMBER_LINK;
  delete process.env.RIPPILY_MEMBER_LINKS;
  signup = fresh('api/rippily-signup.js');
  res = mockRes();
  await signup(parsedReq({ body: { email: 'a@b.co' }, headers: { 'x-forwarded-for': '198.51.100.1' } }), res);
  check('no member link -> 503', res.statusCode === 503, res.body);

  // ── 4b. Shared forward token ──
  console.log('\n[4b] Forward token authenticates the pipe to n8n');
  process.env.RIPPILY_WEBHOOK_SECRET = SECRET;
  process.env.RIPPILY_TRAFFIC_WEBHOOK = SINK;
  process.env.RIPPILY_FORWARD_TOKEN = 'tok_abc123';
  webhook = fresh('api/rippily-webhook.js');
  let before2 = receivedHeaders.length;
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-tok' }, raw: joinBody }), res);
  check('traffic forward carries token header',
    receivedHeaders[before2] && receivedHeaders[before2]['x-bee-cairn-token'] === 'tok_abc123',
    receivedHeaders[before2] && receivedHeaders[before2]['x-bee-cairn-token']);

  process.env.RIPPILY_MEMBER_LINK = 'https://example.invalid/join';
  process.env.RIPPILY_SIGNUP_WEBHOOK = SINK;
  signup = fresh('api/rippily-signup.js');
  before2 = receivedHeaders.length;
  res = mockRes();
  await signup(parsedReq({ body: { email: 'tok@example.com' }, headers: { 'x-forwarded-for': '198.51.100.55' } }), res);
  check('signup forward carries token header',
    receivedHeaders[before2] && receivedHeaders[before2]['x-bee-cairn-token'] === 'tok_abc123');

  // The receiver decides the header name. An n8n Header Auth credential carries
  // one fixed name, and x-api-key is n8n's own default.
  process.env.RIPPILY_FORWARD_HEADER = 'x-api-key';
  webhook = fresh('api/rippily-webhook.js');
  before2 = receivedHeaders.length;
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-tok3' }, raw: joinBody }), res);
  check('custom header name honoured',
    receivedHeaders[before2] && receivedHeaders[before2]['x-api-key'] === 'tok_abc123',
    receivedHeaders[before2] && receivedHeaders[before2]['x-api-key']);
  check('default header not also sent',
    receivedHeaders[before2] && receivedHeaders[before2]['x-bee-cairn-token'] === undefined);

  process.env.RIPPILY_FORWARD_HEADER = '   ';
  webhook = fresh('api/rippily-webhook.js');
  before2 = receivedHeaders.length;
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-tok4' }, raw: joinBody }), res);
  check('blank header name falls back to the default',
    receivedHeaders[before2] && receivedHeaders[before2]['x-bee-cairn-token'] === 'tok_abc123');
  delete process.env.RIPPILY_FORWARD_HEADER;

  delete process.env.RIPPILY_FORWARD_TOKEN;
  webhook = fresh('api/rippily-webhook.js');
  before2 = receivedHeaders.length;
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-tok2' }, raw: joinBody }), res);
  check('no token configured means no header sent',
    receivedHeaders[before2] && receivedHeaders[before2]['x-bee-cairn-token'] === undefined);

  // ── 5. Forward resilience ──
  console.log('\n[5] Forward failure must not break the response');
  process.env.RIPPILY_WEBHOOK_SECRET = SECRET;
  process.env.RIPPILY_TRAFFIC_WEBHOOK = 'http://127.0.0.1:1/dead';
  webhook = fresh('api/rippily-webhook.js');
  res = mockRes();
  await webhook(streamReq({ headers: { 'x-rippily-signature': sign(joinBody), 'x-rippily-delivery': 'd-004' }, raw: joinBody }), res);
  check('dead forward target still -> 200', res.statusCode === 200, res.body);

  sink.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
