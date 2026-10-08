# Yoru Foundry Agent Instructions

Before making any visual, CSS, layout, branding, navigation, responsive, or component change:

1. Treat this `AGENTS.md` file as the authoritative build and implementation rule set.
2. Read `YORU_SITE_MEMORY.md` for project history and page architecture, `PRODUCT.md` for product truth, and `DESIGN_PLAN.md` plus `mockups/home.html` for the approved direction. If they conflict with `AGENTS.md`, follow `AGENTS.md`.
3. The approved direction is **Verdigris** (Mike, 2026-10-06): a dark green-sand ground lit by raw copper, from the logo. The old Yoru Nocturne palette (cream `#F2EFE8`, night-void `#0C0E11`, Cormorant Garamond, Manrope) is retired. Do not reintroduce it, and do not reintroduce brown / bronze / gold / olive experimental palettes.
4. Do not redesign the site from scratch unless Mike explicitly asks.
5. Preserve the logo medallion (`/assets/yoru-foundry-logo-v5.webp` or its trimmed derivative). Never redraw or recolor it.
6. If `src/static/styles.css` changes, bump `config.stylesheetVersion` once in `build.js`, then rebuild so stale CSS cannot flash an old palette.
7. Keep first-paint critical colors consistent:
   - body and header: Cast `#151A1A`
   - text and nav text: Bright `#EEF0EC`
   - header CTA: Green Sand `#1F2726` keycap, Bright text
8. Verify desktop, tablet, and mobile behavior after broad changes.
9. For visual design, Impeccable's guidance takes priority over the design rules in this file (Mike, 2026-10-08). "Skills in this repo" at the end says what that covers and what still holds.

Outside Impeccable-led design work, when in doubt, preserve the current approved appearance and ask before making a major visual departure.

## Build rules

These rules are standing constraints for all future work in this repository. Read and follow them before changing HTML, CSS, JavaScript, content, or assets.

### Product and brand posture

- Yoru Foundry is a solo, commission-first workshop. One person hand-builds custom keyboards to order (mechanical now; Hall effect or TMR magnetic boards may come later).
- The site must read as a workshop / atelier and portfolio, **not** as a conventional ecommerce store.
- Low volume and long lead times are part of the operating model; do not introduce UI that implies mass retail, instant fulfillment, or a large team.
- The Verdigris direction is approved. Systematize and refine it; do not repaint or redesign it from scratch unless Mike explicitly asks.
- Real photography, video, audio, and completed-build content do not exist yet. Keep honest placeholders that can be replaced later without layout changes. Never fabricate finished builds or use stock keyboard imagery as a substitute.

### Canonical design tokens

Use the Verdigris tokens below. Prefer CSS custom properties over literal color values. Do not introduce ad-hoc palette colors.

| Token | Hex | Role |
|---|---|---|
| `--deep` | `#0C1010` | Full-width bands (sound band) |
| `--cast` | `#151A1A` | Page canvas, body, header, footer, theme color |
| `--cast-low` | `#181E1E` | Alternate sections on pages not yet rebuilt |
| `--cast-hi` | `#1A2120` | Elevated sections |
| `--green-sand` | `#1F2726` | Raised surfaces: section keys, cards, frames, plain keycap buttons |
| `--green-sand-hi` | `#2A3432` | Hover and active on raised surfaces |
| `--bright` | `#EEF0EC` | Primary text on dark; interim light surface on pages not yet rebuilt |
| `--ink` | `#151A1A` | Text on `--bright` only |
| `--pewter` | `#A7B2AE` | Secondary text on dark |
| `--pewter-deep` | `#8C9894` | Tertiary text on dark (never body copy) |
| `--muted-on-bright` | `#5A6461` | Secondary text on `--bright` |
| `--raw-copper` | `#E8834D` | The one accent: primary commission action, active state, Esc key |
| `--copper-deep` | `#A14E22` | Copper on `--bright` only |
| `--verdigris` | `#4FB3A0` | Status only (open, in progress, playback) |
| `--verdigris-deep` | `#2B6E62` | Verdigris on `--bright` only |
| `--state-error` | `#E0786A` | Error on dark |
| `--state-error-deep` | `#A63A2A` | Error on `--bright` |

