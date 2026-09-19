# The Hermit Hut Herald: Production Playbook

**Read this before touching anything in `herald/`.**

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
| Also syndicated | LinkedIn newsletter |

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

### Section header cards

| | |
|---|---|
| Size | **1600 x 900** (Substack serves them resized to 1456x720) |
| Count | Roughly 9 to 14 per edition, one per section |

Landscape aged-parchment scroll, torn and curled edges, rolled at left
and right. Warm sepia, tan and brown. Dark brown serif display type.
Ink line-drawing of the Hermit with his dog, lower left.

Each card carries **two lines**: the section name in large caps, and a
per-edition subtitle underneath in a contrasting face.

Known card designs to copy from:

| Design ID | Title |
|---|---|
| `DAHGWWKYYn0` | AGED PARCHMENT SCROLL WITH A HERMIT THEME |
| `DAHOXkZbDJo` | AGED PARCHMENT SCROLL WITH A HERMIT THEME (2nd) |
| `DAHGWqur3cs` | Tactile Aged Parchment Scroll with Hand-Drawn Elements |
| `DAHGWYt5AHw` | Ask the VH |
| `DAHGWbNIfxo` | Ask the VH 36 |
| `DAHEB-i4O4M` | Herald #27 Header |
| `DAHDfxsmIvo` | Hut Autumn (seasonal) |
| `DAHPXAjtZ2A` | Meditative Candle Flame Digital Card |
| `DAHE6cE9e_g` | Hut window |

Other assets: `DAHC74Vc0rg` Hut emblem, `DAG2PaTo0Do` The Virtual Hermit
(both 1:1 logo/avatar), `DAHCDIpfTis` Hut banner, `DAHPXBrI88U` Facebook
cover, `DAHPp4Te8QU` / `DAHPp0Up7ss` Facebook covers for Tea of the Week
and Hermi's Hermits.

Reused unchanged in every email: a 1440x423 masthead banner and a
2000x2000 logo. Those are already on Substack's CDN; no need to rebuild.

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
