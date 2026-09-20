# The Hermit Hut Herald: Production Playbook

**Read this before touching anything in `herald/`.**

**Sending it, not making it?** That is the **Octopus Flow**, and it
lives in `herald/OCTOPUS-FLOW.md`. One body, many arms.

---

## HARD RULES: HOW TO TALK TO HERMI

Set 19 Sep 2026. These override any default style.

1. **Plain language.** No jargon. If a technical term is unavoidable,
   say what it means in the same breath.
2. **Do not narrate your process.** He wants the result, not the steps
   you took to get it. No tool names, no "I searched X then Y."
3. **Speak only when necessary, and be honest even when you disagree.**
   Say the true thing briefly. Do not soften it and do not pad it.
4. **Be concise.** Always. Short answers, short messages.
5. **Run every Herald edition and every important project through the
   Double Minyan** before writing. Both councils, both Empty Chairs.
   See the `dual-canon` skill.
6. **When a session gets too long or too tangled, write a handoff and
   stop.** Do not limp along. Save `herald/HANDOFF.md`, tell him to
   start a fresh chat, and end.

---

## HARD RULE: KEEP CURRENT

**Never reuse an asset or template without first confirming it is the one
in use right now.** Stated by Hermi 19 Sep 2026 after this session copied
a section-card template titled "Ask the VH 36", from Edition 36, and
rebuilt Edition #51's cards in a design language he had long since
retired. The edition number was sitting in the filename and went unread.

Before copying ANY template:

1. Sort by `modified_descending`, not by relevance. Relevance surfaces
   old work that happens to match your words.
2. Read the title for an edition number. A number older than the current
   edition means the asset is stale until proven otherwise.
3. Compare against the most recent edition actually sent, which is in
   Hermi's Gmail. If the live artwork does not look like the template,
   the template is wrong.
4. If no current template can be found, ASK. Do not substitute an older
   one and do not invent a replacement. A wrong guess costs Hermi real
   time and real tokens, and he has to catch it.

This applies to every project, not just the Herald.

---

## TOKEN ECONOMY

Hermi pays for every token. Session of 19 Sep 2026 burned roughly 400k
producing one edition, most of it avoidable. Concrete causes and fixes.

### Do this first, in this order. It costs about 3k.

```
1. Read this file.
2. mcp__Gmail__search_threads   query "Hermit Hut Herald"
3. mcp__Gmail__get_message      messageFormat "PLAIN_TEXT"
                                on the latest edition only
4. Ask Hermi for: 'Scriber count, Hermits status, donation links,
   this edition's theme. One message, all four.
```

Then write. Do not produce anything before step 4 comes back.

### The two expensive mistakes, both the same mistake

**Rebuilding.** The edition was written once against a format retired at
#30, then rewritten. The section cards were built on a template from
Edition 36, then thrown away. Both cost more than the original work.
Both were preventable by three minutes of checking.

**Guessing at process.** The cover artwork was built three times: photo,
then woodcut, then retitled. Each pass cost a full read plus edit plus
commit plus export. Ask one precise question instead of building a
second guess.

### Tool-level savings, largest first

**Never spawn subagents for this project.** Two ran on 19 Sep for a
combined 250k tokens and produced nothing usable. One concluded the last
twenty editions did not exist, because the public web index stops at
April 2026. The other recovered asset URLs it was then blocked from
fetching. Everything they looked for was in Hermi's Gmail and his
Cloudflare account, reachable directly in a handful of calls.

**Canva `read-design` returns the entire element tree, including raw SVG
path data for every decorative shape. That is about 7k tokens a call.**
Cut it:

- To get a transaction id only:
  `filter: {"fields": ["page_metadata"]}` is about 100 tokens.
- To inspect specific text:
  `filter: {"element_ids": ["LBxxx"], "fields": ["design_content"]}`.
- Never call it with default filters on a card or cover.

**Batch every Canva edit into one `edit-design` call.** The response is
large and fixed in size, so five operations in one call cost what one
operation costs. Then commit. Two calls, not six.

