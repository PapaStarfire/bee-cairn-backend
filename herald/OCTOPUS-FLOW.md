# The Octopus Flow

**How one edition reaches every place it goes.**

Sibling to `CLAUDE.md` in this folder. That file covers making the
Herald. This one covers sending it.

Hermi's name for it. One body, many arms.

---

## READ THIS BEFORE YOU TRUST A LINE OF IT

Written 20 September 2026 from evidence, not from watching Hermi work.

Anything marked **Confirmed** was checked against his Gmail that day.
Anything marked **Ask** was not, and is not a fact until he says so.

Do not fill an **Ask** with a sensible guess. Guessing instead of
checking is what cost a whole session on Edition #51.

---

## THE ARMS

### 1. Substack. The body, not an arm.

| | |
|---|---|
| Home | thevirtualhermit.substack.com |
| Sends from | `thevirtualhermit+the-hermit-hut-herald@substack.com` |
| Register | Hermification |

Nothing moves anywhere else until the Substack edition is live, because
every other arm carries its link.

**Confirmed.** Edition #51 went out Friday 19 September 2026 at 12:56
UTC. Subject `The Hermit Hut Herald: Edition #51 | The Hinge and The
Hook`. Preheader `Bold Ideas from Quiet Corners | 895 'Scribers`.

### 2. LinkedIn newsletter. The same edition, again.

Arrives from `newsletters-noreply@linkedin.com` under the identical
subject line. The preheader is not identical. LinkedIn's reads:

```
Bold Ideas from Quiet Corners | 895 'Scribers on Substack. Join us!
```

Substack's stops at `'Scribers`. Those three extra words are the whole
point of this arm. LinkedIn readers are being asked onto the list.

**Confirmed.** #51 appeared on LinkedIn at 19:34 UTC, six hours and
thirty eight minutes after Substack.

**Ask.** Whether that gap is Hermi posting by hand or LinkedIn pulling
the feed on its own. It matters. By hand means it belongs on the
checklist below. Automatic means it does not.

### 3. LinkedIn post. Not the newsletter. Different voice.

A standalone post promoting the edition. `edition-51-linkedin-post.md`
is the working model.

**This is the register trap.** The Herald is Hermification. Promotion of
the Herald is Canon Two, OmiGaia and SUPERGRIEF. No Hermit persona, no
"loves", no jokes. The file says so in bold at the top because it is
easy to get wrong.

### 4. Instagram

Addressed by name in his mail, so run from these mailboxes:

| Handle | Mailbox |
|---|---|
| `losttravelersclub` | info@losttravelers.club |
| `flatstanleytheservicedog` | henry@henryallen.org |

`thevirtualhermit` appears constantly as an account that posts and is
followed. `desirechildcareorganization` is Bugingo Desire Moses's, and
is followed rather than run.

**Ask.** Which account carries the weekly edition announcement, and
whether the others carry anything.

### 5. Threads

Posts for #51 were drafted on Hermi's Mac and saved as
`Edition-51-SOCIAL-POSTS.md`, next to the Instagram ones. That file is
in his Finder, not in this repository.

**Ask.** The handle. Nothing in his mail names a Threads account, so a
cloud session cannot find it.

### 6. Mailchimp

**Confirmed.** The account is **Folklore LLC**. One audience, named
`The Virtual Hermit/The Lost Traveler/New Folklore`, exported
12 September 2026. Admin mail henry@henryallen.org.

**Ask.** Whether the Herald touches Mailchimp at all. The edition ships
through Substack, so Mailchimp may serve the theatre and the charity
only. A connected tool is not evidence of an arm.

### 7. World Anvil

Author page `TheVirtualHermit`. An API key was granted 12 September
2026.

This arm carries canon, not editions. The two phase audit script is in
`docs/WORLDANVIL-HANDOFF.md` on the interfaith branch.

worldanvil.com is blocked from Claude Code. The route is Claude for
Chrome on a signed in tab.

---

## WHAT A CLOUD SESSION CANNOT DO

The short version of why this flow stalls.

| Arm | Reachable from a cloud session? |
|---|---|
| Substack | No. Blocked, 403. |
| LinkedIn | No connector. |
| Instagram | No connector. |
| Threads | No connector. |
| Mailchimp | Connector present. Campaigns and analytics only. No automations, no contacts. |
| World Anvil | No. Blocked. |
| thevirtualhermit.quest | No. Blocked, and this is where section headers are made. |
| Gmail, Drive, Canva, Cloudflare, Rippily | Yes. |

**A cloud session can write every post. It cannot publish one.**

Write the words in a cloud chat. Publish from the Mac, where Claude for
Chrome reaches a signed in tab and files land in Finder.

Never promise Hermi that a post will go up from a cloud chat. It will
not.

---

## THE ORDER

From the one run that can be verified end to end, #51.

```
1. Edition written and checked     see CLAUDE.md in this folder
2. Cover made                      Canva
3. Section headers made            Cloudflare, from the Mac
4. Substack publish                nothing moves before this
5. Link copied from the live post
6. LinkedIn newsletter             by hand or automatic? confirm
7. LinkedIn post                   Canon Two, not Hermification
8. Instagram                       which account?
9. Threads                         which handle?
```

Steps 4 through 9 all run from the Mac.

---

## THE CHEAP AUDIT

To answer "did the flow run this week" for roughly 1k tokens:

```
mcp__Gmail__search_threads    query: "Hermit Hut Herald" newer_than:14d
```

Substack's own send lands in his inbox, and so does the LinkedIn
newsletter. Two timestamps from one search.

The other arms leave no trace in mail. For those, ask him.

---

## OPEN QUESTIONS, GATHERED

In the order they block work.

1. Is the LinkedIn newsletter posted by hand or pulled automatically?
2. Which Instagram account carries the edition?
3. What is the Threads handle?
4. Does the Herald go through Mailchimp at all?
5. Is there an arm invisible from Gmail? Facebook, Bluesky, anything.
6. Edition #51 shipped on 19 September with two items still open in
   `HANDOFF.md`, the donation links and the fourteen section headers.
   Did those land before it went out, or did it ship without them?

Answer these once and this file stops being half a guess.

---

## WHY THIS FILE EXISTS

On 20 September 2026 Hermi asked whether the Octopus Flow had been
updated. Nothing by that name existed anywhere. Not in this repository,
not in his Drive, not in his mail, not in Rippily, not in Canva, not in
Cloudflare. The flow was real and running every week. It had simply
never been written down, so the honest answer to "has it been updated"
was that there was nothing to update.

The production playbook next door came within one merge of the same
fate. It was written to survive sessions, then left on a branch nobody
merged, so every fresh clone saw nothing. Both files now sit together in
`herald/` and travel to main together.

If you add an arm, write it here the same day.
