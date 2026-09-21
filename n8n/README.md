# n8n workflows

Both workflows are **already built and live** in n8n. The JSON files here are the
version-controlled source of truth, kept in sync so either can be rebuilt or
moved to another instance.

| Workflow | Status | Link |
| --- | --- | --- |
| Bee and Cairn: Rippily traffic ingest | **Active** | [0KWCpiSwlu3IBEcY](https://hermihook.app.n8n.cloud/workflow/0KWCpiSwlu3IBEcY) |
| Bee and Cairn: Rippily traffic digest | Built, not activated | [xCxuZcyYrl5k5eY0](https://hermihook.app.n8n.cloud/workflow/xCxuZcyYrl5k5eY0) |

Production webhook URL, for `RIPPILY_TRAFFIC_WEBHOOK` in Vercel:

```
https://hermihook.app.n8n.cloud/webhook/bee-and-cairn-rippily-traffic
```

Traffic sheet: [Bee and Cairn: Rippily traffic](https://docs.google.com/spreadsheets/d/16YEMBRpzeEf3QuGJLvO_NVQ1KrK_F25ug_K7EY-7L9Y/edit)

## Two things still need a human

Neither can be done through the n8n API, which exposes no credential creation.

**1. The auth header must match on both sides.** The ingest webhook picked up the
existing *Header Auth account* credential, which uses header name `x-api-key`.
The backend defaults to `X-Bee-Cairn-Token`. Pick one:

- *Separate secret, recommended.* Create a new Header Auth credential with header
  `X-Bee-Cairn-Token` and a value of your choosing, assign it to the **Rippily
  traffic in** node, and set the same value as `RIPPILY_FORWARD_TOKEN`.
- *Reuse the existing one.* Set `RIPPILY_FORWARD_HEADER=x-api-key` and
  `RIPPILY_FORWARD_TOKEN` to that credential's existing value. Simpler, but the
  traffic pipe then shares a secret with everything else using that credential.

Until the header name and value match, every delivery is rejected with 403.

**2. The digest needs a Gmail credential.** Connect Gmail in n8n, assign it to the
**Send the digest** node, then activate the workflow. It is deliberately left
inactive so it does not fail every morning in the meantime.

## Verified end to end

A signed test delivery ran through the live ingest on 21 September 2026: the
webhook accepted it, the Code node stripped identity, and two rows landed in the
sheet. The payload carried `name`, `tagname` and `email`; none of the three
reached the spreadsheet. Those two rows are labelled `Smoke Test Room` and can be
deleted whenever you like.

## What gets stored, and what does not

`/api/rippily-webhook` forwards `participant.name`, `participant.tagname` and
`participant.email`. **None of the three reach the sheet.** The ingest workflow
drops them at the door and keeps the pseudonymous `participant.id`, which is
enough to count distinct visitors and pair a session.

This is deliberate. Bee and Cairn holds people at their least defended. Counting
who enters a room is reasonable. Keeping a named record of when someone sat in a
grief room at two in the morning is not, and the safest row is the one that was
never written.

## Setup

### 1. The spreadsheet

Already created, linked above. Its header row reads:

```
type | recordedAt | occurredAt | action | participantId | role | rippleId | rippleName | waveName | durationSeconds | verified | detail
```

Three kinds of row land here, distinguished by `type`:

- `event`: one arrival or departure
- `session`: a join paired with its leave, carrying `durationSeconds`
- `quarantine`: an event whose shape the ingest did not recognise

### 2. Import and configure the ingest workflow

Open `hermihook.app.n8n.cloud` and import the file, then open each node and set
what cannot travel in a file:

- **Rippily traffic in**: create a *Header Auth* credential with header name
  `X-Bee-Cairn-Token` and the value you set as `RIPPILY_FORWARD_TOKEN` in Vercel.
  Without it the webhook URL alone is enough for anyone to write fake traffic.
- **Append to traffic sheet**: select your Google Sheets credential, the
  spreadsheet, and the tab.

Activate the workflow, then copy its production webhook URL into
`RIPPILY_TRAFFIC_WEBHOOK` in Vercel.

### 3. Import the digest workflow

Point **Read traffic sheet** at the same spreadsheet and tab, set the recipient
on **Send the digest**, and select a Gmail credential. It runs at 07:05 daily.

## How sessions are paired

n8n workflow static data holds two small maps between executions: recently seen
delivery ids, and open joins waiting for a leave. A leave closes its join and
writes one `session` row with a duration. Both maps are pruned on every run,
dedup entries after 24 hours and abandoned joins after 12, so neither grows
without bound.

A leave with no join on record still produces a `session` row, marked
`no matching join in window` with no duration. Nothing is silently dropped.

## When the field names turn out to be wrong

Rippily's payload field names are inferred, not documented. Anything the ingest
cannot classify becomes a `quarantine` row with a 500 character preview, and the
morning digest tells you it happened. Read the `detail` column, adjust the
**Strip identity and pair sessions** node, and re-import.

## Testing

`npm test` runs the workflow logic from these JSON files against the exact
record shape the backend forwards, including the check that no name, tagname or
email survives ingest.

## Why these are files and not clicks

A workflow built in the browser has no history and no review. These are version
controlled, diffable, and portable between n8n instances. Node credentials and
spreadsheet selections are per-instance and have to be set in the UI regardless.
