# Yoru Foundry Website — Design System / Memory Bank

This file is the **source of truth** for any future ChatGPT Work / coding session on the Yoru Foundry website.

Do not redesign the site from scratch unless explicitly requested. Preserve the current visual direction and use this document to avoid asking for already-decided brand, palette, sizing, and styling choices.

## 1. Brand

- Brand: **Yoru Foundry**
- Tagline / motto: **Refined by Craft.**
- EST. 2026
- "Yoru" means night.
- Positioning: boutique, one-builder, high-end custom keyboard / crafted-object atelier.
- Feel: luxury, precision, craftsmanship, quiet night studio, hand-built, technical but human.
- Avoid: gaming-RGB aesthetic, SaaS UI, generic ecommerce, industrial grunge, rustic maker look, black-and-gold cliché.

## 2. Official Logo

Use only:

`/assets/yoru-foundry-logo-v5.webp`

This is the approved copper / patina circular medallion.

Do not replace it with older logo assets in `/public/assets`.

Header treatment:
- transparent image presentation
- no external shadow / halo / fake border
- circular crop only when needed to hide raster corners
- desktop target size: about **68px × 68px**
- mobile target size: about **54px × 54px**

## 3. Canonical Color Palette — Yoru Nocturne

These are the approved colors. Do not introduce ad-hoc browns, golds, olives, rust colors, bright greens, or previous palette colors.

| Token | Name | Hex | Role |
|---|---|---|---|
| `--night-void` | Night Void | `#0C0E11` | Body, page canvas, footer |
| `--night-deep` | Deep Night | `#111418` | Alternate dark sections |
| `--night` | Night Iron | `#181B1F` | Elevated dark sections, header pairing, theme color |
| `--gunmetal` | Gunmetal | `#2B2F32` | Product cards, media, technical panels |
| `--iron` | Iron | `#3A3F43` | Dark-card hover and active states |
| `--bone` / `--bone-text` | Forged Bone | `#F2EFE8` | Sole light surface / primary dark-surface text |
| `--ink` | Ink | `#171A1D` | Text on Bone; not a surface tier |
| `--muted-dark` | Muted on dark | `#B8B9B5` | Secondary text on night surfaces |
| `--muted-light` | Muted on light | `#6D6962` | Secondary text on Bone |
| `--muted-deep` | Tertiary on Night Iron | `#8A8C88` | Night Iron only; never cards |
| `--copper` | Burnished Copper | `#B8734F` | Night-only borders, fills, and large/bold text |
| `--copper-text` | Copper Text | `#CB9560` | Body-size copper on night and Gunmetal |
| `--copper-deep` | Copper Deep | `#915A37` | Copper on Bone only |
| `--patina` | Patina | `#6E938B` | Available/open status on night |
| `--patina-deep` | Patina Deep | `#4E6A64` | Patina on Bone only |
| `--state-error` | Error | `#C96A5A` | Error state on night |
| `--state-error-deep` | Error Deep | `#A34430` | Error state on Bone |

### Color usage rules

- Night tiers should dominate the overall page; section rhythm comes from alternating those tiers.
- Forged Bone is a rare accent, not a surface family. Use no more than one light section per page.
- Gunmetal separates product/media objects from Night Iron.
- Copper is **not** a generic ecommerce orange. Use it sparingly for borders, active states, selected states, links, and CTA interaction.
- Patina is a **brand accent, used sparingly**. Use it for available/open states and small night-surface details.
- Never use Patina as a large background, large button fill, layout-card tint, or general "available" color.
- No legacy brown / bronze / gold / olive / rust palette is approved.

## 4. Texture System

Texture should add physicality without visibly shifting the base colors.

### Forged Bone
- Material reference: archival paper / premium uncoated stock.
- Very fine grain only.
- Approx. visible strength: **2–4%**.
- Do not let blending darken it into taupe / gray.

### Night Iron
- Material reference: bead-blasted / anodized aluminum.
- Fine micro-grain with very subtle satin variation.
- Approx. visible strength: **3–6%**.
- No concrete, stone, scratches, grunge, or obvious noise.

### Gunmetal
- Matte machined metal.
- Same material family as Night Iron, but smoother and lower contrast.
- Approx. visible strength: **2–4%**.
- Product / photography placeholders should remain visually quiet.

