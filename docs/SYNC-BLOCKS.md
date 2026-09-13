# Sync Blocks

Paste-ready canonical text for every element changed in this pass. For World Anvil and for
anywhere else the same copy lives: bios, speaker pages, Guy-Wire.org, LinkedIn, podcast
one-sheets, conference programs.

Blocks are plain text with no markup inside them, so they paste cleanly into anything.
World Anvil articles take BBCode rather than markdown, so there is nothing here to strip out.

Everything between the rules is the block. Copy the whole thing.

---

## 1. Credential line

Short form, wherever credentials are listed:

---
Internationally Certified Grief Practitioner, ICGC
---

Full credentials bar:

---
Ordained Clergy Person (OCP) / Internationally Certified Grief Practitioner, ICGC /
Terran Judaism Rabbi / Spiritual Humanist Minister / Somatic Regulation and Symbolic Dreamwork
---

Standing panel, two separate lines:

---
Grief certification: Internationally Certified Grief Practitioner. ICGC credential held.
Modality: Psychagogy. Working across body, mind, and spirit rather than treating any one of them.
Framework: Grief Cosmology.
---

**Rule.** ICGC is never expanded inline and never appears in brackets after the descriptor.
Comma form only. The issued credential and the scope descriptor are two different things, and
bracket form would assert that one abbreviates the other.

---

## 2. Bio and pitch

---
As an Ordained Interfaith Clergy Person, Terran Judaism Rabbi, and Internationally Certified
Grief Practitioner, I keep a non-clinical sanctuary for people standing at a threshold. I work
with somatic nervous system regulation, symbolic dream exploration, and Earth-centered
spiritual care. Clients come from across the world to sit with visitation dreams, to honor
continuing bonds, and to let the body settle enough that meaning can return on its own terms.
---

Short bio line:

---
Interfaith Spiritual Counselor and Grief Specialist. A psychagogue, which is the old word for
someone who walks beside another through what grief changes, at every level it reaches them:
mind, spirit, and body.
---

---

## 3. Psychagogue

One line:

---
A psychagogue walks beside a person through what grief changes, carrying a lamp rather than a map.
---

Short definition. This is the default. Use it whole.

---
Psychagogue (SY-kuh-gog), from the Greek psyche, soul, and agogos, one who leads.

A psychagogue walks beside a person through what grief changes, at every level it reaches them:
in the body, in the mind, and in whatever they hold sacred. Not a clinician treating a
condition. Not a coach improving a performance. Not a guide with the route already drawn.
Someone who carries a lamp, walks at your pace, and trusts your own interior knowledge further
than their own.

The word is older than psychology and it names a good deal of what psychology was built out of.
Psychology kept the psyche and set the agogos down. The leading was the part that got left behind.

One thing it does not mean here. The oldest sense of this word described someone who conducted
souls across into the underworld, or called them back out of it. This practice does neither.
The psychagogue described here walks the living to the threshold and back again. Nobody is
summoned. Nobody is contacted. What continues, continues without my assistance.
---

The expanded version, the Herald version, and the four governing rules are in
`docs/PSYCHAGOGUE.md`. Lift from there rather than rewriting.

---

## 4. Modality and framework

---
Psychagogy is the modality. Grief Cosmology is the framework.

The framework is what is held to be true. The modality is how that is practiced inside an hour.
A framework with no modality is a belief. A modality with no framework is a technique. Held
together they are a practice.
---

**Rule.** Psychagogy is never called a framework. Grief Cosmology is never called a modality.
Public copy names the framework and does not argue it, so the three-layer epistemology keeps
Layer One separate from Layer Three.

---

## 5. Guy-Wire

Statement of purpose. Leads every Guy-Wire page and mention.

---
Griefwalkers come to Guy-Wire to learn to stand firmly in their new reality rather than collapse under it.
---

The two supports that travel with it, never separated from it:

---
A Griefwalker is anyone walking grief terrain. Not a stage, not a diagnosis, and not a category
anybody gets assigned to. It is the plain word for the person doing the walking.

And if you are reading that sentence from somewhere on the floor: a mast that has already come
down is not a failed mast. It is a mast waiting to be raised and anchored again. That is also
this work, and it is the more common version of it.
---