Measured contrast (WCAG 2.x): Bright on Cast 15.3:1, on Green Sand 13.3:1, on Green Sand Hi 11.2:1. Pewter on Cast 8.1:1, on Green Sand 7.0:1, on Green Sand Hi 5.9:1. Pewter Deep on Green Sand 5.1:1. Cast text on a Raw Copper fill 6.5:1. Raw Copper on Green Sand 5.7:1. Verdigris on Cast 6.9:1, on Green Sand 6.0:1. Muted, copper-deep and verdigris-deep on Bright are all 5.0:1 or higher.

Rules:
- Never use pure `#FFFFFF` or pure `#000000` anywhere.
- **One colored key per view.** Raw Copper fills only the primary commission button (and the Esc key in layout drawings). Everything else that needs emphasis uses a copper edge or underline, never a copper block. Copper is light, not paint: no large copper fields.
- Verdigris marks status. It is never a background field or a large fill.
- The old Nocturne token names (`--night-void`, `--bone`, `--copper`, `--patina`, `--gunmetal` and their aliases) remain only as compatibility aliases that resolve to Verdigris tokens, until each page is rebuilt. New work uses the Verdigris names.
- Tier backgrounds go on full-bleed shells only, never on `.page-main`, `.page-hero`, or any max-width container.
- Section rhythm comes from dark tiers and one full-width deep band, not from alternating light and dark. Verdigris has no light section; `--bright` surfaces are interim and disappear as pages are rebuilt.
- Borders use the hairline scale: quiet, standard, strong, and accent. No raw border values.
- `box-shadow: none`, except focus indicators, which use `outline`.
- Any new color must state its legal surfaces and measured contrast ratio before being added.

### Texture

- **No interface texture** (Mike, 2026-10-06). Material comes from real build photography. A texture critique (`mockups/tex-critique.png`) found the trial grain too strong, behind text, and dusting the photo frame.
- Do not add grain, noise, paper, or metal overlays. The old texture files in `src/static/img/textures/` are slated for deletion.
- The only atmospheric effect is the faint Raw Copper glow at the bottom of the hero media frame ("light from a pour"). It sits behind media, never behind text.

### Type roles

- **Homepage headline only:** **Aboreto** (wide, thin capitals), one weight, never faux-bolded. It is strongest large; never use it for small text.
- Display, headings, navigation, labels, buttons, and spec values: **Cinzel** (carved Roman capitals; lowercase renders as small capitals), 600–700.
- Body copy, long-form, captions, and notes: **Alegreya**.
- Spec numbers use tabular figures. No monospace font as a "technical" costume.
- Do not add **Inter**. Cormorant Garamond, Manrope, Archivo and Source Serif 4 are retired.
- **Exception: the hub display** (Mike, 2026-10-07). The lettering on the homepage hub's rendered screen is **Chakra Petch** 600, a squared digital face. It exists only baked into that render (`mockups/keys/render-hub.html`); never load it as a page font or use it anywhere else.
- Cinzel and Aboreto are capital-only faces, so headings and labels read as capitals; keep body copy in Alegreya so pages never become all capitals. No extra letter-spacing on labels (no spaced-capital eyebrows).
- Minimum text size 12px. `font-synthesis: none` so single-weight faces are never faked bold.
- Chosen by Mike on 2026-10-06 after five font rounds (`mockups/fonts.html`, `mockups/fonts-home-*.png`).

### Button system

