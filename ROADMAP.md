# Yoru Foundry — Site Roadmap

The working plan from now to launch. `AGENTS.md` holds the rules; this file holds the order of work.
Update the status column whenever a phase closes, and bump `CURRENT_PHASE` in `scripts/site_check.py` to match.

## How we work

- **Branch:** every change goes to `design-pass`. Nothing touches `main` until launch.
- **Writer:** Claude is the only AI writing to `design-pass`. Other assistants stay read-only, per `AGENTS.md`.
- **One item = one commit**, so anything can be reviewed or reverted on its own.
- **Before every push:** `node build.js`, `python3 scripts/site_check.py` (0 errors), and a headless-browser pass
  at phone / tablet / desktop for JS errors, broken files and sideways scrolling.
- **Mike approves:** all public copy, and final visual sign-off in the Cloudflare preview after a hard refresh.
  Claude asks and doesn't guess when copy or a visual call is needed.
- **Review gates:** finish a phase, Mike reviews the preview, then start the next phase.

## Next session: start here (handoff, 2026-10-06)

Mike has **reopened the visual direction**. Mike feels the site looks generic, "AI-made", with no flavor.
That overrides the "already approved / do not redesign" lines in `AGENTS.md` for this work, but only
through the steps below. Palette, fonts and label style are all open; the logo stays.

1. Plugins enabled in `.claude/settings.json`: Ponytail, `frontend-design` and Impeccable. Start with
   `/impeccable critique` on the homepage, then use `frontend-design` and Impeccable for the plan.
   Impeccable may ask to create `PRODUCT.md` / `DESIGN.md`; seed them from `YORU_SITE_MEMORY.md`.
2. Write a short design plan *before any code*: 4–6 named colors, typefaces and their roles, layout ideas
   with ASCII wireframes, and guiding principles. Ground it in keyboards: keycaps, switches, sound, the bench.
3. Check the plan against the AI tells the current site shows, and avoid each one unless there's a real reason:
   - cream `#F2EFE8` with a high-contrast serif display (Cormorant), and tinted near-blacks (`#111418`, `#0C0E11`)
   - spaced-out ALL-CAPS eyebrow labels above almost every heading
   - details joined with dots ("FEATURED COMMISSION • YF-001")
   - "→" appended to link text
   - 01 / 02 / 03 numbering on cards that aren't a sequence
   - every section a row of identical boxes (3, then 4, then 3 cards)
4. Show Mike the plan and get approval, then build on `design-pass`. Once Mike signs off, update
   `AGENTS.md` and `YORU_SITE_MEMORY.md` to the new direction.

**Direction approved (2026-10-06):** Mike approved the Verdigris direction in `mockups/home.html` (see
`DESIGN_PLAN.md`): Verdigris palette, no texture, Archivo + Source Serif 4, "Forged by night." headline. `AGENTS.md`
and `YORU_SITE_MEMORY.md` are rewritten to match. Build order: tokens and fonts, header, homepage, then the other pages.

**Earlier progress (2026-10-06):** Steps 1–3 are drafted in `DESIGN_PLAN.md` (critique, palette, type, wireframes,
AI-tell check). The plugins didn't load in that session, so the critique was done by hand from headless renders.
Next: Mike reviews the plan (step 4). No redesign code yet.

Reference sites received (Alexotos, Keycult, Angry Miao, Mode Designs); see `DESIGN_PLAN.md` section 7.
Still waiting on Mike: whether the palette must stay, and approval of the plan.

Known small issues (fix when touching these areas):
- The homepage hero placeholder caption overflows the right edge of its frame on desktop.
- The Crafted Art 75% card copy says "Our first focused layout"; the rules require first person ("my").
  Copy is Mike's call, so ask.

## Status

