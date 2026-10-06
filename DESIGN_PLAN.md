# Yoru Foundry — Redesign Plan (draft for Mike's approval)

Status: **proposal, no code yet.** This follows steps 1–3 of the handoff in `ROADMAP.md`.
Nothing here changes `AGENTS.md` or `YORU_SITE_MEMORY.md` until Mike signs off (step 4).

## 1. Critique of the current homepage

Taken from `node build.js` output, rendered headless at 1440 / 820 / 390px (no JS errors, no sideways scroll).

What works and stays:
- The logo, the first-person voice, the honest placeholders and locked media ratios.
- The asymmetric hero and the commission-first posture (no cart, no urgency).

Why it reads as "AI-made":
- **It has no subject.** Nothing on the page is specific to keyboards. Swap the words and it could sell
  candles, watches or a law firm. The keyboard itself (keycaps, switches, plate, sound) never shapes the design.
- **Every AI tell the roadmap lists shows up**, some of them several times:
  | Tell | Where on the homepage |
  |---|---|
  | Cream `#F2EFE8` + Cormorant serif display, tinted near-blacks | header, featured commission, Why Yoru; body `#0C0E11` / `#181B1F` |
  | Spaced ALL-CAPS eyebrows over headings | YORU FOUNDRY / EST. 2026, THE YORU STANDARD, START WITH THE FOUNDATION, WHY YORU, FEATURED COMMISSION |
  | Details joined with dots | "FEATURED COMMISSION • YF-001", hero micro row |
  | "→" on link text | "View Commission YF-001 →", "Why work with Yoru Foundry →" |
  | 01/02/03 on non-sequences | portal cards, Yoru Standard cards |
  | Rows of identical boxes | 3 portal cards → 4 standard cards → 3 layout cards |
- **Five sections, one rhythm.** Each section is a heading, then a grid of the same boxes. The eye gets no change of pace.
- **Detail problems:**
  - The hero caption overflows the right edge of its frame on desktop and phone (known issue, confirmed).
  - Portal card body text on cream is too faint to read comfortably.
  - The layout picker shows "75% / 65% / TKL" as type only, when the real difference is physical size.
  - Sound gets one word, though sound is half of why people commission a custom board.

### 1b. Impeccable critique (scored)

`/impeccable critique` on `src/index.html`: **19/36, Acceptable**. Heuristic 9 is n/a because the page has
no inputs. The full report is in `.impeccable/critique/`. It agrees with the manual critique above and adds:

- **[P0] Unreadable text on Bone.** A night-only grey (`--muted-dark`) is used on the cream surface:
  - portal card descriptions and the featured-commission spec labels: 1.72:1;
  - mega-menu column labels: 1.72:1 at 9px;
  - mega-menu copper links: about 3.25:1.

  This is a live bug, worth fixing now on the current design whatever the redesign decides.
- **[P1] "Keyboard" first appears about 92% of the way down the page.** The `<title>` and meta description
  don't say it either.
- **[P1] No reassurance at the commission decision.** Nowhere near either CTA mentions lead time
  (2–5 weeks), budget, "consultation first" or bring-your-own-parts. Two equal-weight CTAs compete, plus a
  third in the nav.
- **[P2] Navigation shows scope that isn't offered.** Products lists 5 categories that are hidden at
  launch, and the "Coming Soon" 65% / TKL items link to the request form.
- **[P2] Mobile controls:**
  - the menu button is 33×30px, under the 44px minimum;
  - Escape doesn't close the mobile menu;
  - the button's label stays "Open menu" while the menu is open;
  - at 390px, the hero meta row wraps with an orphan bullet;
  - at 820px, the portal cards leave an orphan third card.
- **Text size.** Micro labels throughout are 9–10px.
- **Detector false positives:**
  - the grain textures (flagged as "stripes");
  - padding on full-bleed shells;
  - one contrast hit on the dark placeholder.

What this changes in the plan:
- **Hero:** one primary CTA. Next to it, a short build-sheet strip with lead time, starting budget,
  "consultation first" and "bring your own parts welcome". This needs Mike's copy and numbers.
