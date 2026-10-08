---
paths:
  - "src/**/*.html"
  - "src/static/**/*.css"
  - "src/static/**/*.js"
  - "mockups/**/*"
---

# Design rules

Moved from `AGENTS.md` unchanged, and as binding. Impeccable leads on visual design (Mike, 2026-10-08): where its guidance disagrees with a rule here, follow Impeccable. `AGENTS.md`, "Skills in this repo", says what that covers.

Before changing how the site looks:

1. The approved direction is **Verdigris** (Mike, 2026-10-06): a dark green-sand ground lit by raw copper, from the logo. The old Yoru Nocturne palette (cream `#F2EFE8`, night-void `#0C0E11`, Cormorant Garamond, Manrope) is retired. Do not reintroduce it, and do not reintroduce brown / bronze / gold / olive experimental palettes.
2. If `src/static/styles.css` changes, bump `config.stylesheetVersion` once in `build.js`, then rebuild so stale CSS cannot flash an old palette.
3. Keep first-paint critical colors consistent:
   - body and header: Cast `#151A1A`
   - text and nav text: Bright `#EEF0EC`
   - header CTA: Green Sand `#1F2726` keycap, Bright text

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