- Buttons are **keycaps**: 6px radius, 1px edge, a thicker bottom edge (4px) that shortens as the key travels down on hover (2px) and press (1px). Section keys use the same press at 8px radius with a 5px bottom edge.
- **Primary** (commission): Raw Copper face, Cast text, darker copper edge. Only one per view.
- **Plain** (header commission, secondary actions): Green Sand face, Bright text, near-black edge.
- Text links: Cinzel, underlined with a copper or verdigris underline; no "→" appended.
- No gradient buttons. No glossy, glass, neon, or oversized ecommerce-style CTAs. Buttons never flash pure white or black.
- **Exception: the rendered commission keycap** (Mike, 2026-10-06). The commission button may be a 3D-rendered Enter keycap image (`/assets/keys/`): its shading and baked-in cast shadow are part of the photo-real render, not CSS gradients or `box-shadow`. Idle, hover and pressed are separate renders (the pressed cap sinks into the plate) swapped instantly by state. Sharp corners (1.0–1.3mm walls, 0.7mm top edge). Re-render with `mockups/keys/render-keycap.html`; never fake it with CSS gradients or shadows.
- **Exception: the footer keyboard** (Mike, 2026-10-07). The footer is a 3D-rendered 75% keyboard (`/assets/footer-board/`, data in `src/static/data/footer-board.json`): links are words spelled on the keys or named wide keys, and a word's rendered hover and pressed frames swap in instantly, like the commission keycap. The copper Enter key is the one copper key. The Esc key carries the logo medallion printed on the cap (the image unaltered apart from render lighting) and links home. Phones show the board as a picture with the links as a list. Re-render with `mockups/keys/render-board.html`; never fake it with CSS.

### Motion specification

- Motion must be restrained and tactile, never playful.
- Default interaction duration: approximately **180–220ms**.
- Prefer `ease` / gentle ease-out behavior.
- Hover lift should generally stay within **1–3px**; do not use dramatic scaling.
- Animate only properties that communicate state: opacity, transform, border-color, background-color, and text color.
- No bounce, spring, elastic, parallax, scroll-jacking, or decorative continuous animation.
- **Exception: the header cable LED** (Mike asked for it, 2026-10-06). Pulses of copper light (a bright core with a soft falloff, inside the braid, like the homepage hub cable) travel inside the header's braided cable, from the medallion to the first key, one after another. It is the only continuous animation on the site; it reveals a glow render of the cable through a moving mask (`script.js`), never sits behind text, and is fully off under `prefers-reduced-motion: reduce` and wherever the cable is hidden. When the first bead reaches the keys, a soft copper underglow and legend glow rise once on the header keys over 2.6s (Mike, 2026-10-06); with reduced motion, or with no cable on screen, the keys are simply lit.
- **The footer keyboard's light** (Mike, 2026-10-07) follows the same rule as the header keys: when the board is half in view, the linked keys' copper underglow and legend glow rise once over 2.6s; the hovered word glows brighter. With reduced motion they are simply lit. Nothing loops.
- **Exception: the homepage hub and cable** (Mike, 2026-10-07). The homepage closing line sits on the backlit display of a 3D-rendered USB dock (`/assets/hub/`, renderer `mockups/keys/render-hub.html`, export `hub-export.py`, data `src/static/data/hub.json`); the display fades on (1.4s) as the hub comes into view. A braided cable is plugged into the dock's front port and hangs down into the footer keyboard. Copper light runs down inside the braid once (a short pulse inside the braid: a bright core with a quick soft falloff, easing toward the scroll position, dimming while scrolling pauses), following the page scroll going down, never back up (the only scroll-linked motion on the site; it never moves the page or delays scrolling); when it reaches the board the keys light and the pulse fades out (0.8s). Homepage only. With reduced motion there is no bead and the display is simply on. Phones show the line as text.
- Respect `prefers-reduced-motion: reduce`; nonessential transitions and animations must collapse or disable.
- Motion should make the interface feel machined and deliberate, not app-like.

### Voice and copy

- **Mike is the final authority for public-facing brand copy.** Do not invent, rewrite, or publish new brand copy unless Mike explicitly asks for copy work or supplies/approves the wording.
- If a layout or implementation requires copy that has not been supplied, stop and ask rather than filling the gap with invented text.
- Write approved copy in **first person singular**.
- Use “I build”, “I source”, “I tune”, “I’ll work with you”.
- Never use “our team” or copy that implies employees or a larger operation. **“We” is allowed only when it means Mike and the client working together** (“We can work through the technical choices together.”), never a company “we” (Mike, 2026-10-06).
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

- Follow the approved homepage composition in `mockups/home.html`: media frame with the 75% layout drawing (until real footage exists), headline and line beneath, one copper commission button, two entry links, and a build sheet beside it.
- The homepage H1 is "Forged by night." with "After dark, the forge is lit and a keyboard is made." beneath it (Mike, 2026-10-06). The page `<title>` and meta description say "custom keyboards" (not "mechanical": Mike may build Hall effect or TMR boards too, 2026-10-07).
- Avoid the AI-template tells: eyebrow labels, details joined with dots, "→" on links, 01/02/03 on non-sequences, and rows of identical cards.
- Do not convert the site to a generic centered landing-page template. The hero must not become a centered H1 with two CTAs.
- Product photography and real build media will become the visual artwork. UI chrome stays restrained enough to support it.

