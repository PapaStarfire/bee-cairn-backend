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

Five questions sit at the foot of the Octopus Flow. The Gnomes found six
kinks on 20 September and a fuller audit on 21 September found eight, with
three of the four original questions turning out to have the wrong shape.

All forty-four rooms across all four Waves were read on 21 September, each
with both the overview and the automation tracer. Three of the four
questions had the wrong shape.

- **Reactions are off in all 44 rooms, not four, and it is the default.**
  `reactions_enabled: false` everywhere, with zero capability overrides
  anywhere in the account. The documentation says reactions ship off:
  <https://go.rippily.com/help/editor/ripple-tab#reactions>. So nothing
  switched them off. They have never been switched on. Decide per room
  rather than account-wide, and note a moderator can turn them on live
  from the control bar mid-session, so no gathering is ever stuck without
  them. The rooms where it would matter: Saturday Mourning Cafe, The Lost
  Travelers Club, Integrity Amphitheatre, FolkHeart Forest, The Bait Box
  Cinema.
- **"Scene 1" is in 36 of 44 rooms, across all four Waves, not two.** It is
  a default name never changed. Every one of them carries `order: "a0"` and
  is the oldest scene in its room. Where Hermi cared, he renamed it: Lights
  On, Forest Welcome, Welcome to The Hermit Hut, Diner Interior, Twilight,
  Front. Cosmetic only, since scenes are targeted by id, but it makes the
  editor's scene list hard to read across 36 rooms.
- **The stop mark is a character in the room name, not a platform state.**
  There is no `paused` and no `archived` field anywhere in the data. The
  mark is the emoji Hermi types into the name. **There are five marked
  rooms, not four.** The grief Wave has LuckyLand, IggyLand, Guy-Wire and
  HenleyLand. The fifth is The Hermit's Cell, short id `5adbb67c`, in the
  Hermitage Wave. Inside the grief Wave the convention is clean: the four
  marked rooms are exactly the four unlisted ones, all with location
  sharing off. The Hermit's Cell breaks it, carrying the mark and unlisted
  but with location sharing still on. Also worth knowing: eleven unmarked
  rooms are unlisted too, so the mark is not an index of what is hidden.
- The Rippily profile reads "Dr. Hermi (HC)". Canon forbids the prefix.
  Still present 21 September: the connector reports that display name and the
  tagname `@thevirtualhermit`. Only Hermi can change it, in the Rippily account
  page, since the connector is read-only.

#### Eight things worth fixing, in the order they cost something

All are browser work in the Rippily editor. Read-only tools found them and
cannot fix them.

1. **Terran Judaism Temple has thirteen dead buttons.** Short id
   `5ab67924`. Thirteen of its fifteen click actions are `navigate` with a
   null target, across seven images and six shapes. Clicking does nothing.
   It is a listed room behind a protected Bubble, updated 19 September, so
   it is in use. This is the highest value fix in the account.
2. **IggyLand has four scene actions on one click trigger.** Short id
   `b29406e1`. Two of them are `snapshot-switch` pointing at different
   snapshots, `snap-1788212476833` and `snap-1788212672559`, alongside a
   celebration and a set-variable. Two snapshot switches on one trigger
   cannot both win. This room has no element actions at all, so its whole
   behaviour sits in these four.
3. **The Virtual Hermitage may have conflicting day and night switches.**
   Short id `ccba0a2b`. Two input elements each carry two `variable-change`
   to `scene-switch` actions targeting Interior Night and Interior Day.
   **Verify before touching.** The tracer returns index rows without
   conditions, so if each action carries a distinct condition this is
   correct by design. Read the two inputs with
   `rippily_get_ripple_elements` first.
4. **LuckyLand has doubled sound actions.** Short id `a557b667`. One audio
   element is listed twice on the same drop trigger, and two more are each
   listed twice on one shape's click. Likely doubled playback.
5. **Two more null-target actions on flagship listed rooms.** Sphere of the
   New Mystics `bf31b884` has a hover to `layer` with a null target. The
   New Folklore Theatre `dfcb9dc7` has a click to `sound` with a null
   target. Both are silent no-ops.
6. **Seven rooms have the gallery enabled with the maximum set to zero.**
   `floaters: {enabled: true, max: 0}` in LuckyLand, Saturday Mourning
   Cafe, OmiGaia Passage, Integrity For Two, and three Integrity coach
   rooms. Five are listed. **Ambiguous, verify rather than assume.** The
   documentation says Maximum caps gallery participants but never says
   what zero means, so it may be unlimited or it may admit nobody. If it
   is a hard cap, overflow cannot join Saturday Mourning Cafe, which runs
   weekly.