| Phase | Scope | Status |
|---|---|---|
| 1 | Codify build rules (`AGENTS.md`) | Done |
| 2 | Content as data (`content.js`, `SITE_MODE`) | Done |
| 3 | Tokenized CSS system | Done |
| 3.5 | Surface/texture system, footer normalization, first paint | **Paused** — redesign may replace the texture work |
| 4–5 | *Not defined in the repo; Mike to confirm what these were* | ? |
| 6 | Header: one header on every page | Planned |
| 7 | Homepage hero and message | Planned (needs Mike's copy) |
| 8 | Media and sound readiness | Planned |
| 9 | Footer redesign (four columns) | Planned |
| 10 | Commission form sends without `mailto:` | Planned (needs a decision) |
| 11 | Motion and reduced motion | Planned |
| 12 | Image and page weight | Planned — partly pulled forward |
| 13 | Cleanup: unused files, orphan pages, dead CSS | Planned |
| 14 | One cream section per page | Planned (needs a decision) |
| Launch | Checklist, then merge `design-pass` → `main` | — |

## Phase details

### 3.5 — finish (next up)
- Lock the texture decision. The homepage currently uses `metal027-color-luma-4k.webp` (Night) and
  `plaster-grey-04.webp` (Bone), left over from the diagnostic commits. Mike confirms these are the keepers.
- Delete the 7 texture files nothing references (~19 MB): `metal027-microtexture`, `metal027-roughness-4k`,
  `metal027-roughness`, `night-iron-beadblast`, `paper001-color`, `paper001-displacement`, `wallpaper002b-paper`.
- Shrink the two kept textures. They are 2.3 MB and 3.5 MB; the target is under 500 KB each, with no
  visible change. Pulled forward from Phase 12 because every homepage visit downloads them.
- Bump `CURRENT_PHASE` to the next phase.

### 6 — Header
- One header on every page; the site check already watches for header variants.
- Products menu behavior is settled: hover on desktop, tap on touch, and Escape / outside click close it.
- Check the mobile panel at 860px and below, the logo at 68px / 54px, and the CTA styling against `AGENTS.md`.

### 7 — Homepage hero
- The H1 must say what the business makes ("keyboards"). The site check enforces this.
- Mike writes or approves the headline. Keep the asymmetric layout, never a centered H1 with two CTAs.

### 8 — Media and sound
- Players and placeholders already lock aspect ratios (16:9 / 4:5 / 3:2 / 1:1).
- Add a video-loop slot for the hero. Nothing autoplays with sound (blocked on iPhone).
- Write a short "how to drop in real photos/audio" note so new content needs no code changes.

### 9 — Footer redesign
- Four columns, built on the already-unified footer. Mike starts this phase explicitly.
- Footer links go in the HTML itself. Right now Archive / Why Yoru / Journal are added by JavaScript.

### 10 — Commission form
- Replace `mailto:`, which fails when the visitor has no mail app set up.
- Recommended: a small Cloudflare Worker endpoint that emails Mike. It stays on the current host and
  needs no third-party form service. Alternatives: Formspree, Basin.
- Add spam protection (Cloudflare Turnstile), success/error states, and a no-JS fallback.

### 11 — Motion
- Audit transitions against the 180–220ms spec and the canonical easing.
- Make sure `prefers-reduced-motion` turns off nonessential motion everywhere.

### 12 — Images and weight
- Any remaining PNGs become WebP/AVIF, with no image over 500 KB.
- Add `loading="lazy"` and intrinsic sizes everywhere, and measure homepage transfer size before and after.

### 13 — Cleanup
- Delete the 6 unused files in `assets/` (only `yoru-foundry-logo-v5.webp` is referenced).
- Orphan pages: link `archive.html` / `journal.html` from the HTML, or remove them (Mike decides).
- `styles.css` is ~170 KB and still carries stacked historical "lock" blocks with `!important`. Remove the
  dead ones in small commits, with before/after screenshots at three widths per commit.

### 14 — Cream rule
- Normalize each page to the agreed number of Bone sections.
- **Conflict to settle first:** `AGENTS.md` says *at most one* cream section per page, but the site check
  requires *exactly one*. Six pages currently have none and several have more than one.

### Launch checklist
- `404.html` plus `"not_found_handling": "404-page"` in `wrangler.jsonc`.
- `robots.txt`, `sitemap.xml`, `og:image` on every page, and meta descriptions (missing on `commission-yf-001`).
- Real social links, `SITE_MODE: "live"` in `build.js`, and real builds replacing placeholders.
- Confirm Cloudflare's **production** build command is `node build.js` (`main` currently deploys with no build step).
- Merge `design-pass` into `main` (fast-forward), then check the live site at three widths.

## Open decisions for Mike

1. What were Phases 4 and 5? Are they done, or still to do?
2. Are the current homepage textures the final choice?
3. Cream rule: exactly one per page, or at most one?
4. Form backend: Cloudflare Worker (recommended) or a form service?
5. Archive and Journal: keep and link them, or remove them?
6. The Mice / Mouse Pads / Desk Mats / Wrist Rests / Accessories pages are stubs. Keep them for launch, or hide them?