**Gmail: `PLAIN_TEXT`, always.** `FULL_CONTENT` pulls 175-225KB of HTML
per edition. Only reach for it if image URLs are genuinely needed, and
write the html to a scratch file and grep it rather than reading it.

**Read one edition, not three.** The most recent one carries the current
format. Older ones only matter for a specific question.

### Rough budget for a clean edition

| Step | Tokens |
|---|---|
| Orientation and Gmail check | 3k |
| Writing the edition | 15k |
| Canon sweep | 1k |
| Cover in Canva, filtered reads, batched edits | 12k |
| Section header specs | 5k |
| LinkedIn post | 3k |
| **Total** | **about 40k** |

Anything past 60k means something was rebuilt. Stop and say so rather
than quietly spending more.

Written 19 September 2026 while building Edition #51, after a session
started cold and rebuilt the edition against a format that had been
obsolete since roughly Edition #30. This file exists so that never
happens again.

---

## WHY THIS FILE EXISTS

Every Claude Code session starts with no memory of previous sessions.
The container is cloned fresh. The Herald is a **weekly** collaboration,
but nothing about how it is actually produced lived anywhere durable.
Hermi's `dual-canon`, `the-minyan` and `voice-fingerprint` skills survive
because they are installed at the account level. The production workflow
did not, so each session rediscovered it badly or not at all.

If you are a future session: you make the artwork too. Not just the copy.

---

## THE PUBLICATION

| | |
|---|---|
| Title | The Hermit Hut Herald |
| Home | thevirtualhermit.substack.com |
| Author | Rev. Rabbi Henry-Cameron Allen, OCP, ICGC ("The Virtual Hermit") |
| Cadence | Weekly, usually Friday or Saturday |
| Voice | Hermification only (see the `dual-canon` skill) |
| Also syndicated | LinkedIn newsletter, plus social arms. See `OCTOPUS-FLOW.md` |

**Subject line format**, confirmed live in #48, #49, #50:

```
The Hermit Hut Herald: Edition #N | <Title>
```

