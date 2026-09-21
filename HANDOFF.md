# HANDOFF: Rippily, the counter, and the connector

Written 20 September 2026, gone 1am. Updated 21 September 2026.
Start a fresh chat and read this first.

---

## WHERE TO PICK UP

Items one and two are closed. Say **"switches"** and the next session knows to
start at the four human-only switches below.

### THE FOUR SWITCHES

Nothing else moves until these are thrown. None of them can be done by Claude,
from any machine, for reasons recorded under FACTS below.

1. **n8n, the auth header.** The ingest webhook picked up the existing
   *Header Auth account* credential, which uses header name `x-api-key`. The
   backend defaults to `X-Bee-Cairn-Token`. Either make a new credential with
   the backend's name, or set `RIPPILY_FORWARD_HEADER=x-api-key` in Vercel and
   use that credential's existing value. Until the name and value match on both
   sides, every delivery is refused with 403.
2. **Vercel, five variables.** `RIPPILY_WEBHOOK_SECRET` from the Rippily Wave,
   `RIPPILY_TRAFFIC_WEBHOOK` set to
   `https://hermihook.app.n8n.cloud/webhook/bee-and-cairn-rippily-traffic`,
   `RIPPILY_FORWARD_TOKEN` matching switch one, `RIPPILY_FORWARD_HEADER` if
   switch one took the reuse route, and `RIPPILY_MEMBER_LINK` from switch four.
3. **Rippily, the webhook.** Wave, Settings, Webhooks. Point it at
   `/api/rippily-webhook`, format Standard (JSON), both events, exclude
   administrators. Then Send Test Event and read the logs for
   `rippily.webhook.detected`, which names the signature scheme so it can be
   pinned.
4. **Rippily, a member link.** Wave, People, Members, Generate Member Link. One
   per channel so the usage count does the attribution. This is the whole of the
   signup half and it has not been started.

---

## OPEN ITEMS

### 1. CLOSED. The n8n connector connects

Resolved 21 September. The connector reports `connected: true` and its tools
are live. Whatever the four attempts on 20 September were fighting, it is no
longer present. Do not spend any time here.

The prior diagnosis stands as a warning rather than a task: remove and re-add
did not fix it, the n8n side was correctly configured throughout, and three
separate diagnoses were wrong. If it ever fails this way again, the two issues
filed against Anthropic's connector remain the first place to look, and waiting
was the right answer:

    https://github.com/anthropics/claude-ai-mcp/issues/140
    https://github.com/anthropics/claude-ai-mcp/issues/1029

**Do not run `claude mcp add` for n8n in a cloud session.** Still true. The
container is refused by the egress gateway for `hermihook.app.n8n.cloud`. The
claude.ai connector runs at account level through Anthropic's MCP proxy and is
not subject to that block, which is why it works while the container cannot.

**There are two switches.** Account level, then enabled for the specific chat.
Both must be on before the tools appear.

### 2. CLOSED. The counter is built and the ingest is live

Built 21 September through the n8n connector, not imported from file. Both
workflows exist in n8n on **hermihook.app.n8n.cloud**, in the personal project.

| Workflow | State |
| --- | --- |
| Bee and Cairn: Rippily traffic ingest | Active |
| Bee and Cairn: Rippily traffic digest | Built, waiting on a Gmail credential |

Ingest: `0KWCpiSwlu3IBEcY`. Digest: `xCxuZcyYrl5k5eY0`.
Sheet: `16YEMBRpzeEf3QuGJLvO_NVQ1KrK_F25ug_K7EY-7L9Y`, tab `Untitled`, gid
`485185429`. Header row is type, recordedAt, occurredAt, action, participantId,
role, rippleId, rippleName, waveName, durationSeconds, verified, detail.

**Verified end to end.** A delivery carrying `name`, `tagname` and `email` ran
through the live ingest and produced two sheet rows. None of the three reached
the spreadsheet. Identity is dropped at the door and never written, because
counting who enters a room is reasonable and keeping a named record of when
someone sat in a grief room at two in the morning is not. Two rows labelled
`Smoke Test Room` remain and can be deleted at will.

**The 20 September step list is superseded.** Step two in particular was wrong
in a way worth remembering: n8n attached the existing Header Auth credential
automatically rather than prompting for a new one, and that credential uses
`x-api-key`. See switch one at the top.

What remains is switches one and two. Neither is blocked by anything technical.

### 3. Four Rippily cues, ready to wire

Build sheet with ticks that save:
<https://claude.ai/artifact/QEDRZa49BJo73ZXteBpnNd>