- **Nav:** drop the Products mega menu for launch. Four plain links plus the commission keycap.
- **Two entry paths:**
  - "New to custom boards? Start here" leads to Built to Taste.
  - "I know my spec" leads to the request form, with a bring-your-own-parts option.
- **Text floor:** no text under 12px. Every text color states its legal surface, as `AGENTS.md` already requires.

## 2. Direction: "The Bench"

The site should feel like Mike's bench at night: a bead-blasted aluminum case, a steel plate, one
colored keycap, a build sheet next to it, and the sound test. Every visual choice should trace back to
one of those objects. If it can't, it goes.

### Guiding principles

1. **The keyboard is the grid.** Layout widths come from key units (1u, 1.5u, 2.25u, 6.25u). That
   gives real asymmetry with a reason, not boxes of the same width.
2. **One colored key.** A board usually has one accent keycap (the Esc). The site uses Copper the same way:
   one signal per view, for the thing you can act on. Never a fill for decoration.
3. **Things press, they don't float.** Controls behave like a switch: about 1px of travel, a firmer bottom
   edge that shortens when pressed, 180–220ms. No hover lift-and-glow.
4. **Spec sheets, not taglines.** Facts (layout, case, mount, switch, plate, sound) are set as a build
   sheet in aligned columns, not as dot-joined strings or eyebrow labels.
5. **Sound is a first-class medium.** Each build gets a sound slot next to its photo, the way the
   community actually judges a board. Honest placeholder until real recordings exist.
6. **Written like a note from the bench.** Body text is a readable serif that carries Mike's first-person
   voice. The display type is the engineered part.

## 3. Color: five named colors

Neutral, metal-led, no cream, no near-black void. All contrast values are measured (WCAG 2.x).

| Name | Hex | Object | Role |
|---|---|---|---|
| **Bead-blast** | `#C9CAC6` | aluminum case finish | main page canvas (light, cool grey) |
| **Graphite** | `#232527` | anodized dark case | text on Bead-blast; dark bands (header, sound strip, footer) |
| **Plate** | `#4A4E4F` | steel plate | secondary text, rules and hairlines |
| **Legend** | `#ECEDE9` | printed keycap legend | text on Graphite; the raised "keycap" surface |
| **Copper** | `#B8734F` | from the logo, the one accent key | the single action/active signal |
| *Patina* | `#6E938B` | from the logo | status dot only (open / in progress), on Graphite |

Measured contrast:
- Graphite on Bead-blast: 9.34
- Plate on Bead-blast: 5.11
- Plate on Legend: 7.16
- Legend on Graphite: 13.08
- Copper on Graphite: 4.10 (OK for large text and UI parts, not body text)
- Patina on Graphite: 4.55

Rules:
- Copper is never text on Bead-blast (2.27). On light surfaces it appears only as a fill or underline, with Graphite text.
- No brown, bronze, gold, olive or green fields, so the `AGENTS.md` palette ban still holds.
- The page is mostly light, with Graphite bands for rhythm. This flips the current dark-first site.
  **If Mike decides the palette must stay**, sections 2, 4 and 5 still apply and these roles map onto
  the Nocturne tokens one-for-one.

## 4. Type: two families

| Family | Role | Why |
|---|---|---|
| **Archivo** (variable, width axis; Semi-Expanded / Expanded, 600–800) | display, nav, labels, spec values, buttons | Reads like engraved case badges and keycap legends; the width axis gives emphasis without decorative weight |
| **Source Serif 4** (variable, optical size) | body copy, long-form, captions | A letter-like voice for first-person writing; optical sizes keep small text sturdy |

- Labels use sentence case at normal tracking. No all-caps eyebrows.
- Spec numbers use Archivo with tabular figures, so build sheets line up without a monospace font.
- Removes Cormorant Garamond and Manrope. Avoids the current AI defaults: Inter, Space Grotesk, Instrument Serif, DM Sans, Bricolage.

## 5. Layout

### Homepage, desktop (≥ 1040px)

