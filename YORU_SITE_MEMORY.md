# Yoru Foundry Website — Design System / Memory Bank

Supplemental memory for any session working on the Yoru Foundry website. `AGENTS.md` holds the rules and wins
on any conflict. `PRODUCT.md` holds product truth. `DESIGN_PLAN.md` and `mockups/home.html` hold the approved
direction and the reasoning behind it.

## 1. Brand

- Brand: **Yoru Foundry**. "Yoru" means night.
- Motto: **Refined by Craft.** (footer). EST. 2026.
- Homepage headline: **"Forged by night."** with "After dark, the forge is lit and a keyboard is made." beneath it.
- Positioning: one builder in Miami, commission-first custom mechanical keyboards. Newcomers first, enthusiasts
  second. Full builds from $250; bring-your-own-parts is priced after Mike checks the parts.
- Builds are **named one-of-ones** (YF-001 "Ember" is the placeholder), so each reads as a personal piece.
- Feel: a forge at night. Dark, quiet, hand-made, lit by hot copper. Not gaming RGB, not SaaS, not generic
  ecommerce, not black-and-gold luxury.

## 2. Logo

- The copper and patina circular medallion: `/assets/yoru-foundry-logo-v5.webp` (128 × 128).
- The raster has a baked black ring outside the copper rim. Use a circular cut just inside it (see
  `/assets/yoru-foundry-logo-trim.webp`, used in the header); never redraw or recolor the medallion.
- Header logo 64px desktop, 52px phone. The logo links home.

## 3. Palette — Verdigris (chosen 2026-10-06)

Chosen from four "foundry at night" studies (Pour, Temper, Yoru, Verdigris) and a Pour/Verdigris hybrid. It comes
straight from the logo: raw copper and its green patina on a dark green-sand ground. Full token table and measured
contrast are in `AGENTS.md`.

| Name | Hex | Role |
|---|---|---|
| Deep | `#0C1010` | full-width bands |
| Cast | `#151A1A` | page, header, footer |
| Green Sand | `#1F2726` | raised surfaces, keys, frames |
| Bright | `#EEF0EC` | text |
| Pewter | `#A7B2AE` | secondary text |
| Raw Copper | `#E8834D` | the one accent: primary commission action |
| Verdigris | `#4FB3A0` | status only |

- One colored key per view: only the primary commission button is copper-filled.
- No light sections in the new design. `--bright` surfaces on old pages are interim.

## 4. Texture

**None.** Tested (cast-iron page grain, sand-cast keys) and rejected on 2026-10-06: material comes from real build
photography, as on Keycult, Mode and Angry Miao. The only effect is a faint copper "pour" glow at the bottom of the
hero media frame.

## 5. Typography

- Homepage headline: **Aboreto** (wide, thin capitals; large sizes only).
- Display, headings, nav, labels, buttons, spec values: **Cinzel** (carved Roman capitals).
- Body and notes: **Alegreya**.
- Chosen 2026-10-06 (version 4 of `mockups/fonts-home-*`): "foundry, night, metalwork, artisanal, clean, dwarven/mystical".
  Earlier rounds tried Archivo, blackletters (Pirata One, Jacquard), letterpress (IM Fell) and more.

## 6. Layout

- One content column on every rebuilt page and the header: max width `--max` (1380px) with a 24px gutter (18px on
  phones). The header's medallion and keys sit on the content edges at every width, ultrawide included.
- Header (rebuilt 2026-10-06, option C): the bottom row of a keyboard. Medallion left; a black braided USB-C cable
  (patina-copper collars and plug, a coiled section) runs from behind it to the keys, its straight runs stretching
  with the window, the plug tucked under the first key; copper LED beads travel through it. Then four rendered
  dark keycaps (Crafted Art 1.75u, Trust the Process 2u, Built to Taste 1.75u, About 1.25u) and a Green Sand Enter
  key, "Commission" (aria-label "Request a Commission"). Legends are real text on the caps; the current page's key
  is pressed. Key data: `src/static/data/header-keys.json`, rendered by `build.js`. Renders and their tools:
  `mockups/keys/`. Coil hidden below 1180px, cable below 1000px; at 860px and below: medallion, Commission key and a
  menu icon, with the links as text in a panel. No Products menu at launch.
- Homepage (rebuilt 2026-10-06 from `mockups/home.html`): the 75% drawing in a frame lit faintly copper from below,
  "Forged by night." in Aboreto, the line beneath, the copper Enter key, two entry links (New to custom boards? Start
  here → Built to Taste; I know my spec → request page) and the build sheet beside them (rows from YF-001's `sheet` and
  `COMMISSION_TERMS` in content.js); four section keys (About: "The one who keeps the forge lit after dark."); the
  deep sound band; the ruled standards list; layouts drawn to scale from `LAYOUTS`; the closing line with the copper
  key and the Why Yoru link. Page keys are written as `<yf-key cap="c2.25" ...>` and rendered by build.js.