Integrity dimmer, Bait Box house lights, staging the Randomizer, and a
Cycle draw that picks a person. All four are browser work in the Rippily
editor and need no particular machine.

### 4. Still unanswered

Five questions sit at the foot of the Octopus Flow, and the Gnomes found
six kinks. The ones a fresh session can act on without Hermi:

- Reactions are switched off in all four rooms. Decision or oversight?
- Two different Waves each contain a scene called "Scene 1"
- Four rooms in the grief Wave carry a stop mark. Retired or resting?
- The Rippily profile reads "Dr. Hermi (HC)". Canon forbids the prefix.
  Still present 21 September: the connector reports that display name and the
  tagname `@thevirtualhermit`. Only Hermi can change it, in the Rippily account
  page, since the connector is read-only.
- Bait Box has two zones both named for the Randomizer, at 300x200 and
  945x600. One is a leftover. Find out which before wiring the embed.
- Bait Box has zero snapshots, which is the rehearsal surface you want
  before rules exist that can misfire.

---

## WAITING ON THE CHARGING CORD

A new cord arrives 21 September. Until the Mac wakes, these cannot move:

- Obsidian and the memory vault, including a recount
- `Gnome Orientation`, which the Gnomes could not read
- The Herald section header pipeline on thevirtualhermit.quest
- World Anvil, which needs Chrome on the Mac

---

## FACTS THAT COST TOKENS TO ESTABLISH. DO NOT RE-DERIVE.

- **The Rippily connector is read-only.** Claude cannot create, edit or
  delete anything in a room, from any machine. Every build is a drawing
  Hermi executes. This is by design and documented.
- **The Rippily editor is a web app.** No build has ever needed the Mac.
- **n8n is Cloud, not self-hosted.** See item two.
- **Every room has zero rules.** Four flagship rooms were read, one per
  Wave, out of forty-four. Zero of a possible hundred in each, and
  nothing has ever fired.
- **The Randomizer already exists** as the `bait-box-cinema` Worker: two
  hundred films in KV, three reel draw, Fisher-Yates shuffle, a 0.06
  penalty against recent draws, synthesised sound. Do not rebuild it in
  Rippily variables. That would be a downgrade.
- **Do not scene-switch to dim the Bait Box.** The `Lights Down` scene is
  empty and zones are scene-scoped, so the switch takes Screen 1 with it.
  Dim in place with a shape on `Show when`.
- **Set Variable needs Affects: Everyone.** On the default a dim happens
  only for whoever clicked.
- **A cloud session is refused by the gateway**, 403, for
  thevirtualhermit.quest, losttravelers.club, virtualhermit.love,
  Substack and World Anvil. Not a fault to retry. **Vercel preview and
  production URLs are refused the same way**, confirmed 21 September, so a
  cloud session can never smoke test the deployed endpoints. The n8n side can
  be tested, because the connector runs through Anthropic's proxy rather than
  the container.
- **The n8n connector cannot create credentials.** It builds, publishes and
  executes workflows, but the API exposes no credential creation at all. Every
  credential is a human step in the browser. This is why switch one exists.
- **n8n auto-attaches a matching credential.** Asking for a new one by name
  does not guarantee a new one. If a credential of the right type already
  exists it is silently attached instead, and its settings may be wrong for the
  new use. Always read back the trigger info after creating a workflow: it
  names the header the webhook will actually require.
- **There is no Vercel connector.** Environment variables are a human step.

---

## WHAT THIS SESSION DID

Branch `claude/octopus-flow-updates-lhrkj6`, six commits, tests 30 passed
0 failed, pushed and not merged.

- Found the Octopus Flow, which had not swum away. It was never on
  Cloudflare. It is a Claude artifact and had not been touched since
  8 August: <https://claude.ai/artifact/H8LthPSNF8C9T9oR2Q538C>
- Converged it with the second map, The Octopus, which it now supersedes.
  Added Plate II, the gate loop. Rule five rescoped to "Photoreal
  everywhere. Engraved in the Herald." Restored `Gnome Orientation`,
  which an earlier pass had dropped.
- Wrote the Rippily special report:
  <https://claude.ai/artifact/5kARW3yf6oqvNgFQAjCRPD>
- Wrote `herald/DISTRIBUTION.md`, how an edition reaches each place
- Merged the Herald docs onto this branch. They had been stranded on an
  unmerged branch, so a fresh clone of main saw none of them.
- Named the n8n instance in `n8n/README.md` and cleared the last five em
  dashes in the repository

---

## ONE NOTE ON REGISTER

Everything here is Canon Two. The Herald is the only Hermification
venue, and none of this is the Herald.