```
┌─ Graphite header ────────────────────────────────────────────────────────────┐
│ (logo)  Crafted Art   Process   Built to Taste   About   Products   [Commission]│ ← CTA is a "keycap"
└──────────────────────────────────────────────────────────────────────────────┘
  Bead-blast canvas
  ┌──────────────────────────────────────────────┐ ┌───────────────────────┐
  │                                              │ │ Build sheet  YF-001   │
  │           HERO BUILD PHOTO / LOOP (16:9)     │ │ Layout ........ 75%   │
  │                                              │ │ Case ..... Aluminum   │
  └──────────────────────────────────────────────┘ │ Mount ....... Gasket  │
  H1 (must say "keyboards" — Mike's words)         │ Sound ......... Ember │
  short serif intro, one line                      │ [▶ hear it]  ───────  │
  [Request a commission]   See finished work       └───────────────────────┘
  ─────────────────────────────────────────────────────────────────────────
  Key-unit row: three links sized like keys, not three identical cards
  ┌────────────────────────┬──────────────┬───────────────────────────────┐
  │ Crafted Art   (2.25u)  │ Process (1.5u)│ Built to Taste       (2.75u) │
  └────────────────────────┴──────────────┴───────────────────────────────┘
  ═══ Graphite band: THE SOUND STRIP ══════════════════════════════════════
   ▁▃▅▇▅▃▂▁▂▄▆▄▂▁  waveform placeholder · per-build sound test · play button
  ══════════════════════════════════════════════════════════════════════════
  What I refuse to rush            Intent before parts — one sentence
  (heading, left column)           ─────────────────────────────────
                                   Visible process — one sentence
                                   ─────────────────────────────────
                                   Curated, not crowded — …
                                   Built to keep — …
  ─────────────────────────────────────────────────────────────────────────
  Choose a layout  (outlines drawn to real relative scale)
  ┌───────────────────────┐  ┌────────────────────┐  ┌────────────────────────────┐
  │ ▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢ 75%  │  │ ▢▢▢▢▢▢▢▢▢▢▢▢▢▢ 65% │  │ ▢▢▢▢▢▢▢▢▢▢▢▢▢▢ ▢▢▢ TKL      │
  │ Available now         │  │ Later              │  │ Later                      │
  └───────────────────────┘  └────────────────────┘  └────────────────────────────┘
  ─────────────────────────────────────────────────────────────────────────
  One builder. (Why Yoru)  — text-led, serif, a signature, a plain link
┌─ Graphite footer ────────────────────────────────────────────────────────────┐
```

### Homepage, phone (≤ 860px)

```
┌ Graphite header: logo ·· [Commission] [≡] ┐
│ HERO PHOTO (16:9, full bleed)              │
│ H1                                         │
│ intro                                      │
│ [Request a commission]                     │
│ Build sheet (rows, full width)             │
│ [▶ hear it]                                │
│ Crafted Art ─────────────────────── (row)  │
│ Process ─────────────────────────── (row)  │
│ Built to Taste ──────────────────── (row)  │
│ ▓ Sound strip (horizontal waveform) ▓      │
│ Standards as a ruled list                  │
│ Layout outlines stacked, still to scale    │
│ Why Yoru                                   │
└ footer ────────────────────────────────────┘
```

### Signature components

- **Keycap button.** 4px radius, Legend face, a 2px Graphite bottom edge that shrinks to 1px with
  `translateY(1px)` on press. Primary = the Copper key. No shadows, no gradients.
- **Build sheet.** A two-column definition list with Plate hairlines and tabular figures. Replaces the
  dot-joined meta strings and eyebrow labels.
- **Layout outlines.** Inline SVG key grids for 75 / 65 / TKL at true relative width. Data-driven from
  `content.js`, so new sizes need no markup.
- **Sound slot.** Waveform placeholder + play control, using the existing `SOUND_SAMPLES` shape.
- **Texture.** At most one: a fine bead-blast grain on the canvas. The 2.3 MB and 3.5 MB textures are
  replaced by a few-KB tile or dropped, which also covers part of Phase 12.

## 6. AI-tell check

| Tell | Plan |
|---|---|
| Cream + high-contrast serif, tinted near-blacks | Gone: cool Bead-blast and Graphite, grotesque display, serif for body only |
| Spaced ALL-CAPS eyebrows | Gone: sentence-case labels, only where they carry information |
| Dot-joined details | Gone: build sheet rows |
| "→" on links | Gone: underline in Copper and the keycap press state |
| 01/02/03 on non-sequences | Gone. Numbers only for real sequences (the commission process steps) |
| Rows of identical boxes | Gone: key-unit widths, ruled lists, scaled outlines, one full-bleed sound band |