### Copper
- Smooth satin finish only.
- No grain.
- No rough copper texture, rust, or patina wash.

### Patina
- Color-only micro accent.
- No texture treatment.
- Never use as a large material field.

## 5. Typography

Google Fonts:
- Display / headings / navigation: **Cormorant Garamond**
- Body / UI: **Manrope**

General:
- Large editorial serif headings.
- Body text should be compact and readable.
- Avoid generic bold sans-serif SaaS presentation.

Current main page-hero sizing:
- H1: `clamp(62px, 8vw, 102px)`
- intro copy: roughly `clamp(21px, 2.3vw, 28px)`
- page hero max width: about **940px**
- narrow hero max width: about **820px**

## 6. Global Layout / Dimensions

- Main max content width: **1380px**
- Typical desktop side padding: **24px** at content level.
- Large responsive header uses wider clamp-based padding.
- Main page bottom padding: about **100px**.
- Default card radius: **16–18px**.
- Layout-card gap: about **18px**.
- Portal-card gap: about **16px**.

### Header
- Sticky at top.
- Forged Bone material.
- Light architectural divider at bottom.
- Desktop logo: ~68px.
- Header CTA: Night Iron fill, Burnished Copper 1px border, Forged Bone text.
- Nav: Cormorant Garamond.
- No dark/brown nav strip inside the light header.
- Header must be visually consistent on every page.

### Mobile
Primary mobile breakpoint: **860px**.
- header target height: ~82px
- logo target: ~54px
- mobile nav becomes a single-column Forged Bone panel.

Other existing responsive breakpoints used in the codebase include:
`1180, 1120, 1040, 1000, 980, 900, 860, 680, 640px`.

## 7. Component Roles

### Product / Portfolio cards
Used by Crafted Art and Products:
- entire card = Gunmetal
- no brown lower half
- Forged Bone title
- Warm Steel secondary copy
- Burnished Copper for active/open state
- Coming Soon should be muted by opacity/content, not a different brown/green card color

### Editorial / educational cards
Examples: Trust the Process, Built to Taste education, Why Yoru / journal cards:
- Forged Bone paper surface
- Night Ink text
- tiny Patina micro-labels allowed

### Dark structural cards
Examples: Yoru Standard / commission flow:
- Gunmetal card on Night Iron canvas
- Forged Bone heading
- Warm Steel supporting text

### Media placeholders
- Gunmetal
- quiet / matte
- real photography will supply the major color later

### Forms
- Forged Bone outer card
- Soft Bone fields
- Night Ink text
- Copper focus border
- no bright white form flash

## 8. Buttons

### Header — Request a Commission
- Night Iron body
- 1px Burnished Copper border
- Forged Bone text
- ~3px radius
- restrained hover: slight Gunmetal lift + Copper highlight
- no pale-gray generic button
- no solid orange rectangle
- no white click/transition flash

### Dark hero primary CTA
- transparent / hollow Copper outline
- Forged Bone text
- fills with Copper on hover
- should harmonize with header CTA

## 9. Navigation / Page Architecture

Primary nav:
- Crafted Art
- Trust the Process
- Built to Taste
- About
- Products
- Request a Commission

Current pages:
- `/index.html`
- `/crafted-art.html`
- `/crafted-art-75.html`
- `/trust-the-process.html`
- `/built-to-taste.html`
- `/about.html`
- `/products-keyboards.html`
- `/products-mice.html`
- `/products-mousepads.html`
- `/products-deskmats.html`
- `/products-wristrests.html`
- `/products-accessories.html`
- `/request-a-build.html`
- `/archive.html`
- `/why-yoru.html`
- `/journal.html`
- `/commission-yf-001.html`

## 10. Flash-of-Wrong-Color / Cache Rules

This is important.

Every HTML page must contain:
- `<meta name="theme-color" content="#181B1F">`
- the `critical-yf-theme` inline style establishing Night Iron body and Forged Bone header before the external CSS paints
- the same versioned stylesheet URL

Current stylesheet URL:
`/styles.css?v=yn-design-p3-3`

**Whenever styles.css changes, bump the query-string version on every HTML page.**
This prevents browsers / Cloudflare from briefly showing a previously cached palette.

