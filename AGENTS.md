# Yoru Foundry Agent Instructions

Before making any visual, CSS, layout, branding, navigation, responsive, or component change:

1. Treat this `AGENTS.md` file as the authoritative build and implementation rule set.
2. Read `YORU_SITE_MEMORY.md` for supplemental project history, dimensions, page architecture, and approved visual context. If it conflicts with `AGENTS.md`, follow `AGENTS.md`.
3. Do not reintroduce old brown / bronze / gold / olive / green-heavy experimental palettes.
4. Do not redesign the site from scratch unless Mike explicitly asks.
5. Preserve `/assets/yoru-foundry-logo-v5.webp` as the official header logo.
6. If `public/styles.css` changes, bump the version query on **every HTML page** so stale CSS cannot flash an old palette.
7. Keep first-paint critical colors consistent:
   - body: `#181B1F`
   - header: `#F2EFE8`
   - nav text: `#171A1D`
   - header CTA: Night Iron + `#B8734F` border + Forged Bone text
8. Verify desktop, tablet, and mobile behavior after broad changes.

When in doubt, preserve the current live appearance and ask before making a major visual departure.

## Build rules

These rules are standing constraints for all future work in this repository. Read and follow them before changing HTML, CSS, JavaScript, content, or assets.

### Product and brand posture

- Yoru Foundry is a solo, commission-first workshop. One person hand-builds custom mechanical keyboards to order.
- The site must read as a workshop / atelier and portfolio, **not** as a conventional ecommerce store.
- Low volume and long lead times are part of the operating model; do not introduce UI that implies mass retail, instant fulfillment, or a large team.
- The current visual direction is already approved. Systematize and refine it; do not repaint or redesign it from scratch unless Mike explicitly asks.
- Real photography, video, audio, and completed-build content do not exist yet. Keep honest placeholders that can be replaced later without layout changes. Never fabricate finished builds or use stock keyboard imagery as a substitute.

### Canonical design tokens

Use the Yoru Nocturne tokens below. Prefer CSS custom properties over literal color values. Do not introduce ad-hoc palette colors.

- Night Iron / primary dark canvas: `#181B1F`
- Deep Night / deepest dark: `#111418`
- Forged Bone / primary light material: `#F2EFE8`
- Soft Bone / fields and light highlights: `#F8F5EF`
- Gunmetal / cards and media: `#2B2F32`
- Gunmetal highlight: `#34393D`
- Gunmetal low: `#272C30`
- Burnished Copper / primary interaction accent: `#B8734F`
- Copper highlight: `#C88967`
- Copper deep: `#94573D`
- Aged Patina / micro-accent only: `#4E6A64`
- Warm Steel / secondary technical text: `#9A9B97`
- Night Ink / text on light surfaces: `#171A1D`
- Light secondary text: `#D7D3CB`
- Mid secondary text: `#B8B9B5`
- Bone Low / light hover fill: `#E7E1D7`

Never use pure `#FFFFFF` or pure `#000000` anywhere.

Patina is a micro-accent only. Copper is an interaction/material accent, not a generic ecommerce-orange fill. No legacy brown, bronze, gold, olive, rust, or green-heavy palette may be reintroduced.

### Texture roles

- Forged Bone: subtle archival-paper / uncoated-stock grain, approximately 2–4%.
- Night Iron: fine bead-blasted / anodized-metal micro-grain, approximately 3–6%.
- Gunmetal: same material family as Night Iron, but smoother and lower contrast, approximately 2–4%.
- Copper: satin finish only; no grain, rust, roughness, or patina wash.
- Patina: color only; never a textured surface.
- Texture must add physicality without noticeably shifting the underlying token color.

### Type roles

- Display headings and navigation: **Cormorant Garamond**.
- Body copy, forms, metadata, and UI: **Manrope**.
- Do not add **Inter**.
- Keep the editorial hierarchy: large serif headlines, compact readable body copy, restrained technical labels.
- Do not replace the typography with a generic SaaS-style sans-serif hierarchy.

### Button system

- Header “Request a Commission”: Night Iron fill, 0.5px Burnished Copper border, Forged Bone text, 4px control radius, subtle hover lift.
- Primary CTA on a dark surface: hollow / transparent with a 0.5px Burnished Copper border and Forged Bone text; Copper fill may appear on hover.
- Secondary CTA on a dark surface: transparent with a restrained Forged Bone / Warm Steel border and no competing accent fill.
- Light-surface buttons must remain within the same Night Iron / Copper / Forged Bone system.
- No gradient buttons.
- No glossy, glass, neon, or oversized ecommerce-style CTAs.
- Buttons must never flash pure white, pure black, brown, bronze, or a legacy palette color during hover, active, focus, navigation, or first paint.

