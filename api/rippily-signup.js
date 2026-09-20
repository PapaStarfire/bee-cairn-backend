// Build Version: 1.0 — September 2026
// Website signup to Rippily Wave membership — The Lost Travelers Club
//
// WHY THIS IS NOT A WEBHOOK:
// Rippily webhooks run one direction only, Rippily to us, and carry two events:
// participant.joined and participant.left. There is no inbound webhook and no
// published server-to-server API for creating a Wave member, so a website
// signup cannot be pushed into Rippily as a membership record.
//
// What Rippily does support is a Member Link: a shareable URL, created in
// Wave > People > Members > Generate Member Link, that enrols whoever opens it.
// Each link carries its own label, role, pre-assigned access groups and optional
// max uses, and Rippily counts its usage. The documentation's own advice is to
// create separate links per channel so you can see where members come from.
//
// So the flow is: website signup lands here, we record it, and we hand back the
// Member Link for that channel. The traveller finishes enrolment on Rippily,
// and /api/rippily-webhook sees them arrive.
//
// ENVIRONMENT:
//   RIPPILY_MEMBER_LINK      the default Member Link URL.
//   RIPPILY_MEMBER_LINKS     optional JSON map of channel to Member Link, e.g.
//                            {"newsletter":"<link copied from Rippily>",
//                             "companion":"<link copied from Rippily>"}
//                            Generate one link per channel so Rippily's own
//                            usage counts double as attribution.
//   RIPPILY_SIGNUP_WEBHOOK   optional. Where signups are forwarded, for example
//                            an n8n webhook that files them and sends a welcome.
//   RIPPILY_ALLOWED_ORIGINS  optional. Comma separated origins allowed to call
//                            this endpoint. Defaults to open, as /api/chat.js is.
//
// WHEN RIPPILY SHIPS A MEMBERS API:
// Only resolveMemberLink and the success branch of the POST handler change. The
// intake contract, the forwarding, and the website stay exactly as they are.

'use strict';

const { forward, forwardAuthHeaders, applyCors } = require('../lib/rippily');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Per-instance throttle. This endpoint is public and takes an email address, so
// a warm instance refuses an address or address family that floods it. Real
// abuse protection belongs at the edge; this is the floor, not the ceiling.
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;
const rateBuckets = new Map();

function rateLimited(key) {
  const now = Date.now();
  const hits = (rateBuckets.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateBuckets.set(key, hits);

  if (rateBuckets.size > 500) {
    for (const [bucket, stamps] of rateBuckets) {
      if (!stamps.some((t) => now - t < RATE_WINDOW_MS)) rateBuckets.delete(bucket);
    }
  }
  return hits.length > RATE_MAX;
}

function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

// Channel names become part of an attribution record, so keep them boring.
function cleanChannel(value) {
  if (!value) return 'default';
  const cleaned = String(value).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  return cleaned || 'default';
}

function resolveMemberLink(channel) {
  let map = {};
  if (process.env.RIPPILY_MEMBER_LINKS) {
    try {
      map = JSON.parse(process.env.RIPPILY_MEMBER_LINKS);
    } catch {
      console.error('rippily.signup.bad_config: RIPPILY_MEMBER_LINKS is not valid JSON');
    }
  }

  const url = map[channel] || process.env.RIPPILY_MEMBER_LINK || map.default || null;
  // Report the channel we actually served, so attribution never claims a
  // per-channel link that quietly fell back to the default one.
  return { url, resolvedChannel: map[channel] ? channel : 'default' };
}


module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'GET,POST,OPTIONS' });

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET is a link resolver. Point a site button at
  //   /api/rippily-signup?channel=newsletter&redirect=1
  // and the click is logged here before the traveller is handed to Rippily.
  // No email is collected on this path, so nothing is recorded but the click.
  if (req.method === 'GET') {
    const channel = cleanChannel(req.query && req.query.channel);
    const { url, resolvedChannel } = resolveMemberLink(channel);

    if (!url) {
      return res.status(503).json({ error: 'No Rippily member link configured' });
    }

    console.log('rippily.signup.click:', JSON.stringify({
      channel,
      servedChannel: resolvedChannel,
      at: new Date().toISOString()
    }));

    if (req.query && (req.query.redirect === '1' || req.query.redirect === 'true')) {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Location', url);
      return res.status(302).end();
    }

    return res.status(200).json({ ok: true, joinUrl: url, channel: resolvedChannel });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, name, message, consent } = body;
    const channel = cleanChannel(body.channel || body.source);

    if (!email || typeof email !== 'string' || !EMAIL.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    if (rateLimited(clientKey(req))) {
      return res.status(429).json({ error: 'Too many signups from this address. Try again shortly.' });
    }

    const { url, resolvedChannel } = resolveMemberLink(channel);
    if (!url) {
      console.error('rippily.signup.misconfigured: no member link for channel', channel);
      return res.status(503).json({ error: 'Signups are not configured yet' });
    }

    const record = {
      source: 'website',
      destination: 'rippily',
      channel,
      servedChannel: resolvedChannel,
      email: email.trim().toLowerCase(),
      name: typeof name === 'string' ? name.trim().slice(0, 120) : null,
      message: typeof message === 'string' ? message.trim().slice(0, 1000) : null,
      consent: consent === true,
      joinUrl: url,
      receivedAt: new Date().toISOString()
    };

    // Channel and outcome only. The email address goes to the forward target,
    // which is storage, and never into the platform logs.
    console.log('rippily.signup:', JSON.stringify({
      channel,
      servedChannel: resolvedChannel,
      consent: record.consent,
      at: record.receivedAt
    }));

    const result = await forward(process.env.RIPPILY_SIGNUP_WEBHOOK, record, { headers: forwardAuthHeaders() });

    if (process.env.RIPPILY_SIGNUP_WEBHOOK && !result.forwarded) {
      // The traveller still gets their link. Losing the copy in our records is
      // not a reason to leave them standing outside the door.
      console.error('rippily.signup.forward_failed:', JSON.stringify(result));
    }

    return res.status(200).json({
      ok: true,
      joinUrl: url,
      channel: resolvedChannel,
      recorded: result.forwarded === true
    });

  } catch (error) {
    console.error('rippily.signup.error:', error);
    return res.status(500).json({ error: 'Signup failed' });
  }
};
