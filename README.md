# bee-cairn-backend

Backend API for Bee &amp; Cairn grief companions, a service of The Lost Travelers Club.

## Endpoints

| Route                   | Method        | Purpose                                              |
| ----------------------- | ------------- | ---------------------------------------------------- |
| `/api/chat`             | POST          | Companion conversation, plus the maturation trigger   |
| `/api/rippily-webhook`  | POST          | Receives Rippily join/leave events (traffic tracking) |
| `/api/rippily-webhook`  | GET           | Health probe: config flags and warm-instance counters |
| `/api/rippily-signup`   | POST          | Website signup, returns the Wave member link          |
| `/api/rippily-signup`   | GET           | Resolves or redirects to a member link, logs the click |

Run `npm test` for the Rippily suite. No dependencies, no network access needed.

---

## Rippily integration

### What Rippily webhooks can and cannot do

Rippily webhooks are **outbound only**. A Wave POSTs to an external URL when a
participant joins or leaves a Ripple, and the two available events are
`participant.joined` and `participant.left`. Each payload is signed with a
per-webhook secret. Webhooks require a Starter plan or higher.

That covers **traffic tracking** completely.

It does **not** cover adding members. There is no inbound webhook and no
published server-to-server API for creating a Wave member, so a website signup
cannot be pushed into Rippily as a membership record. The supported automation
path is a **Member Link**: a shareable URL created in
`Wave > People > Members > Generate Member Link` that enrols whoever opens it,
carrying its own label, role, pre-assigned access groups and optional max uses.

`/api/rippily-signup` is built on that. It records the signup and hands back the
right member link for the channel. When Rippily publishes a members API, only
`resolveMemberLink` changes.

Reference: <https://go.rippily.com/help/waves/webhooks>

### 1. Traffic tracking

In Rippily, as the account holder, open **Wave > Settings > Webhooks**:

| Field          | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Webhook URL    | `https://<your-deployment>/api/rippily-webhook`                     |
| Payload Format | **Standard (JSON)**                                                 |
| Events         | `participant.joined`, `participant.left`                            |
| Exclude Roles  | administrators, so your own visits stay out of the traffic numbers  |
| Signing Secret | copy into `RIPPILY_WEBHOOK_SECRET`                                  |

Then press **Send Test Event** and watch the logs. See *Pinning the signature
scheme* below.

Verified events are normalised to a stable record and forwarded to
`RIPPILY_TRAFFIC_WEBHOOK`:

```json
{
  "source": "rippily",
  "event": "participant.joined",
  "action": "joined",
  "occurredAt": "2026-09-20T12:00:00.000Z",
  "receivedAt": "2026-09-20T12:00:00.140Z",
  "deliveryId": "…",
  "participant": { "id": "…", "name": "…", "tagname": "…", "email": "…", "role": "member" },
  "ripple":      { "id": "…", "shortId": "…", "name": "…" },
  "wave":        { "id": "…", "name": "…" },
  "verified": true,
  "raw": { }
}
```

`raw` always carries Rippily's untouched payload, so nothing is lost if a field
is named differently than the normaliser expects.

Notes on behaviour that matters in production:

- **Failures never bubble up as a non-2xx.** Rippily auto-disables a webhook
  after repeated failures, so an unreadable body or a dead forward target still
  returns 200. Only a bad signature returns 401, and a missing secret returns 503.
- **Retries are deduplicated** by delivery id within a warm instance.
- **Counters on the GET probe are per warm instance** and reset on cold start.
  They are a health signal. Real totals come from the forward target, or from
  **Wave > Analytics** in Rippily itself.
- **Participant names and email never reach the platform logs.** They go to the
  forward target, which is storage. Logs carry ids, roles and counts.

### 2. Website signups

Generate a member link per channel in `Wave > People > Members`, label each one
(`Social profile link`, `Newsletter`, and so on), and set them in
`RIPPILY_MEMBER_LINKS`. Rippily's own usage count per link then does the
attribution for you.

Post a signup:

```js
const res = await fetch('/api/rippily-signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'traveller@example.com',
    name: 'Traveller',
    channel: 'newsletter',
    consent: true
  })
});
const { joinUrl } = await res.json();
window.location.href = joinUrl;   // Rippily completes the enrolment
```

Or skip the form entirely and point a button at:

```
/api/rippily-signup?channel=newsletter&redirect=1
```

which logs the click and 302s to that channel's member link.

If a channel has no link of its own, the default link is served and the response
reports `channel: "default"` rather than claiming an attribution that did not
happen.

### 3. Pinning the signature scheme

Rippily's documentation confirms every payload is signed but does not publish
the header name, digest encoding, or signed string. Rather than guess one and
fail silently, the receiver tries the plausible conventions and tells you which
one matched:

1. Set `RIPPILY_WEBHOOK_SECRET` and deploy.
2. Press **Send Test Event** in the Wave.
3. Look for `rippily.webhook.detected` in the logs:
   `{"header":"x-rippily-signature","encoding":"hex","scheme":"body"}`
4. Set `RIPPILY_SIGNATURE_HEADER`, `RIPPILY_SIGNATURE_ENCODING` and
   `RIPPILY_SIGNATURE_SCHEME` to those values. The receiver now checks one
   digest per request instead of six.

If nothing matches, the `rippily.webhook.unverified` line lists the header names
and digest shapes that did arrive, which is what the pinning needs. Set
`RIPPILY_ALLOW_UNSIGNED=true` for that one diagnostic delivery, then remove it.

Covered conventions: bare hex, `sha256=` prefixed hex, base64, uppercase hex,
`t=…,v1=…` pairs with a timestamp header, across six candidate header names.

### 4. Where the numbers live

**Wave > Analytics** in Rippily already reports activity across the community,
for account holders and administrators. This integration is for the things
analytics cannot do: joining Rippily traffic to your own records, reacting to a
join in real time, and attributing members back to the channel that sent them.

## Environment variables

See `.env.example`. `RIPPILY_WEBHOOK_SECRET` and one of `RIPPILY_MEMBER_LINK` /
`RIPPILY_MEMBER_LINKS` are the only required additions; every other Rippily
variable is optional and degrades to logging.