- Crafted Art (rebuilt 2026-10-06): intro, then each layout as a row drawn at one shared scale from `LAYOUTS`
  (name, status, `about` line); the 75% row links to the 75% page, which features YF-001 "Ember Study" large and
  lists the two future builds below, with honest "Customer build photo" frames.
- Built to Taste (rebuilt 2026-10-06): intro; guide topics as a ruled index (`STORIES.taste`, no numbers, "Explore
  comparison"); each opens the shared guide panel (also used by Trust the Process) with "Step 1–3" and honest media
  frames; the A/B comparison as two raised panels; the material library (`MATERIALS`) as a ruled list with each
  definition shown under the name instead of a hover tooltip.
- Trust the Process (rebuilt 2026-10-07): intro, then the four stages (`STORIES.process`) in one numbered column
  ("Stage 1–4", a real sequence), each opening the shared guide panel.
- Request a Commission (rebuilt 2026-10-06): status line with a verdigris dot, the H1 and intro on the canvas; the
  form on a raised Green Sand surface with inset Cast fields (Cinzel labels, Alegreya input text, Pewter chevrons);
  submit is the copper Enter keycap (`/assets/keys/c2.25*.webp`, legend as real text), the only copper key on the
  page. Budget options: Still deciding, $250–$400, $400–$600, $600+, Bring your own parts.
  Below the form: the six commission steps (`COMMISSION_STEPS`, each number on a small keycap), what every build
  includes (`COMMISSION_INCLUDED`) on the page's one deep band, and the pricing note.
- Homepage order: hero (75% drawing frame, headline, one copper button, two entry links, build sheet) → section
  keys (Crafted Art, Trust the Process, Built to Taste, About) → sound band → "What I refuse to rush" ruled list
  → layouts drawn to relative scale (75 / 65 / TKL) → closing statement → footer.
- Breakpoints in the new design: 860px (stack, menu), 680px (keys 2 × 2), 520px (keys 1 column).

## 7. Component roles

- **Keycap buttons:** primary = Raw Copper; plain = Green Sand. Thick bottom edge that shortens on hover/press.
- **Section keys:** Green Sand, 8px radius, widths from key units (2.25 / 2 / 2.75 / 1.75). Built to Taste has a
  copper top edge, not a copper fill.
- **Build sheet:** definition list with hairlines; serial and build name in the head; rows for layout, case, mount
  (with plain-English note), build window, starting budget, bring your own parts; status dot in Verdigris.
- **Sound band:** Deep band, waveform with Verdigris progress, disabled play button until recordings exist.
- **Layout drawings:** inline SVG generated from key-unit rows, all at one scale; only the available layout is
  filled; its Esc key is copper.
- **Media placeholders:** locked ratios 16:9 hero, 4:5 archive, 3:2 process, 1:1 detail. Honest captions.

## 8. Page architecture

Primary nav: Crafted Art · Trust the Process · Built to Taste · About · Request a Commission. Keyboards only at
launch; the Mice / Mouse Pads / Desk Mats / Wrist Rests / Accessories pages are hidden at launch.

Source pages live in `/src`: index, crafted-art, crafted-art-75, trust-the-process, built-to-taste, about,
products-keyboards (and the hidden product stubs), request-a-build, archive, why-yoru, journal, commission,
commission-yf-001.

## 9. Flash-of-wrong-color / cache rules

- Every page: `<meta name="theme-color" content="#151A1A">` and the `critical-yf-theme` inline style from
  `build.js` (Cast body and header, Bright text, Green Sand header CTA).
- Stylesheet version lives only in `build.js` (`config.stylesheetVersion`); bump it whenever `styles.css` changes.

## 10. Content architecture (Phase 2, still current)

- Content mode in `src/static/data/content.js`: `SITE_MODE` is `prelaunch` or `live`.
- Builds live only in the `BUILDS` array; statuses `placeholder`, `in-progress`, `built`, `available`.
- Build detail pages use `/commission.html?id=YF-###`.
- Sound references live in `SOUND_SAMPLES`; prelaunch audio is a 3-second silent MP3.
- Known data fix: `content.js` labels "Ember" as a sound; it is a build name.

## 11. History

- Before 2026-10-06 the site used **Yoru Nocturne**: cream `#F2EFE8` header and accent sections, near-black
  `#0C0E11` canvas, Cormorant Garamond + Manrope, paper and metal textures. Mike reopened the direction because it
  read as generic and AI-made. Critique scores: old homepage 19/36, redesign mockup 22/36 before the final round of
  fixes. Records are in `.impeccable/critique/`.
- `styles.css` still carries stacked historical blocks from many iterations; Phase 13 removes the dead ones.
