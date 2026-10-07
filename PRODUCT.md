# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: newcomers to custom keyboards.** They want a keyboard that feels and sounds great but don't
  know switches, mounts, plates or stabilizers. They need someone to turn "what I want it to feel and sound
  like" into parts, without jargon.
- **Secondary: experienced enthusiasts.** They know what they want and come for build and tuning quality.
  They should be able to skip the guidance and state exact specs.
- The site leads with guidance for newcomers and keeps a direct path for enthusiasts.

## Product Purpose

Yoru Foundry is a one-person, commission-first workshop in Miami. Mike hand-builds and tunes custom
mechanical keyboards to order. The site exists to:
- explain what a custom build is,
- show the bench work behind it,
- help a visitor choose by ear and feel,
- start a commission conversation.

Success is a visitor who sends a commission request, feeling they understand what they'll get and that a
real person will build it.

## Positioning

- **One builder, start to finish.** The person you talk to is the one who sources, prepares, assembles,
  tunes, tests and documents the build. Nothing is lost between departments.
- **Taste first, parts second.** Newcomers describe the feel and sound they want; Mike makes the technical choices.
- **The process is visible.** Bench work is shown, not hidden behind a checkout page.
- **Chosen by ear.** Comparisons use real, standardized recordings, not internet labels.
- **No forced upsell.** Budget goes where it actually improves the experience. Mike won't recommend
  modifications that risk the PCB or reliability.

## Operating Context

**Commission types:**
- **Full builds:** Mike sources every part and delivers a finished, tuned board.
- **Bring-your-own-parts:** Mike assembles and tunes a board from parts the customer already owns.

**Commission flow** (`request-a-commission`):
1. Request
2. Consultation (layout, feel, sound, materials, connectivity, budget)
3. Parts and design
4. Build (preparation, assembly, switch and stabilizer work)
5. Final refinement and QC, then handoff

**Typical build window:** about 2–5 weeks after parts are confirmed. Low volume and long lead times are
part of the model.

**Bench stages shown on the site:** preparation, tuning, assembly, final refinement.

**Education ("Built to Taste"):** switch lubing, stabilizer tuning, keycap material and profile, mounting
style, plate material, sound profiles, plus an A/B listening comparison.

**Contact:** hello@yorufoundry.com (general), mike@yorufoundry.com (founder).
**Social:** Instagram @yorufoundry, TikTok @yoru.foundry.

## Capabilities and Constraints

- **Layouts:** 75% is offered first; 65% and TKL/80% come later.
- **Starting budget (Mike, 2026-10-06):** full builds start at $250, the minimum that is profitable.
  The current request form still offers "Under $150" and "$150–$250" bands; those need to change.
- **Bring-your-own-parts pricing (Mike, 2026-10-06):** offered as an option in the form's budget field.
  It can't be priced up front: Mike quotes it after checking which of the customer's parts work.
- **Named builds:** each build gets a one-of-one name (for example "Ember" for YF-001, a placeholder), so
  it reads as a personal piece ("Mark's keyboard, Ember"). A name is not a sound profile.
- **Keyboards only at launch.** The Mice, Mouse Pads, Desk Mats, Wrist Rests and Accessories pages are
  future ideas and are hidden at launch.
- **Stack:** static site. Pages are assembled from `/src` by `node build.js` into `/public`, and deployed
  on Cloudflare Workers Builds. No framework.
- **Build records** live as data (`BUILDS` in `src/static/data/content.js`). Detail pages use the build
  serial (`YF-###`). `SITE_MODE` switches between prelaunch and live.
- **Commission request** currently sends through `mailto:`. A replacement backend is an open decision (Phase 10).
- **No ecommerce.** No cart, ratings, reviews, urgency, discounts or newsletter popups.
- **Undecided:**
  - The form backend.
  - Whether the Archive and Journal pages are kept.

## Brand Commitments

- **Name:** Yoru Foundry ("yoru" means night). Motto: "Refined by Craft." Est. 2026.
- **Logo:** `/assets/yoru-foundry-logo-v5.webp`, a copper and patina circular medallion, is the official
  header logo.
- **Voice:**
  - First person singular ("I build", "I'll work with you"), never "we" or "our team".
  - Knowledgeable, precise, patient, personal, transparent.
  - No luxury filler, sales pressure or mass-market phrasing.
- **Copy approval:** Mike approves all public copy. Missing copy is asked for, never invented.

## Evidence on Hand

- **Real:** Mike's founder story (`src/about.html`), the commission process, the build-quality promises
  (`src/why-yoru.html`), contact details and socials.
- **Missing; must not be faked:**
  - photos of finished builds,
  - bench video,
  - sound recordings,
  - completed customer builds,
  - testimonials.
- **Placeholders today:**
  - `YF-001` "Ember Study" is a test record.
  - Audio is a 3-second silent MP3.
  - Image placeholders follow the locked ratios: 16:9 hero, 4:5 archive, 3:2 process, 1:1 detail.
- **Never use** stock keyboard photos.

## Product Principles

1. **Translate taste into parts.** Every page should help a newcomer say what they want without needing the vocabulary.
2. **Show the bench.** Process and reasoning are part of the product, not hidden.
3. **Prove it by ear.** Sound is the evidence; build pages and education should carry real recordings
   once they exist.
4. **Fewer, considered choices.** Curate rather than list everything; never imply inventory scale or urgency.
5. **Honest until real.** Placeholders say they are placeholders and keep the shape that real content will fill.

## Accessibility & Inclusion

- WCAG AA contrast for text.
- Full keyboard operation of menus and dialogs.
- `prefers-reduced-motion` is respected.
- No audio autoplays.