### Motion specification

- Motion must be restrained and tactile, never playful.
- Default interaction duration: approximately **180–220ms**.
- Prefer `ease` / gentle ease-out behavior.
- Hover lift should generally stay within **1–3px**; do not use dramatic scaling.
- Animate only properties that communicate state: opacity, transform, border-color, background-color, and text color.
- No bounce, spring, elastic, parallax, scroll-jacking, or decorative continuous animation.
- Respect `prefers-reduced-motion: reduce`; nonessential transitions and animations must collapse or disable.
- Motion should make the interface feel machined and deliberate, not app-like.

### Voice and copy

- Write in **first person singular**.
- Use “I build”, “I source”, “I tune”, “I’ll work with you”.
- Never use “we”, “our team”, or copy that implies employees or a larger operation.
- Tone: knowledgeable, precise, patient, personal, craft-led, and transparent.
- Avoid generic luxury filler, aggressive sales language, urgency manipulation, and mass-market ecommerce phrasing.

### Content-as-data rule

- Repeated structured content must be represented as data rather than maintained as duplicated markup.
- Examples: process steps, comparison options, product/layout metadata, commission specs, material options, archive entries, status labels, and other repeatable collections.
- Keep one source of truth for repeated content, then render or reuse it consistently.
- Unique editorial prose may remain in semantic HTML when it is page-specific.
- Do not duplicate the same factual content across pages if it can be sourced from one data structure.
- Placeholders should use the same content shape that future real content will use so photography, video, audio, and completed builds can drop in without layout rewrites.
- Do not over-engineer one-off content into a data layer when there is no reuse or structural benefit.

### Never add

Do not add any of the following unless Mike explicitly reverses this rule:

- shopping cart
- star ratings
- review widgets
- countdown timers
- trust badges
- free-shipping banners
- newsletter popups
- “customers also bought” / recommendation widgets
- gradient buttons
- glassmorphism
- Inter
- stock keyboard photos
- a centered hero consisting of an H1 with two CTAs

Also avoid ecommerce patterns that imply inventory scale, urgency, discounting, or commodity shopping.

### Layout and hero guardrails

- Preserve the existing editorial / atelier composition and asymmetry.
- Do not convert the site to a generic centered landing-page template.
- The hero must not become a centered H1 with two CTAs.
- Product photography and real build media will become the visual artwork later; UI chrome should remain restrained enough to support it.

### First paint, palette, and cache discipline

- Every HTML page must keep `<meta name="theme-color" content="#181B1F">`.
- Every HTML page must keep the critical first-paint theme so navigation never flashes an old palette.
- Critical first-paint roles:
  - body: Night Iron `#181B1F`
  - header: Forged Bone `#F2EFE8`
  - nav text: Night Ink `#171A1D`
  - header CTA: Night Iron + Copper border + Forged Bone text
- If `src/static/styles.css` changes, update `config.stylesheetVersion` in `build.js` and rebuild. This is the single source of truth for the stylesheet query version.
- Never leave pages pointing at mixed stylesheet versions.

### Development workflow

- Work on the `design-pass` branch. Do **not** push design-pass phase work directly to `main`.
- Work through requested phases in order.
- Keep each phase reviewable and independently revertible.
- The Cloudflare `design-pass` branch preview is the only render check. Local Wrangler does not work in agent environments and must not be attempted.
- A missing local render is not a blocker. Complete static validation, push to `design-pass`, note the limitation, and leave visual verification to the Cloudflare branch preview.
- Commit after each completed phase with a clear phase-specific message.
- For broad visual changes, verify desktop, tablet, and mobile behavior.
- Preserve the official header logo at `/assets/yoru-foundry-logo-v5.webp`.
- Read `YORU_SITE_MEMORY.md` before beginning visual work.

### Static build workflow