The metaphor:

---
A guy-wire is the stabilizing cable that keeps a mast standing. It does not make the mast rigid.
It anchors the mast to the ground so it can move in wind and still be there in the morning.
And a guy-wire is never installed alone. They work in threes. No single cable holds a tower up.
---

Three cables:

---
Ground. The body first, because most men arrive at language last. Simple somatic practice that
works in a truck cab, a garage, or a hallway at 3am.

Witness. Being heard once, properly, by someone who will not flinch and will not try to fix it.
For many men this is the part that has never happened.

Meaning. Dreams, images, ritual, and the things that carry weight without requiring a vocabulary
for feelings.
---

---

## 6. Hero headline

---
Honoring What Continues. Regulating the Body. Rebuilding Meaning.
---

Subtitle:

---
International online pastoral care, somatic regulation, and dreamwork for grief and life
transitions. Non-clinical. Non-doctrinal. Paced by you.
---

Alternate headline for bereavement-specific contexts only. Too narrow for a general page:

---
Honoring the Crossing. Regulating the Body. Rebuilding Meaning.
---

---

## 7. Disclaimer

Verbatim. Never reworded, anywhere, on any platform.

---
Services offered are non-clinical pastoral counseling, spiritual care, and grief coaching under
ecclesiastical authority. They are not a substitute for medical, psychiatric, or clinical mental
health treatment. Practice aligned with IASD Ethical Standards.
---

---

## 8. Vocabulary rules to carry across every platform

- **Stabilizing cable, never tensioned cable.** The whole family stays out of Guy-Wire copy:
  tension, tensioned, taut, strain, stress, load, pressure. Tension is the last thing to promote
  to people carrying grief.
- **Griefwalker is public. Peregrine is not.** A Griefwalker is anyone walking grief terrain.
  A Peregrine is a parent whose child preceded them. Every Peregrine is a Griefwalker and the
  reverse never holds. Gloss Griefwalker on first use.
- **ICGC is never expanded.** Comma form, not bracket form.
- **No em dashes anywhere.** Rewrite the sentence.
- **Prohibited lexicon:** loss, bereavement, death as a clinical noun, grief journey, moving on,
  closure, recovery, healing, wound, lost loved one, passed away, gone, the deceased.
- **No "Dr."** in any context.
- **Never "I help."** It puts the practitioner in front of the person. People come to the work.

---

## Note on automating this

Checked properly in September 2026. Recording what is verified and what is not, so nobody
builds against an assumption later.

**There is no World Anvil connector.** Not installed, and not present in the connector registry
at all, so this is not a matter of connecting one.

**The working route is Claude for Chrome**, driven on a signed-in tab. Claude Code cannot reach
it from either direction: there is no bridge from a cloud session to a local browser, and
worldanvil.com is blocked at the container's network layer, so even a headless browser here has
no route and would have no session if it did. See `docs/WORLDANVIL-HANDOFF.md` for a
self-contained prompt to paste into Claude for Chrome. It audits before it edits.

**The API exists.** World Anvil publishes the Boromir API, version 2, JSON only, at
`/api/external/boromir`. Authentication takes **two** credentials rather than one: an
application key, issued to people building applications, plus a user authentication token
generated from the User API Tokens page.

**Write capability is unconfirmed.** Read endpoints for articles are documented. Whether
Boromir exposes a create or update endpoint for articles could not be confirmed, because
worldanvil.com is unreachable from the environment this was checked in. That question decides
whether automation is possible at all, so confirm it against the live documentation before any
work is scoped. Do not assume a write path exists.

**If it does exist**, the n8n instance already connected to this project could drive it, which
would turn a canon change into one push instead of a round of hand-editing. n8n currently holds
a credential named "Header Auth account" of type `httpHeaderAuth`, which is the right shape for
a header-authenticated API of this kind. Its contents are not visible through the API and its
name says nothing about what it is for, so confirm what it holds before relying on it, and note
that Boromir's two-credential requirement may need more than a single header credential.

Worth building only once the canon stops moving. Syncing a moving target across platforms is
how versions drift apart.
