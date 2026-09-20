# n8n workflows

Two importable workflows for the Rippily traffic pipeline. Import them in n8n
with **Workflows > Import from File**.

## Which n8n

    https://hermihook.app.n8n.cloud

An **n8n Cloud** instance on the Starter plan, billed monthly. It is not
self-hosted, and nothing about it depends on a local machine being awake.
n8n's own security mail says so plainly: Cloud instances are patched
automatically, no action needed.

That matters more than it sounds. Importing and activating these workflows is
browser work. It needs no particular computer, so a dead laptop is never the
reason this pipeline is still off.

Confirmed 20 September 2026 two ways: the monthly receipts, and
`N8N_MATURATION_WEBHOOK` in `.env.example`, which already points at the same
host.

| File | What it does |
| --- | --- |
| `rippily-traffic-ingest.json` | Receives forwarded events, drops identity, pairs sessions, appends to a sheet |
| `rippily-traffic-digest.json` | Reads the sheet each morning and emails a plain-language summary |

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

### 1. Create the spreadsheet

One Google Sheet, one tab. The header row must read exactly:

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