### First paint, palette, and cache discipline

- Every HTML page must keep `<meta name="theme-color" content="#151A1A">`.
- Every HTML page must keep the critical first-paint theme so navigation never flashes an old palette.
- Critical first-paint roles:
  - body and header: Cast `#151A1A`
  - text and nav text: Bright `#EEF0EC`
  - header CTA: Green Sand `#1F2726` keycap with Bright text
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
- Preserve the logo medallion (`/assets/yoru-foundry-logo-v5.webp` or its trimmed derivative).
- Read `YORU_SITE_MEMORY.md` before beginning visual work.
- Read `ROADMAP.md` for the current phase, the order of work, and open decisions. Update its status table when a phase closes.

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
- A page's closing link is its PAGE `next` field (`{"href", "text"}`), rendered by the build at the end of `<main>`. The links form one path (Mike, 2026-10-07): About → Why Yoru → Trust the Process → Built to Taste → Crafted Art → (layout page) → Request a Commission; Journal joins it at Built to Taste, Archive goes to the request page. Do not hand-write closing links in page HTML.
- Every page has the one footer (`footerVariant: standard`), the Phase 9 keyboard footer (2026-10-07). Do not add footer variants.
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
  - `--font-display`: Cinzel
  - `--font-body`: Alegreya
  - `--font-headline`: Aboreto (homepage headline only)
  - `--font-mono`: system monospace stack (code only)
- Required type primitives: `--step-1` through `--step-5`.
- Font sizes, font-family declarations, spacing declarations, radii, color values, and transition durations must use custom properties rather than anonymous repeated literals.
- A spacing token must never be applied to a declaration whose original value was a percentage, `em`, `rem`, `vw`, `vh`, or `ch`. Only original `px` values may receive `px` spacing tokens.
- Phase 3 is a refactor with an explicitly permitted set of visual deltas: borders 1px→0.5px, shadows removed, radii normalized, easing standardized. Any visual change outside that list is a bug.

### Geometry

- `box-shadow: none`, with the sole exception of focus indicators, which must use `outline`.
- Images and media frames use `border-radius: 0`.
- Keycap buttons use a 6px radius; section keys use 8px; inputs, selects, and textareas use 4px.
- True circular micro-controls such as status dots or play buttons may use the circular radius token.
- Standard border width is `--border-width: 0.5px`; keycap edges use 1px with the thicker bottom edge described in the button system.
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

## Skills in this repo

Ponytail and Impeccable are stored in `.claude/skills/` so every session loads them; `frontend-design` is built into Claude. Sources and versions are in `.claude/skills/SOURCES.md`.

### Impeccable leads on visual design (Mike, 2026-10-08)

Impeccable is here to keep the site from looking AI-made. For visual design work, follow Impeccable first; Mike then adjusts what it produces.

- **Where Impeccable wins.** When its guidance disagrees with a design rule in this file, follow Impeccable. That covers palette and tokens, type, texture, shadows and geometry, buttons, motion, layout and hero guardrails, and the design items on the never-add list. Do not tone its output down in advance to fit the older rule.
- **Then Mike adjusts.** Build on a non-production branch, tell Mike which rules in this file the result departs from, and let him adjust it in the preview. Once he approves, update this file and `YORU_SITE_MEMORY.md` to match what shipped, so the rules never lag the site.
- **What still holds.** The rules that are not about how the site looks:
  - the build and branch workflow: never edit `/public`, nothing straight to `main`, real build output before calling anything verified;
  - the logo medallion stays unaltered;
  - Mike is the final authority on public-facing copy;
  - no fabricated builds and no stock keyboard photos;
  - the workshop-not-store posture: no cart, ratings, countdowns, trust badges or the other ecommerce patterns.

### Ponytail

Ponytail is the default way to write code here: load the `ponytail` skill at the start of any coding task. Where it disagrees with this file's build and workflow rules, this file wins.