- `/src` is the source of truth for page HTML. Every source page declares its output filename, title, active navigation item, and layout in its `PAGE` metadata block.
- Shared markup lives only in `/src/partials`: `head.html`, `header.html`, `footer.html`, and `scripts.html`.
- Static source assets, CSS, JavaScript, content data, images, and audio live in `/src/static`.
- `/public` is generated, gitignored deployment output. **Never edit `/public` directly.** Edit `/src` and run the build.
- Build command: `node build.js`. There is no framework, bundler, or watch-mode dependency.
- `build.js` contains the single `config` object for `stylesheetVersion`, `siteTitle`, and `SITE_MODE`.
- A stylesheet version bump is one edit to `config.stylesheetVersion`; `node build.js` propagates it to every generated page.
- Active navigation is rendered from each page's `activeNav` metadata. Do not restore client-side pathname-based active-nav detection.
- Every generated HTML page must begin with `<!-- GENERATED FILE — DO NOT EDIT. Edit /src and run node build.js. -->`.
- The build must fail with a non-zero exit code for missing placeholders, invalid navigation values, duplicate/invalid outputs, or any source page that fails to create a non-empty output file.
- Cloudflare Workers Builds runs `node build.js` before uploading `/public`. Non-production branches use version uploads and preview URLs; only `main` may deploy to production.



## Phase 3 CSS architecture

These rules are canonical for `src/static/styles.css` and must be preserved by future coding agents unless explicitly changed.

### Token architecture

- Keep **one consolidated `:root` token catalog**. Do not add competing `:root` theme blocks.
- No hardcoded hex, RGB, or RGBA color literals outside `:root`.
- Required semantic color tokens:
  - `--canvas`: Night Iron / primary page canvas
  - `--surface`: Gunmetal / cards, technical panels, media surfaces
  - `--ink`: Night Ink / text on light surfaces
  - `--muted-on-light`: accessible muted supporting text on Forged Bone and other light surfaces
  - `--muted-on-dark`: accessible muted supporting text on Night Iron, Gunmetal, and other dark surfaces
  - `--accent`: Burnished Copper / restrained interaction accent
- Required font tokens:
  - `--font-display`: Cormorant Garamond
  - `--font-body`: Manrope
  - `--font-mono`: system monospace stack
- Required type primitives: `--step-1` through `--step-5`.
- Font sizes, font-family declarations, spacing declarations, radii, color values, and transition durations must use custom properties rather than anonymous repeated literals.
- A spacing token must never be applied to a declaration whose original value was a percentage, `em`, `rem`, `vw`, `vh`, or `ch`. Only original `px` values may receive `px` spacing tokens.
- Phase 3 is a refactor with an explicitly permitted set of visual deltas: borders 1px→0.5px, shadows removed, radii normalized, easing standardized. Any visual change outside that list is a bug.

### Geometry

- `box-shadow: none`, with the sole exception of focus indicators, which must use `outline` instead.
- Images and card-like surfaces use `border-radius: 0`.
- Buttons, inputs, selects, and textareas use `border-radius: 4px`.
- True circular micro-controls such as status dots or information tips may use the circular radius token.
- Standard border width is `--border-width: 0.5px`.
- Borders must remain low contrast. Use the defined line tokens rather than high-opacity hardcoded borders.

### Motion

- Canonical easing: `--ease: cubic-bezier(0.16, 1, 0.3, 1)`.
- Durations are tokenized; current motion primitives include fast, base, slow, and reduced-motion/none values.
- State rules such as `:hover`, `:focus`, `:focus-visible`, `:active`, `[aria-current]`, and disabled states must follow the same token system.
- `prefers-reduced-motion: reduce` must disable nonessential motion through the reduced-motion tokens.

### Validation requirements

After any CSS architecture or token change, statically verify all of the following even when browser rendering is unavailable:

1. Every `var(--...)` reference resolves to a custom property defined in the canonical `:root`.
2. No hardcoded color literal exists outside `:root`.
3. No active non-`none` box shadow exists.
4. No accidental 1px/2px component border remains where the 0.5px border token is required.
5. State selectors were included in the sweep.
6. No token replacement changes the computed value unless the requested phase explicitly calls for that visual change.
7. No missing/wrong token can cause text, backgrounds, or borders to silently drop.
8. Text/background contrast must not regress from the pre-change version.
9. If `styles.css` changes, update `config.stylesheetVersion` in `build.js` and regenerate `/public`.

### Current branch workflow

- Phase work belongs on `design-pass`, not `main`.
- Keep each phase in its own reviewable commit.
- Do not proceed to a later phase when Mike has asked to review the current phase first.
