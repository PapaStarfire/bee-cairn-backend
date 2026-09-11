# Intake Form Specification

Built for Tally.so free tier. Every block type used here is available without payment,
including the electronic signature block and conditional logic.

Six pages. Most people finish in under ten minutes. Only the safety page and the consent
page carry required fields, and that is deliberate: the context questions are an invitation,
not an interrogation, and a blank answer is a complete answer.

Two canon rules govern every question on this form.

**Nothing about identity is inferred.** Pronouns, tradition, relationship structure, and
cultural context are asked for as open fields, never as pick-lists that force a person into
a category somebody else drew. Blank is always allowed.

**No question implies a wrong answer.** No scales, no severity ratings, no "how well are you
coping." The form gathers what is needed to hold an hour well and nothing beyond that.

---

## Page 1: Who you are

| Field | Type | Required | Notes |
|---|---|---|---|
| The name you would like me to use | Short text | Yes | Not necessarily a legal name |
| Legal name, if different | Short text | No | For records and receipts only |
| Email | Email | Yes | |
| Country | Short text | Yes | Drives time zone and the emergency information on page 5 |
| Time zone | Short text | No | Booking captures this already. Kept as a cross-check |
| Pronouns | Short text | No | Open field. Never a dropdown |
| How you found this practice | Short text | No | |

---

## Page 2: Which room

| Field | Type | Required | Notes |
|---|---|---|---|
| Which brings you here | Multiple choice | Yes | General practice / Guy-Wire, threshold work for men / Not sure yet |
| Preferred format | Multiple choice | No | One to one / Small threshold group / Not sure yet |
| Camera preference | Multiple choice | No | Camera on / Camera off / Decide on the day |

*Logic: selecting Guy-Wire shows a short optional field, "anything you want me to know before
you have to say it out loud." Many men use this field and nothing else on page 3, which is a
complete and useful intake.*

*The camera question matters more than it looks. Naming camera-off as an ordinary option on
the form, before the session, removes a negotiation somebody would otherwise have to open
while already at a threshold.*

---

## Page 3: Context. All optional.

Page description, shown to the visitor:

> Answer as much or as little as you want. Blank is a complete answer, and anything left out
> here can be spoken instead, or not at all.

| Field | Type | Required |
|---|---|---|
| What brings you here now | Long text | No |
| Who or what changed | Long text | No |
| Roughly when | Short text | No |
| Anything that helps me not make assumptions about you | Long text | No |
| A spiritual, religious, or secular context you want me to know about | Long text | No |

*The tradition question is open text on purpose. A dropdown would ask someone mid-deconstruction
to file themselves under a heading they are no longer sure of, on a form, before a first session.*

---

## Page 4: Body and dreams. All optional.

| Field | Type | Required | Options |
|---|---|---|---|
| Anything the body is doing you would like to work with | Checkboxes plus Other | No | Sleep / Breath and chest / Appetite / Restlessness / Numbness / Startle / Exhaustion / Something else |
| Are you bringing dreams | Multiple choice | No | Yes / Not yet / Not sure / I would rather not work with dreams |

Page footer text, shown to the visitor:

> Dreams are held here under IASD ethical framing. I speak only in the form of "if this were
> my dream," you take whatever fits, and you leave the rest without needing to explain why.
> No interpretation is ever placed on you.

---

## Page 5: Safety and care. Required.

Page description:

> This practice is international and online. I cannot reach emergency services in your country,
> which is exactly why this page exists.

| Field | Type | Required |
|---|---|---|
| Are you currently working with a clinician, doctor, or therapist | Multiple choice: Yes / No / Prefer not to say | Yes |
| Local emergency contact, full name | Short text | Yes |
| Local emergency contact, phone with country code | Phone | Yes |
| Their relationship to you | Short text | Yes |
| Acknowledgement | Checkbox | Yes |

Acknowledgement text, verbatim:

> I understand that this practice is not an emergency or crisis service, that messages are not
> monitored around the clock, and that in an emergency I will contact local emergency services
> or a crisis line in my own country.

Page footer, with live links:

> If you need someone now: Find a Helpline lists crisis lines in over 130 countries.
> In the United States and Canada, call or text 988. In the United Kingdom and Ireland,
> call 116 123. Across much of the European Union, call 112.

---

## Page 6: Consent and signature. Required.

Display the disclaimer in full, verbatim, above the checkboxes:

> Services offered are non-clinical pastoral counseling, spiritual care, and grief coaching
> under ecclesiastical authority. They are not a substitute for medical, psychiatric, or
> clinical mental health treatment. Practice aligned with IASD Ethical Standards.

Five separate required checkboxes. Separate, not combined, because a single
"I agree to everything" box is weaker evidence of informed consent than five specific ones.

1. I understand these services are non-clinical pastoral care and grief coaching, offered
   under ecclesiastical authority.
2. I understand these services are not psychotherapy, not psychiatric care, and not a
   substitute for medical or clinical mental health treatment.
3. I understand that no diagnosis is offered and no treatment is prescribed.
4. I understand that any dreamwork follows IASD ethical framing, and that the meaning of my
   dreams remains mine.
5. I understand that sessions are not recorded unless I ask for a recording in writing.

| Field | Type | Required |
|---|---|---|
| Signature | Signature block | Yes |
| Date | Date, prefilled with today | Yes |

---

## Confirmation screen

> Thank you. That is everything I need.
>
> Your session is confirmed and the video link is in your booking email. Nothing further is
> required before we meet. If something changes between now and then, including changing your
> mind, replying to that email is enough.

---

## Handling and retention

State this on the form and keep to it.

- Responses live in the form provider's encrypted storage and in the practitioner's own records.
- This is a pastoral record. It is not a medical record and carries none of that status.
- It is never sold, never shared, and never used for advertising.
- Records are kept for a stated period, then deleted. Set the period and publish it.
- A client may request deletion at any time by replying to any email from the practice.

*Set the retention period deliberately rather than leaving it open. Clients in the EU and UK
have a right to erasure, and an international practice is better served by one clear policy
applied to everyone than by trying to run different rules per jurisdiction.*