Colon after "Herald". No month/year suffix. That trailing
`, <Month> <Year>` form died around Edition #30. An emoji in the subject
is normal (#50 used a candle).

**Preheader:** `Bold Ideas from Quiet Corners | <N> 'Scribers`
Title case. The 'Scriber count is live and must be asked for every time.
Known values: 660 (#48), 672 (#49), 881 (#50), 895 (#51).

---

## RESEARCH: WHERE TO LOOK

**Substack is blocked by the egress proxy (HTTP 403) and so is almost
everything else.** The allowlist is default-deny; `*.s3.amazonaws.com`
is the notable opening. Public web search indexes nothing for this
publication after April 2026, because recent editions go out by email
and sit behind a paywall. Do not trust search for anything recent.

**Go to Gmail instead.** Hermi is the publisher, so every edition is in
his own mailbox. This is the primary source.

```
mcp__Gmail__search_threads   query: "Hermit Hut Herald"
mcp__Gmail__get_message      messageFormat: "PLAIN_TEXT"
```

Sender is `thevirtualhermit+the-hermit-hut-herald@substack.com`.
Use `PLAIN_TEXT` for copy. Use `FULL_CONTENT` only when you need image
URLs out of `html_body`, and expect 175-225KB per message.

Caution: URLs extracted from Gmail may trip the `[PII Data Handling]`
classifier when passed to Bash. Canva is the better route for artwork
anyway. See below.

---

## RUNNING ORDER

Sections **rotate**. The `dual-canon` reference file claims twelve
sections in a fixed, non-negotiable order. That is out of date. Observed:
#49 ran Tea of the Week and Ask The Virtual Hermit; #50 ran Pocket Tools
and the Yiddish instead. Roughly ten to fourteen sections per edition.

1. **The Weekly Mending** - one paragraph, practical, opens "This week, ..."
2. **Hook question** - single bold line
3. **The Opening Lantern** - the essay that sets the frame
4. "If you are new here" paragraph - Grief Cosmology(SM), and the line
   "nothing real ever ends, it only changes form" credited to the first
   law of thermodynamics
5. **The Lantern Table** - teasers, `**Section:** one line` each,
   including the paid sections
6. **Upcoming Gatherings**
7. **NumeraLogic** - always folds the edition number digit by digit
8. **Tea of the Week** *(rotates)*
9. **Pocket Tools** *(rotates)*
10. **Ask The Virtual Hermit** *(rotates)* - Brain / Heart / Gut, always
11. **The Yiddish Curse and Counter-Blessing** *(rotates)* - three parts:
    Hebrew script, transliteration, English
12. **Hermi's Hermits** - the charity section. Desire Child Care
    Organization, a registered Indigenous NGO founded by Bugingo "Desire"
    Moses. Numbers go stale weekly; always ask.
13. **Founding Lantern Keepers** - "the Nth lamp", plus a forward/share ask
14. **The Final Feather** - Ánimo, the red cardinal, Cameron, then a
    direct question to the reader
15. Reader engagement ask - "I read every comment"
16. `Always here.` / `A little ahead.`
17. `With <three images>,` then the signature block
18. **GENTLE REMINDER** - this is the 988 crisis footer, NOT a
    permission-giving list. The canon file is wrong about this.
19. Paywall divider - "You got to the bottom, loves..."
20. **The Inner Sanctum** *(paid)*
21. **The Feast** *(paid)* - fixed recipe format, Equipment list always
    closes with "Your Holy Hands, impeccably clean and ready for blessing."

---

## THE ARTWORK. YOU MAKE IT.

All of it lives in Hermi's Canva. Search `mcp__Canva__search-designs`
with "Hermit Hut Herald". There are **no brand templates**; the workflow
is copy-or-edit existing designs.

### The cover

| | |
|---|---|
| Design | `DAHGTBgWPXk` "HERMIT COVER Richly Textured Herald Masthead Design" |
| Size | **1588 x 2246** portrait |
| Workflow | **Edited in place each edition.** It was on version 143 at #50. |

Portrait parchment scroll, rolled top and bottom. Background is aged
parchment washed with faint physics and mathematics notation (E=mc²,
integrals, sigma, pi), which is the Grief Cosmology frame used as
texture. A small framed painting of a **red cardinal** sits at the top;
the cardinal is Cameron's sign. An ink-drawn **lantern** sits lower left.

**The feature image changes every single week.** This is Hermi's
standing rule. The large image element (`LB9tJ9tRJkcLjBBb` in the #50
lineage) carries artwork chosen for that edition's theme, and reusing
the previous edition's is wrong. Everything else on the cover stays:
scroll, equation texture, cardinal, lantern, masthead type.

**NEVER a photograph.** Hard rule, stated by Hermi 19 Sep 2026. The
feature image is always a **pen and ink drawing or a woodcut**, and it
must match that edition's theme. Look at any existing cover and the
logic is obvious: the Cameron portrait on #50 is a woodcut, the Hermit
and Ánimo on the section cards are pen and ink, the lantern is line art.
The whole publication is an engraved-broadsheet aesthetic on parchment.
A photograph breaks it on sight. If the only close-fitting asset in the
library is photographic, it is the wrong asset; find or make line art
instead.

Two gotchas learned the hard way on #51:

1. **Text length changes the layout.** "Edition #51" is longer than
   "Issue #50" and wrapped to two lines in a fixed-width box, crowding
   the title. Check the returned element `height` after a
   `replace_text`; if it grew, drop the `font_size` until it fits.
2. **`update_fill` does not reset the crop.** Dropping a new image into
   a slot shaped for the old one leaves Canva's previous `imageBox`,
   which zooms hard into a corner. Always follow with `crop_media` set
   to `top: 0, left: 0` and the element's own width and height, and
   reshape the slot to the new image's aspect ratio first.

**Making the weekly illustration.** There is no image-generation tool in
a Claude Code session, and the Canva library rarely holds line art for a
new theme. The working route is `generate-design` (design_type `poster`),
then `create-design-from-candidate` on the candidate you want, then
`read-design` to view it and take the illustration's `mediaId` for the
cover. It returns four candidates; convert and LOOK before choosing.

A prompt that worked, for reference: *"A single full-bleed antique
woodcut engraving illustration, no text and no lettering anywhere:
&lt;subject&gt;. Rendered entirely in high-contrast black pen-and-ink
linework with dense crosshatching and stippling, in the style of a 19th
century broadsheet engraving or medieval woodcut print, on an aged cream
parchment ground. Monochrome sepia and black only. No people, no
photography, no modern elements, no words, no title, no caption, no
border frame."*

Canva adds a fake artist-signature text element to generated designs.
Take only the image `mediaId`; leave the text behind.

Leave good space between the edition number and the edition title.
Hermi has called this out; do not let them sit as a tight stack.

Text fields on the cover:

```
The
Hermit Hut
Herald
BOLD IDEAS FROM QUIET CORNERS
ISSUE #<N>            <- see canon conflict below
<EDITION TITLE>
<DD MONTH YYYY>
```

Copy it before editing if the previous edition's art should survive.

### Section header cards: CLOUDFLARE, NOT CANVA

**The section headers are NOT made in Canva.** Since July 2026 they are
generated on Cloudflare and served from R2. Every parchment card in the
Canva account is retired Edition-36-era work. Do not copy them.

**Current design.** Landscape parchment scroll, rolled at LEFT and RIGHT.
Thin double-rule border inside. Section title across the top in large
letterspaced serif caps. A **framed inset image** in the centre with a
thin gold rule. Below it an italic serif caption, then `- The Virtual
Hermit`. Alchemical and planetary symbols run down both margins. A red
wax seal with a rampant beast sits in the lower right. No Hermit-and-dog
line art. Substack serves them at 1456x720.

**The pipeline.** Worker `herald-imagegen`, R2 bucket `herald-assets`.

```
GENERATE  GET  https://thevirtualhermit.quest/?k=<GEN_KEY>&p=<prompt>&m=<model>
               Workers AI, default @cf/black-forest-labs/flux-1-schnell,
               steps 8, returns image/jpeg
STORE     PUT  https://thevirtualhermit.quest/f/<name>?k=<GEN_KEY>
               writes to R2 binding ASSETS
SERVE     GET  https://thevirtualhermit.quest/f/<name>
               public, cache-control max-age=3600
```

`GEN_KEY` is a Worker secret. The gallery of current headers is at
`/hermits`.

**What a Claude Code session cannot do here.** `thevirtualhermit.quest`
is blocked by the egress proxy, `GEN_KEY` is not readable, and the
Cloudflare connector exposes no R2 object read/write and no Workers AI
invoke. So a session can write the header specs and prompts but cannot
generate or upload the images. Hand Hermi a spec file; he runs it.

See `edition-51-section-headers.md` for the format that works: per card,
a section title, an italic caption, a filename, and a Flux prompt, with
one shared style directive at the top so the set stays consistent.

**Retired Canva assets**, kept only so a future session recognises and
avoids them: `DAHGWbNIfxo` "Ask the VH 36", `DAHGWYt5AHw` "Ask the VH",
`DAHGWWKYYn0` and `DAHOXkZbDJo` parchment scrolls, `DAHGWqur3cs`,
`DAHEB-i4O4M` "Herald #27 Header".

**Still current in Canva:** the cover (`DAHGTBgWPXk`), `DAHC74Vc0rg` Hut
emblem and `DAG2PaTo0Do` The Virtual Hermit (1:1 logos), `DAHCDIpfTis`
Hut banner. The 1440x423 masthead and 2000x2000 logo already on
Substack's CDN are reused unchanged every edition.

### Build sequence

```
1. mcp__Canva__copy-design            (protect the previous edition)
2. mcp__Canva__read-design             open_transaction: true
                                       -> locator_ids + before thumbnail
3. mcp__Canva__edit-design             replace_text per locator
4. mcp__Canva__read-design             pass transaction_id, compare
5. mcp__Canva__edit-design             finalize: "commit"
6. mcp__Canva__get-export-formats      then export-design as PNG
```

Never guess a `locator_id`. Read it first.

---

## CANON CONFLICTS: LIVE PRACTICE VS THE CANON FILE

Found 19 September 2026. Unresolved. Ask Hermi; do not silently pick.

| Canon file says | Live practice |
|---|---|
| Never "issue", always "edition" | **The cover artwork says "ISSUE #50"** |
| No emojis in published work | #50 used a candle in the subject and sparkles in the Final Feather |
| Never "Dr. Hermi" | "Dr. Hermi's Creative Open Studio" is a standing program name |
| "Bold ideas from quiet corners." | Preheader is "Bold Ideas from Quiet Corners"; cover is all caps |
| The Hermit carries a lantern, never a staff | Resolved by Hermi 19 Sep 2026: **it is a walking stick**, not a staff. See below. |
| Twelve sections, fixed order | Sections rotate |
| "Gentle Reminders" is permission-giving | It is the 988 crisis footer |
| OmiGaia: breadcrumbs until launch | **Launched** on Cameron's Feast, 14 September 2026 |

Section names **"The Opening Lantern"** and **"The Lantern Table"** come
from the canon file and cannot be verified from sent editions, because
those headers are images. An older about page calls the first one
"Lantern Light". **"The Weekly Mending"** is confirmed: #50 names it in
the Final Feather.

---

## FIXED CANON. NEVER BREAK.

- No em dashes. Anywhere. Rewrite the sentence.
- No wound-narrative vocabulary: loss, bereavement, closure, recovery,
  wound, healing, grief journey, moving on, lost loved one, passed away,
  gone, the deceased.
- No AI-tell vocabulary.
- Cameron's crack quote **verbatim** or not at all:
  "I heard someone say that your cracks are where the light gets in, but
  I don't think that's true, Papa. I think our cracks are where our inner
  light gets out."
- `Always here. A little ahead.` is locked phrasing for the Aether path.
- Signs as `Rev. Rabbi Henry-Cameron Allen, OCP, ICGC`.
- Ánimo is a Mastiff/Lab mix, black head, white blaze down the muzzle.
  Not a Great Dane.
- **The walking stick.** Hermi carries a lantern AND a walking stick.
  The stick is not a staff: it is a guide and a tool for balance, and it
  appears in the section-card line art. The canon file's "never a staff"
  is about posture and authority, not about the object. A staff is
  something you hold power with. A walking stick is something you keep
  your footing with. Do not flag the stick in his artwork as a canon
  violation, and do not remove it. (Confirmed by Hermi, 19 Sep 2026.)
- Cameron David Allen, 16 April 1995 to 14 September 2008, age 13.
  Anaplastic Astrocytoma. Two feasts: his birth, and his yahrzeit.

Run a sweep before shipping. Check for em dashes, emojis in the body,
banned vocabulary, and the locked phrasings.

---

## STANDING FACTS

- Cameron's sign is the **red cardinal**. Cardinals do not live in Spain,
  where Hermi lives. That line recurs.
- **Ánimo** appears in the Final Feather most editions.
- Weekly gatherings: Mondays none ever ("go walk in Nature"); Tuesdays
  Dr. Hermi's Creative Open Studio; Wednesdays Wednesday WorldBuilders
  with RJ Redden; Fridays Hermi's Digital Diner; Saturdays Mourning Café,
  Integrity Community, Terran Judaism Torah Study, Saturday Matinee Movie
  Club at The Bait Box Cinema; Sundays Christian Lectionary Discussion
  and the SUPERGRIEF Monthly Virtual Retreat.
- All paid-subscription proceeds go to charity.
- Founding Lantern Keeper rate is locked for everyone who claimed it;
  only the Founding tier itself has closed.