## 7. Reference check

Mike's references: [Alexotos build service](https://www.alexotos.com/keyboard-build-service/),
[Keycult](https://keycult.com/), [Angry Miao](https://www.angrymiao.com/en/?p=0),
[Mode Designs](https://modedesigns.com/).

**Caveat:** this session's network policy blocks all four domains, so I couldn't load or screenshot them.
The notes below come from my prior knowledge of these sites and may be out of date. Recheck once the
domains are allowed or Mike sends screenshots.

| Site | What it does well | What Yoru takes | What Yoru leaves |
|---|---|---|---|
| Keycult | Almost no UI. Studio photos of metal cases on plain neutral grounds; the object is the only color. Catalog-style names ("No. 2/TKL"). | A quiet neutral canvas so finishes carry the color (supports Bead-blast). Build serials (`YF-001`) used as real names, in the build sheet and page titles. | Drop-and-raffle scarcity. |
| Mode Designs | Big, color-rich product photos. Each board is a system you configure (layout → case → mount → options). Light, open pages. | The layout outlines lead into the commission like a configurator: layout first, then case, mount, switches. That path matches `request-a-build`. | The full shop flow and cart (banned by `AGENTS.md`). |
| Angry Miao | Cinematic, dark, video-first moments. Industrial-design storytelling with large type. | One full-bleed Graphite moment per page (the hero loop or sound strip) to give the page a change of pace. | Scroll-driven animation and sci-fi gloss (break the motion rules and the quiet-workshop tone). |
| Alexotos (build service) | A person, not a brand. Sound tests are the proof. It says plainly what the service includes and how the queue works. | Sound slot on every build. A plain "what I do to every board" list (lube, tune, film, test). Honest queue status ("2 commission slots open"), never a countdown. | Video-platform layout and embed-heavy pages. |

What changes in the plan:
- **Confirmed:** light neutral canvas, build sheet, sound as proof, layout-first path. All four sites put
  the object or its sound first and keep the UI quiet.
- **Added:** a "what every build gets" list and an honest queue line, after Alexotos. Both need Mike's
  copy and real numbers.
- **Added:** placeholders must look deliberate, since these sites are carried by photography that Yoru
  doesn't have yet. Placeholder frames show the build serial and the locked ratio in Archivo, on a
  Graphite field, with no fake image.
- **Unchanged:** no shop UI, no scroll animation.

## 8. Rollout (after approval)

One commit per item on `design-pass`:
1. Tokens and fonts (new `:root`, first-paint values, `stylesheetVersion` bump).
2. Header and the keycap button.
3. Homepage hero and build sheet (needs Mike's H1, which must include "keyboards").
4. Key-unit row, sound strip, standards list, layout outlines.
5. Remaining pages, then texture cleanup.
6. Rewrite `AGENTS.md` / `YORU_SITE_MEMORY.md` and the site-check palette rules to the new direction.

Each step: `node build.js`, `python3 scripts/site_check.py` (0 errors), and a headless pass at 390 / 820 / 1440.

## 9. Decisions needed from Mike

**Keep (Mike, 2026-10-06):** the site's sections stay: Crafted Art, Trust the Process, Built to Taste,
About ("who I am"), and the commission request. The redesign changes how they look and how the
homepage leads into them, not what they are.

1. Approve the direction, or tell me what to change.
2. ~~Does the Nocturne palette have to stay?~~ **Answered:** no. Everything visual is open; the palette came from AI research, not a hard requirement.
3. Reference sites: received (section 7). To check them against the live sites, allow the four domains in this environment's network settings or send screenshots.
4. Copy and real numbers for the "what every build gets" list, the queue line, and the hero strip (lead time, starting budget, bring-your-own-parts).
5. ~~Fix the P0 Bone contrast bug now?~~ **Done** in its own commit (1.72:1 → 4.75:1).
6. Hero H1 wording. It must say "keyboards."
7. The light-led canvas flips the critical first-paint colors in `AGENTS.md` (body, header). OK to change those rules?
