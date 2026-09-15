# Yoru Foundry Agent Instructions

Before making any visual, CSS, layout, branding, navigation, responsive, or component change:

1. Treat this `AGENTS.md` file as the authoritative build and implementation rule set.
2. Read `YORU_SITE_MEMORY.md` for supplemental project history, dimensions, page architecture, and approved visual context. If it conflicts with `AGENTS.md`, follow `AGENTS.md`.
3. Do not reintroduce old brown / bronze / gold / olive / green-heavy experimental palettes.
4. Do not redesign the site from scratch unless Mike explicitly asks.
5. Preserve `/assets/yoru-foundry-logo-v5.webp` as the official header logo.
6. If `src/static/styles.css` changes, bump `config.stylesheetVersion` once in `build.js`, then rebuild so stale CSS cannot flash an old palette.
7. Keep first-paint critical colors consistent:
   - body: `#0C0E11`
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

- `--night-void` `#0C0E11`: page canvas, body, and footer.
- `--night-deep` `#111418`: alternate dark sections.
- `--night` `#181B1F`: elevated dark surfaces, header pairing, and theme color.
- `--gunmetal` `#2B2F32`: cards and media on dark surfaces.
- `--iron` `#3A3F43`: hover and active surfaces on dark cards.
- `--bone` / `--bone-text` `#F2EFE8`: the sole light surface and primary text on night.
- `--ink` `#171A1D`: primary text on Bone. This color is not a dark surface tier.
- `--muted-dark` `#B8B9B5`: secondary text on night.
- `--muted-light` `#6D6962`: secondary text on Bone.
- `--muted-deep` `#8A8C88`: tertiary text on `--night` only; never use it on cards.
- `--copper` `#B8734F`: night-only borders, fills, hairlines, and large/bold text.
- `--copper-text` `#CB9560`: body-size copper text on night and Gunmetal.
- `--copper-deep` `#915A37`: copper on Bone only.
- `--patina` `#6E938B`: night-only status and micro-accent.
- `--patina-deep` `#4E6A64`: patina on Bone only.
- `--state-error` `#C96A5A`: error state on night.
- `--state-error-deep` `#A34430`: error state on Bone.
- Success aliases Patina on night and Patina Deep on Bone.

Never use pure `#FFFFFF` or pure `#000000` anywhere.

Patina is a micro-accent only. Copper is an interaction/material accent, not a generic ecommerce-orange fill. No legacy brown, bronze, gold, olive, rust, or green-heavy palette may be reintroduced.

- Tier backgrounds go on full-bleed shells only, never on `.page-main`, `.page-hero`, or any max-width container.
- Exception: the request-a-build hero shell fills a grid area by design. Do not “fix” it.
- `body` and `footer` are both `--night-void` so short pages have no visible seam below the footer. Content sections use a higher tier so the footer still reads as distinct.
- Cream (`--bone`) is an accent, not a surface family. Maximum one light section per page. If a page needs two, the second is wrong.
- `--copper` and `--patina` are night-only. `--copper-deep` and `--patina-deep` are Bone-only. Neither crosses over.
- `--copper` is 3.60:1 on `--gunmetal`. Use it for borders, fills, and text at 24px+ or 19px bold only. Use `--copper-text` at body size.
- `--muted-deep` is 3.98:1 on `--gunmetal`. Never use it on cards.
- Section rhythm comes from alternating night tiers, not from alternating light and dark.
- Borders use the four-tier hairline scale: quiet, standard, strong, and accent. No raw border values.
- `box-shadow: none`, except focus indicators, which use `outline`.
- Any new color must state its legal surfaces and measured contrast ratio before being added.

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

- **Mike is the final authority for public-facing brand copy.** Do not invent, rewrite, or publish new brand copy unless Mike explicitly asks for copy work or supplies/approves the wording.
- If a layout or implementation requires copy that has not been supplied, stop and ask rather than filling the gap with invented text.
- Write approved copy in **first person singular**.
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
  - body: Night Void `#0C0E11`
  - header: Forged Bone `#F2EFE8`
  - nav text: Night Ink `#171A1D`
  - header CTA: Night Iron + Copper border + Forged Bone text
- If `src/static/styles.css` changes, update `config.stylesheetVersion` in `build.js` and rebuild. This is the single source of truth for the stylesheet query version.
- Never leave pages pointing at mixed stylesheet versions.

### Development workflow

- Phase work normally belongs on `design-pass`, not `main`, **but only when the agent has been assigned sole write ownership of that branch**.
- **One writable branch may have only one active AI contributor at a time.** Other agents may inspect it read-only. Parallel implementation requires separate branches with explicit scopes. Confirm branch ownership before making any write.
- Do **not** push design-pass phase work directly to `main`.
- Work through requested phases in order.
- Keep each phase reviewable and independently revertible. When Mike asks for separate commits, keep each requested item in its own commit so it can be reviewed or reverted independently.
- Never report an item as “fixed” or “verified” without real build/test output. A partial build is not verification. Report actual measurements/output rather than expected output presented as fact.
- The Cloudflare branch preview is the render environment. Local Wrangler does not work in agent environments and must not be attempted.
- Automated fetches of a Cloudflare preview may return stale cached output. **Mike’s browser after a hard refresh is the source of truth for rendered appearance.** If an automated preview read disagrees with what Mike sees, treat the automated read as stale/unreliable.
- A missing local render is not a blocker. Complete static validation, push to the assigned non-production branch, state the rendering limitation explicitly, and leave final visual verification to Mike in the Cloudflare branch preview.
- Commit after each completed phase/item with a clear phase-specific message.
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
- `src/static/data/content.js` has a dual role: `build.js` evaluates it at build time for prerendering, and the built copy is also available for client-side hydration. **Critical content must exist in generated HTML at build time; client-side JavaScript may hydrate/enhance it but must never be required for the content to exist.** Do not regress to empty client-side shells.
- The existing `footerVariant` values (`standard`, `archive`, `emblem`) are temporary compatibility scaffolding. **The current Phase 3.5 task is to collapse them into one existing/current footer across all 17 footer-bearing pages.** This is a normalization task, not the future Phase 9 four-column footer redesign. Do not add new footer variants. A later phase may redesign the already-unified footer when Mike explicitly starts that phase.
- Every generated HTML page must begin with `<!-- GENERATED FILE — DO NOT EDIT. Edit /src and run node build.js. -->`.
- The build must fail with a non-zero exit code for missing placeholders, invalid navigation values, duplicate/invalid outputs, or any source page that fails to create a non-empty output file.
- Cloudflare Workers Builds runs `node build.js` before uploading `/public`. Non-production branches use version uploads and preview URLs; only `main` may deploy to production.



## Phase 3 CSS architecture

These rules are canonical for `src/static/styles.css` and must be preserved by future coding agents unless explicitly changed.

### Token architecture

- Keep **one consolidated `:root` token catalog**. Do not add competing `:root` theme blocks.
- No hardcoded hex, RGB, or RGBA color literals outside `:root`.
- Canonical semantic color tokens are the surface, text, accent, state, status, hairline, and grain tokens listed above. Compatibility aliases may only resolve to those canonical roles and must not introduce another color value.
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

- Phase work belongs on a non-production development branch, normally `design-pass`, not `main`.
- `design-pass` may have only one active AI writer at a time. If another agent is already writing there, remain read-only or use a separate explicitly assigned branch.
- Keep each phase in its own reviewable commit; keep separate requested items in separate commits when Mike asks.
- Do not proceed to a later phase when Mike has asked to review the current phase first.
