# HANDOFF: Rippily, the counter, and the connector

Written 20 September 2026, gone 1am. Start a fresh chat and read this first.

---

## WHERE TO PICK UP

Say **"connector"** and the next session knows to start at open item one.

---

## OPEN ITEMS

### 1. The n8n connector will not connect

The button to authorize is greyed out. The reason is visible from the tools:

    name:          n8n
    installState:  connect_incomplete
    connected:     false
    enabledInChat: false

`connect_incomplete` means it was added but the OAuth handshake never
finished. It is a stub, neither connected nor absent, and the interface
will not authorize on top of it.

**Remove and re-add does NOT fix it. Tried 20 September, three times.**
After a clean removal the entry came back with the identical
`installedServerId` and the identical `connect_incomplete` state, so the
stub was never what blocked the authorize. Do not spend another round on
this. It was the first guess and it was wrong.

**The n8n side is ruled out too.** Checked late on 20 September:

- `Enable MCP access` is ON. Hermi checked it twice.
- `https://claude.ai/api/mcp/auth_callback` was added to Allowed
  callback URLs under Only trusted URLs. Still failed.

The Server URL is shown under **Connect a client** and ends in
`/mcp-server/http`, so for this instance
`https://hermihook.app.n8n.cloud/mcp-server/http`.

**Everything a user can click has now been tried.** Four attempts, and
three separate diagnoses from Claude that all turned out to be wrong.
Do not open tomorrow by trying any of them again.

**Start instead by asking whether this is a known defect rather than a
misconfiguration.** There are open issues against Anthropic's own
connector naming n8n specifically, including one where consent is
approved and the code issued but Claude never calls the token endpoint,
which matches this symptom closely:

    https://github.com/anthropics/claude-ai-mcp/issues/140
    https://github.com/anthropics/claude-ai-mcp/issues/1029

Those are filed against self-hosted instances and this one is Cloud, so
they may not apply. Read them before touching any setting. If it is a
known defect, the correct action is to wait, not to keep clicking.

**Nothing depends on this.** The connector only lets Claude drive n8n.
The counter in item two can be switched on by hand at any time, and the
four Rippily cues in item three need no connector at all. If tomorrow
has limited patience, spend it on item two.

**Removing a connector needs a desktop browser.** The phone offers
Connect as the only option and no way to remove one already present.

**Do not run `claude mcp add` for n8n in a cloud session.** The `/mcp`
screen suggests it and it cannot work. This container is refused by the
egress gateway for `hermihook.app.n8n.cloud`, confirmed 20 September:
`connect_rejected` on CONNECT and a 403 from the gateway, the same policy
that blocks thevirtualhermit.quest and docs.n8n.io. The config would
write and then fail on every call, and the container is ephemeral anyway.

This does not condemn the claude.ai connector. That one runs at account
level through Anthropic's MCP proxy rather than this container's egress,
so it is not subject to that block.

**There are two switches.** Account level, then enabled for the specific
chat. Both must be on before the tools appear.

Do not ask n8n's own assistant how to connect Claude. It was asked on
20 September, looked for Claude as a server inside n8n, which is the
opposite direction, and sent Hermi in a circle. Asking it where the
instance-level MCP page is, or whether MCP access is enabled, is fair
game and squarely its business.

### 2. The counter is still off, and it is not blocked by item one

This is the one that matters. Council Two's Empty Chair named it: every
plan for these rooms is being made without knowing whether anyone is in
them.

The instance is **hermihook.app.n8n.cloud**, n8n Cloud on the Starter
plan, paid 19 September, patched automatically. It is not self-hosted
and it does not need any particular machine awake. The connector in item
one is for Claude's convenience only. None of the steps below need it.

1. Open the instance, Workflows, Import from File, both JSON files in `n8n/`
2. On **Rippily traffic in**, create a Header Auth credential, header name
   `X-Bee-Cairn-Token`, value a token invented now
3. On **Append to traffic sheet**, pick the Google Sheets credential and the
   sheet already created in an earlier session
4. Activate, then copy the production webhook URL
5. In Vercel set `RIPPILY_TRAFFIC_WEBHOOK` to that URL and
   `RIPPILY_FORWARD_TOKEN` to the same token from step 2, then redeploy

Steps 2 and 5 must carry the identical value or the pipe is open to
anyone who finds the URL.

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
  Substack and World Anvil. Not a fault to retry.

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
