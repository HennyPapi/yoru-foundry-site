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
| 9 | Footer redesign | Done (2026-10-07): a rendered 75% keyboard (Mike's concept). Links spelled on the keys press as a word, copper underglow rises on view, Esc = logo, home. Phone: picture plus link list. Links are in the HTML |
| 10 | Commission form sends without `mailto:` | Done (2026-10-07): Worker at `/api/commission` sends through Resend to hello@ (Zoho); test request delivered to the inbox. Trap field on; Turnstile ready but off (README) |
| 11 | Motion and reduced motion | Done (2026-10-07): every duration tokenized; interactions 180–220ms on `--ease`; long light fades on `--ease-glow`; one global reduced-motion rule plus each JS effect checks it (tested in a browser) |
| 12 | Image and page weight | Done (2026-10-07): homepage 987 → 710 KB on a 1x desktop, 546 → 415 KB on a phone; about page 759 → ~600 / 446 → 351 KB (local files, before compression) |
| 13 | Cleanup: unused files, orphan pages, dead CSS | Done (2026-10-07): styles.css 133 → 84 KB (screenshot-verified, 0 pixel changes); unused files out; product stubs rebuilt; see report below |
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

### 9 — Footer (done)
- A rendered 75% keyboard instead of four columns (Mike's concept); links are in the HTML. The homepage adds the
  hub and cable above it. See `YORU_SITE_MEMORY.md` 9a/9b and `mockups/keys/README.md`.

### 10 — Commission form
- Replace `mailto:`, which fails when the visitor has no mail app set up.
- Recommended: a small Cloudflare Worker endpoint that emails Mike. It stays on the current host and
  needs no third-party form service. Alternatives: Formspree, Basin.
- Add spam protection (Cloudflare Turnstile), success/error states, and a no-JS fallback.
- ~~Confirm hello@ receives mail~~ Done: Zoho inbox; sending through Resend; tested end to end.
- ~~One name everywhere~~ Done (2026-10-07): the page is `request-a-commission.html`; the old
  `request-a-build.html` 301-redirects to it (`src/static/_redirects`).

### 11 — Motion (done)
- 20 transition declarations, all on duration tokens. Interactions use fast/base/slow (180/200/220ms) on `--ease`.
  The long light fades (keys and board 2.6s, hub screen 1.4s, cable light 0.8s) use `--ease-glow` (plain ease) so a
  slow rise stays gradual. Lifts are 1–3px (the 75% layout tile was 4px); key presses travel 2–4px by design.
- Reduced motion: one global rule zeroes every CSS transition and animation; the header LED, hub cable light, hub
  screen and both keyboards check it in JS and start lit, with nothing moving. Verified in a browser both ways.
- Old components (portal cards, education tiles, mini layouts, the old hero button) still carry 3–4px lifts but are on
  no page; Phase 13 deletes them.

### 12 — Images and weight (done)
- Measured with every lazy image loaded (scrolled to the bottom), local files only, before Cloudflare's compression;
  Google Fonts not counted. Homepage: 987 KB → 710 KB (1x desktop), 546 KB → 415 KB (phone).
- Footer keyboard: half-size `-1x` copies of every frame (`mockups/keys/half-size.py`); the board picks by width
  (phones and 1x desktops take the half), hover/press frames by screen density.
- Hub: frames saved at 900px wide (it shows at most 440 CSS px); its cable-light image loads only when the cable runs
  (never on phones or with reduced motion).
- Every image has intrinsic size; everything below the header is lazy except the copper commission key (in the hero,
  and the same file the header already loaded). No PNG is used by any page; the three left in `assets/` go in Phase 13.
- Largest remaining: `styles.css` (130 KB raw, much of it dead old-design CSS: Phase 13) and the footer keyboard.

### 13 — Cleanup and report (done, 2026-10-07)
- **Dead CSS:** 694 selectors naming 58 classes no page or script uses (old hero, portal cards, education tiles,
  showpiece, manifesto, grain/paper textures, old modal, status chips, layout tiles, old page hero, eyebrows) are
  removed: 133 KB → 84 KB. Proof: full-page screenshots of every page at 1440/900/390 (reduced motion, so frames
  are stable) are pixel-identical before and after each pass (54/54, then 51/51). A Chrome coverage run at ten
  widths found no further rule that never matches, apart from conditional ones (reduced motion, the open guide
  modal, the phone menu, media-ready states, Turnstile), which stay.
- **Unused files:** six logo/emblem variants moved to `brand/` (kept, not published); one placeholder SVG deleted;
  the build-only JSON data files are no longer copied into `/public`.
- **Pages:** the five hidden product stubs use the current page intro (no PRODUCTS eyebrow) and link to Crafted Art.
  The old `products-keyboards.html` duplicated Crafted Art in the old design; it now 301-redirects there. The site
  check lists the five stubs as orphans: intended, they are hidden until Mike adds those categories.
- **Skipped on purpose:** consolidating the remaining layered `!important` overrides on live classes. Every
  remaining rule applies somewhere; merging them is restyling with real regression risk for a few KB.
- **What strains at 10+ builds:** `commission.html` renders every visible build into the page (one shown, the rest
  hidden, audio set to load nothing until opened), so it grows linearly; past ~20 builds give each build its own
  generated page (the data shape already supports it). The archive list is fine at that size. Media files should
  follow `MEDIA.md` sizes or page weight climbs fast.
- **Repo vs public:** `/public` holds only pages, `styles.css`, `script.js`, `data/content.js`, `_redirects`, images,
  the placeholder SVGs and the silent test audio. Mockups, render scripts, `brand/` and the Worker source are not
  published.

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
- ~~Privacy policy~~ Done: `/privacy.html` (2026-10-07). Commission policy: drafted in `drafts/commission-policy.md`,
  waiting on Mike's numbers and approval. Social links confirmed (YouTube maybe later).

## Open decisions for Mike

1. ~~Phases 4 and 5~~ Type scale and button system (from Mike's earlier plan); both done in the redesign.
2. ~~Homepage textures~~ Answered: no texture (Mike, 2026-10-06).
3. ~~Cream rule~~ Retired with the Verdigris direction.
4. ~~Form backend~~ Answered: Cloudflare Worker, sending through Resend (mail is on Zoho).
5. ~~Archive and Journal~~ Kept and rebuilt (2026-10-07); Phase 9 puts their footer links into the HTML.
6. ~~Product stub pages~~ Answered: keep the Mice / Mouse Pads / Desk Mats / Wrist Rests / Accessories stubs (hidden) for future additions (Mike, 2026-10-07).
7. Spam protection: Turnstile stays off; the trap field is on. Turn it on if spam requests reach hello@ (README).

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