Critical first-paint colors:
- HTML / body: `#181B1F`
- header: `#F2EFE8`
- nav text: `#171A1D`
- nav CTA: Night Iron + Copper border + Forged Bone text

## 11. Palette Audit Rule

As of 2026-09-14, the stylesheet was sanitized so legacy color declarations are constrained to the approved Yoru Nocturne family.

Approved concrete CSS color family is limited to:
- `#181B1F`
- `#111418`
- `#F2EFE8`
- `#F8F5EF`
- `#2B2F32`
- `#34393D`
- `#272C30`
- `#B8734F`
- `#C88967`
- `#94573D`
- `#4E6A64`
- `#9A9B97`
- `#6D6962`
- `#171A1D`
- `#D7D3CB`
- `#B8B9B5`
- `#E7E1D7`

Do not reintroduce old experimental palette literals.

## 12. Codebase Rule for Future Work

The current `styles.css` contains historical structural rules from many design iterations. Colors are sanitized, but future cleanup should:
1. preserve the current visual appearance,
2. consolidate duplicate selectors,
3. move canonical tokens to one design-token section,
4. remove dead experimental blocks,
5. never append another competing palette experiment.

For large refactors, compare the live site before and after at desktop/tablet/mobile widths.

## 13. Visual North Star

Yoru Foundry should feel like:

**an editorial gallery for a precision-made physical object**

Material metaphor:
- Night Iron = night / studio / anodized case
- Forged Bone = paper / documentation / atelier
- Gunmetal = machined hardware
- Copper = heat / foundry / craft
- Patina = age / material transformation / signature detail

The UI should remain restrained so finished keyboards, materials, photography, and sound content become the artwork.


## 14. Phase 2 Content Architecture

- Content mode lives in `public/data/content.js`.
- Single launch switch: `const SITE_MODE = "prelaunch";`.
- Allowed values: `prelaunch` and `live`.
- Hero eyebrow, primary hero CTA, hero status, footer status, and archive filtering read from this mode.
- Build/archive content lives only in the `BUILDS` array.
- Build statuses: `placeholder`, `in-progress`, `built`, `available`.
- In prelaunch, placeholder records render; in live, placeholder records are filtered out.
- Build detail pages use `/commission.html?id=YF-###`; adding a build does not require a new HTML page.
- Sound references live in `SOUND_SAMPLES`.
- Prelaunch audio uses `/audio/silence-3s.mp3`, a real three-second silent MP3.
- Locked media ratios: hero **16:9**; archive **4:5**; process **3:2**; detail macros **1:1**.
- Placeholder media under `/public/img/` matches those exact ratios.
- Placeholder specs use production-length values to test wrapping before launch.
- Phase 2 versions: stylesheet `/styles.css?v=yn-design-p3-1`; content `/data/content.js?v=phase2-1`; runtime `/script.js?v=phase2-1`.


## 15. Phase 3 Tokenized CSS System

- `public/styles.css` now has a single consolidated `:root` token catalog.
- Required semantic tokens:
  - `--canvas`: Night Iron
  - `--surface`: Gunmetal
  - `--ink`: Night Ink
  - `--muted-on-light`: accessible muted body/metadata tone on light surfaces
  - `--muted-on-dark`: accessible muted body/metadata tone on dark surfaces
  - `--accent`: Burnished Copper
- Font tokens:
  - `--font-display`: Cormorant Garamond
  - `--font-body`: Manrope
  - `--font-mono`: system monospace stack
- Type scale primitives:
  - `--step-1` through `--step-5`
- Motion:
  - `--duration-fast`, `--duration-base`, `--duration-slow`
  - `--ease: cubic-bezier(0.16, 1, 0.3, 1)`
  - reduced-motion duration token `--duration-none`
- Every hardcoded color outside `:root` was replaced with a color token.
- Font sizes, font-family declarations, spacing declarations, radii, and transition durations are token-driven.
- Box shadows are disabled globally and historic shadow declarations were neutralized.
- Standard border width is `--border-width: 0.5px`.
- General line colors are deliberately low contrast; high-opacity legacy borders were capped.
- Images and card-like surfaces use square corners.
- Buttons and form controls use a 4px control radius.
- Circular micro-controls such as status dots and info tips retain a circle token.
- Current Phase 3 stylesheet version: `/styles.css?v=yn-design-p3-3`.