7. **The Hermit's Cell location sharing**, per the stop mark note above.
8. **`TEST`, short id `f739e558`, is an empty room** still sitting in the
   Hermitage Wave since March. Two scenes, no elements beyond six drops,
   no automation.

Sixteen rooms have no automation of any kind: HenleyLand, Guy-Wire, TEST,
Integrity For Two, Integrity Amphitheatre, and eleven Integrity coach
rooms.
- Bait Box has two zones both named for the Randomizer, at 300x200 and
  945x600. One is a leftover. **Answered 21 September, see below.**
- Bait Box has zero snapshots, which is the rehearsal surface you want
  before rules exist that can misfire. **Confirmed 21 September.**

#### Bait Box, audited 21 September

Room is **The Bait Box Cinema**, short id `1009da7c`, in the Wave
*Join The New Folklore Theatre!*. Canvas frame 1920 x 1800.

**The leftover is `The Randomizer` at 300x200, id `zone-1773055264576-4`.
Keep `RANDOMIZER` at 945x600, id `zone-1773056015714-3`.**

Delete by id, not by size. `Screen 4` is also exactly 300x200 and deleting
on dimensions alone would take the wrong one.

The obvious test does not decide it. Nothing in the room references any
zone: zero rules, zero logic elements, zero variables, and no zone id
appears in any element action. Screen 1 is equally unreferenced. Four
other signals agree instead:

- The 945x600 zone encloses the Folklore Video embed and two drop centres.
  The 300x200 zone encloses nothing at all.
- 300x200 is the size a zone is born at. Its round width and height beside
  fractional coordinates is the signature of placed and never resized. The
  945.4139 x 600.5050 zone was dragged by hand.
- The larger zone's bottom edge sits 0.75px above Screen 1's bottom edge.
  It was sized to the screen area deliberately.
- Id timestamps put them 12 minutes 31 seconds apart in one editing
  session on 9 March. The first was abandoned at default size.

**A third piece of the Randomizer is also half built.** The layer
`layer-1772917602635-pkbw` named RANDOMIZER carries no element and no
action anywhere shows or hides it. So the feature exists as an empty
layer, an empty zone and a sized but unwired zone. Only the EXIT layer is
actually wired, by hover and hover-out on `image-1771286179932-3`.

**Snapshots are zero, and the cap is not knowable from the data.** The
room's limits expose max_participants 250, max_seats 400, max_scenes 200
and max_rules 100, with no snapshot field. Documented allowances put
Business at 100 snapshots, but this room reports 200 scenes against a
documented 100, so it is on a custom arrangement and the table does not
apply. <https://go.rippily.com/help/account/tier-limits>

**The Lights Down warning needs one correction.** That `Lights Down` is
empty is confirmed: zero layers, zero elements, one activation action.
But the stated reason, that switching takes Screen 1 with it, is not
something the data states. Zone data gives only the string "1 scene" and
never names which scene. A timestamp even cuts the other way: Screen 1
was created on 10 January, before the Lights On scene existed on
17 January, so Screen 1 was born on the scene now called Lights Down.

**The conclusion survives the correction, for a better reason.** Every
zone in the room is scoped to exactly one scene, so any switch between
the two scenes changes which zones are live. Screen 1 cannot be present
in both as currently configured. A switch would also drop the Folklore
Video embed and two images, all scoped to Lights On. The 16 drops are
global and survive, so nobody loses their seat.

If a scene switch is ever wanted here, the fix is to set Screen 1 to
Global, or assign it to both scenes and give each its own placement.
<https://go.rippily.com/help/editor/zones>

Full element inventory with exact stored geometry was captured in the
audit and can be re-read from the room at any time. Two elements point at
the same Stripe checkout, `image-1783194669358-4` and the TIP JAR shape.
They sit adjacent and are one composite control, not a duplicate.

One more: `breakouts_active_by_default` is true, but every zone in the
room is a media zone, so there are no breakout zones for the setting to
act on.

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
- **Every room has zero rules, and that means almost nothing.** Corrected
  21 September after reading all forty-four rooms with the automation
  tracer rather than four with the overview. `rule_count` is zero
  everywhere and so is `fired_rule_count`, but those count Ripple-level
  rules only. **272 element and scene actions are configured across 28
  rooms** and they run the whole account: every navigation, sound cue,
  layer reveal and scene transition. Hermi builds by wiring elements
  directly, not with the Rules engine. Reading `rule_count` alone
  misrepresents the account. Use `rippily_get_ripple_automation`, which
  returns `scene_actions` and the `element_action_index` that the
  overview never shows.
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
