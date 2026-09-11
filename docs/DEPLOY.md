# Deployment and Wiring

The site is plain static files. No server, no build step required at publish time, and no
third-party JavaScript loaded at runtime. It will still work in ten years.

---

## Going live in three edits

Open `site/assets/js/embeds.js` and fill in the five values at the top.

```js
var PRACTICE = {
  calUsername:  "",     // Cal.com username
  calEventSlug: "",     // Cal.com event slug
  tallyFormId:  "",     // characters after tally.so/r/
  contactEmail: "",     // public enquiry address
  mode:         "embed" // "embed" or "link"
};
```

Leave any value empty and that section shows a calm placeholder card instead of a broken
embed. Nothing looks broken to a visitor while the accounts are still being set up.

If a provider ever changes its embedding rules, set `mode` to `"link"`. Both sections then
render a single large button out to the provider and the layout stays intact. That is the
one line fix, and it exists so the site outlives the free tiers.

Then replace `https://example.org` in `site/index.html` (canonical and Open Graph tags),
`site/robots.txt`, and `site/sitemap.xml` with the real domain.

---

## Hosting

### Netlify

Connect the repository. `netlify.toml` at the repository root already sets the publish
directory and the build command. Nothing else to configure.

### GitHub Pages

`.github/workflows/deploy-site.yml` builds the stylesheet and publishes `site/` on every push
to the working branch. Enable it once at Settings, Pages, Source, GitHub Actions.

This matters more than it looks. With the Action in place, `site/index.html` can be edited
directly on github.com in a browser, and the stylesheet rebuilds and redeploys automatically.
No terminal, no local install, no Node on the machine. Copy can be changed from a phone.

---

## Editing styles

The stylesheet is compiled and committed, so it is served with no build step and no CDN.

To change it locally:

```
cd site
npm install
npm run dev      # rebuilds on save
npm run build    # one minified build
```

Commit `site/assets/css/site.css` after any change. If editing in the browser instead, the
Action handles the rebuild.

**Do not add the Tailwind browser CDN.** It is roughly 400KB of JavaScript that paints after
the page loads, producing a flash of unstyled content. On an international connection that
flash is the first impression, and for low-vision and screen-magnifier users it is worse than
an inconvenience. The compiled stylesheet here is around 19KB and paints immediately.

---

## Integration wiring

```
Visitor lands on the site
        |
        v
Clicks "Book a session"          Cal.com, free individual tier
        |                        Times auto-convert to the visitor's zone
        v
Chooses a time
        |
        v
Pays                             Stripe, connected inside Cal.com
        |                        Per transaction, no monthly fee
        v
Redirected to intake             Tally, free tier
        |                        Set as the Cal.com post-booking redirect
        v
Signs the disclaimer             Tally signature block
        |
        v
Confirmation and video link      Cal.com sends automatically
                                 Jitsi Meet or Zoom, both free tiers
```

**Cal.com.** Create one event type per service. Set the redirect URL on each to the Tally form.
Connect Stripe under the event's payment settings. Set a minimum booking notice and a buffer
so back to back sessions are not possible. Enable a reduced-rate event type, hidden from the
public list, reachable by direct link only, so it can be sent on request without requiring
anyone to explain their circumstances in public.

**Tally.** Build from `docs/INTAKE-FORM.md`. `docs/intake-form.schema.json` is the portable
source of truth. Tally has no public JSON import, so the schema is for building by hand and
for rebuilding elsewhere without losing wording or logic. Turn on email notification so a new
submission reaches the inbox immediately.

**Stripe.** No monthly fee. Enable the currencies clients actually use. Refund policy is
worth writing down before the first refund is requested rather than during it.

**Video.** Jitsi Meet needs no account and no time limit. Zoom's free tier caps group calls
at forty minutes, which is shorter than a session, so for one to one work either is fine
and for threshold groups Jitsi is the safer default.

---

## Accessibility notes

Built in deliberately. Keep them when editing.

- Semantic landmarks, one `h1`, heading order never skips a level.
- Skip link to main content, visible on focus.
- Focus rings visible at 3px on every interactive element.
- Contrast verified at WCAG AA or better in both appearances.
- Dark by default where the system asks for it, with a manual override that persists.
- `prefers-reduced-motion` respected. The lantern glow does not animate.
- Body text 17px with 1.75 line height, measure capped near 65 characters.
- Embeds carry real `title` attributes and lazy loading.
- No third-party fonts, so no render-blocking request to an external host and no visitor
  data sent to a font CDN. That last point also keeps the site simple under EU and UK rules.

---

## Before launch

- [ ] Five config values filled in.
- [ ] `example.org` replaced in three files.
- [ ] Rates and session lengths set in Cal.com.
- [ ] Reduced-rate event type created and hidden.
- [ ] Intake form built and its redirect connected.
- [ ] Stripe live, with a test booking taken and refunded end to end.
- [ ] Retention period chosen and published on the intake form.
- [ ] Social card image created at 1200x630 and placed at `site/assets/img/social-card.png`.
- [ ] Footer disclaimer confirmed verbatim.
- [ ] Guy-Wire section reviewed for accuracy against how Guy-Wire actually runs.
