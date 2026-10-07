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

## Status

| Phase | Scope | Status |
|---|---|---|
| 1 | Codify build rules (`AGENTS.md`) | Done |
| 2 | Content as data (`content.js`, `SITE_MODE`) | Done |
| 3 | Tokenized CSS system | Done |
| 3.5 | Surface/texture system, footer normalization, first paint | Done: no texture (Mike), one footer on all 17 pages (measured identical: 245px desktop, 410px phone), Cast first paint |
| 4 | Type scale (section tier, `clamp()` on display) | Done in the redesign: Aboreto / Cinzel / Alegreya, fluid display sizes |
| 5 | Button system | Done in the redesign: keycap buttons, the rendered Enter key, section keys |
| 6 | Header: one header on every page | Done: keyboard-row header with the LED cable (2026-10-06) |
| 7 | Homepage hero and message | Done: rebuilt from `mockups/home.html` (2026-10-06); "keyboards" lives in the title and meta description |
| — | Inner pages in Verdigris | Done (2026-10-07): request, Crafted Art + 75%, Built to Taste, Trust the Process, Why Yoru, About, Journal, Archive, build records. Still old: the five hidden product stub pages |
| 8 | Media and sound readiness | Done (2026-10-07): every media spot takes a real file with no layout change; see `MEDIA.md`. Waiting on Mike's media |
| 9 | Footer redesign (four columns) | Planned |
| 10 | Commission form sends without `mailto:` | Done (2026-10-07): Worker at `/api/commission` sends through Resend to hello@ (Zoho); test request delivered to the inbox. Trap field on; Turnstile ready but off (README) |
| 11 | Motion and reduced motion | Planned |
| 12 | Image and page weight | Planned — partly pulled forward |
| 13 | Cleanup: unused files, orphan pages, dead CSS | Planned |
| 14 | One cream section per page | Retired: Verdigris has no light sections (Mike, 2026-10-06) |
| Launch | Checklist, then merge `design-pass` → `main` | — |

## Phase details

### 3.5 — done
- Texture: none (Mike, 2026-10-06); the texture files are deleted.
- Footer: every page uses the one `standard` footer; its size is identical on all 17 pages. The size jumps Mike saw
  are on the old production site and go away at launch.

### 6 — Header (done)
- The bottom row of a keyboard: rendered keycaps for the links and the Enter key for the commission, a braided USB-C
  cable with an LED from the medallion to the keys. See `YORU_SITE_MEMORY.md` and `mockups/keys/`.

### 7 — Homepage hero
- The H1 must say what the business makes ("keyboards"). The site check enforces this.
- Mike writes or approves the headline. Keep the asymmetric layout, never a centered H1 with two CTAs.

### 8 — Media and sound
- Homepage sound band: four sample slots from `SOUND_SAMPLES`; iOS-safe audio (tap to play, never autoplay with sound).
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
- Confirm hello@yorufoundry.com actually receives mail (Cloudflare Email Routing).
- One name everywhere: the nav says "Request a Commission" but the file is `request-a-build.html` and README says
  "Request a Build". If the file is renamed, redirect the old URL.

### 11 — Motion
- Audit transitions against the 180–220ms spec and the canonical easing.
- Make sure `prefers-reduced-motion` turns off nonessential motion everywhere.

### 12 — Images and weight
- Any remaining PNGs become WebP/AVIF, with no image over 500 KB.
- Add `loading="lazy"` and intrinsic sizes everywhere, and measure homepage transfer size before and after.

### 13 — Cleanup and report
- Report what was skipped, what breaks at 10+ builds, and anything in the repo that shouldn't be public
  (stray files or partials in `/public`, unused CSS selectors).
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
- **The real gate:** real photography, video and audio in every media block.
- Alt text on every image; submit the sitemap to Google Search Console; Cloudflare Web Analytics.
- A privacy policy (the form collects names and emails) and a commission policy (deposit, lead time, revisions,
  shipping, returns). Copy is Mike's.

## Open decisions for Mike

1. ~~Phases 4 and 5~~ Type scale and button system (from Mike's earlier plan); both done in the redesign.
2. ~~Homepage textures~~ Answered: no texture (Mike, 2026-10-06).
3. ~~Cream rule~~ Retired with the Verdigris direction.
4. Form backend: Cloudflare Worker (recommended) or a form service?
5. ~~Archive and Journal~~ Kept and rebuilt (2026-10-07); Phase 9 puts their footer links into the HTML.
6. The Mice / Mouse Pads / Desk Mats / Wrist Rests / Accessories pages are stubs. Keep them for launch, or hide them?

## From the earlier plan (Sept 17), and where each item stands

- **Done:** footer variants collapsed into one; theme-color and first-paint theme on the new tokens; the stretched
  filler tier (inner pages painted `--night` above a Cast footer; now Cast everywhere, 2026-10-07); type scale and
  buttons (Phases 4–5); header and hero (rebuilt to Mike's newer choices: the medallion stays, the keyboard-row
  header, "keyboards" in the title, the hero keeps its frame).
- **Retired by the Verdigris direction:** grain opacity tests, site-wide grain, cream sections and the cream rule,
  portal card hairlines, the surface flip.
- **Excluded by the motion rules in `AGENTS.md`:** Lenis smooth scrolling, scroll reveals and a sticky hero
  (scroll-jacking and decorative motion). Hover crossfades are fine. Mike can reverse this.
- **Still open:** material library swatches and status colors (fold into Phase 8 when real media arrives).
