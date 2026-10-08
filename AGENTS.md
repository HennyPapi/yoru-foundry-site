# Yoru Foundry Agent Instructions

Before making any visual, CSS, layout, branding, navigation, responsive, or component change:

1. Treat this `AGENTS.md` file, with the rule files listed under "Rules that load with the files they govern", as the authoritative build and implementation rule set.
2. Background files hold history and context, not rules. Read the one the task needs, not all of them:
   - `YORU_SITE_MEMORY.md`: page architecture, component roles and the reasons behind past decisions. Read it before beginning visual work.
   - `ROADMAP.md`: the current phase, the order of work and open decisions. Read it at the start of phase work.
   - `PRODUCT.md`: product truth. Read it for content or positioning work. Impeccable loads it itself.
   - `DESIGN_PLAN.md` and `mockups/home.html`: how the approved direction was reached, and the approved homepage composition. Read them for homepage composition work.

   If one conflicts with `AGENTS.md`, follow `AGENTS.md`.
3. Do not redesign the site from scratch unless Mike explicitly asks.
4. Preserve the logo medallion (`/assets/yoru-foundry-logo-v5.webp` or its trimmed derivative). Never redraw or recolor it.
5. Verify desktop, tablet, and mobile behavior after broad changes.
6. For visual design, Impeccable's guidance takes priority over the design rules in this file and in `.claude/rules/` (Mike, 2026-10-08). "Skills in this repo" at the end says what that covers and what still holds.

Outside Impeccable-led design work, when in doubt, preserve the current approved appearance and ask before making a major visual departure.

## Rules that load with the files they govern

To keep this file short, the detailed rules live in `.claude/rules/`. Claude Code loads each one automatically when it reads or edits a matching file. They are as binding as this file. If you are about to change a matching file and its rules are not already in your context, read the rule file first.

| Rule file | Covers | Loads for |
|---|---|---|
| `.claude/rules/design.md` | The Verdigris direction, design tokens, texture, type, buttons, motion, layout and hero guardrails, first paint and cache | pages, CSS and scripts under `src/`, and `mockups/` |
| `.claude/rules/css-architecture.md` | Phase 3 CSS architecture: token architecture, geometry, motion tokens, validation | CSS under `src/static/` |
| `.claude/rules/build.md` | Static build workflow and the content-as-data rule | anything under `src/`, `build.js`, `public/` |

Two of those rules matter everywhere: `/public` is generated, so never edit it directly; edit `/src` and run `node build.js`.

## Build rules

These rules are standing constraints for all future work in this repository. Read and follow them before changing HTML, CSS, JavaScript, content, or assets.

### Product and brand posture

- Yoru Foundry is a solo, commission-first workshop. One person hand-builds custom keyboards to order (mechanical now; Hall effect or TMR magnetic boards may come later).
- The site must read as a workshop / atelier and portfolio, **not** as a conventional ecommerce store.
- Low volume and long lead times are part of the operating model; do not introduce UI that implies mass retail, instant fulfillment, or a large team.
- The Verdigris direction is approved. Systematize and refine it; do not repaint or redesign it from scratch unless Mike explicitly asks.
- Real photography, video, audio, and completed-build content do not exist yet. Keep honest placeholders that can be replaced later without layout changes. Never fabricate finished builds or use stock keyboard imagery as a substitute.

### Voice and copy

- **Mike is the final authority for public-facing brand copy.** Do not invent, rewrite, or publish new brand copy unless Mike explicitly asks for copy work or supplies/approves the wording.
- If a layout or implementation requires copy that has not been supplied, stop and ask rather than filling the gap with invented text.
- Write approved copy in **first person singular**.
- Use “I build”, “I source”, “I tune”, “I’ll work with you”.
- Never use “our team” or copy that implies employees or a larger operation. **“We” is allowed only when it means Mike and the client working together** (“We can work through the technical choices together.”), never a company “we” (Mike, 2026-10-06).
- Tone: knowledgeable, precise, patient, personal, craft-led, and transparent.
- Avoid generic luxury filler, aggressive sales language, urgency manipulation, and mass-market ecommerce phrasing.

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

### Current branch workflow

- Phase work belongs on a non-production development branch, normally `design-pass`, not `main`.
- `design-pass` may have only one active AI writer at a time. If another agent is already writing there, remain read-only or use a separate explicitly assigned branch.
- Keep each phase in its own reviewable commit; keep separate requested items in separate commits when Mike asks.
- Do not proceed to a later phase when Mike has asked to review the current phase first.

## Skills in this repo

Ponytail and Impeccable are stored in `.claude/skills/` so every session loads them; `frontend-design` is built into Claude. Sources and versions are in `.claude/skills/SOURCES.md`.

### Impeccable leads on visual design (Mike, 2026-10-08)

Impeccable is here to keep the site from looking AI-made. For visual design work, follow Impeccable first; Mike then adjusts what it produces.

- **Where Impeccable wins.** When its guidance disagrees with a design rule in this file or in `.claude/rules/`, follow Impeccable. That covers palette and tokens, type, texture, shadows and geometry, buttons, motion, layout and hero guardrails, and the design items on the never-add list. Do not tone its output down in advance to fit the older rule.
- **Then Mike adjusts.** Build on a non-production branch, tell Mike which rules in this file the result departs from, and let him adjust it in the preview. Once he approves, update this file and `YORU_SITE_MEMORY.md` to match what shipped, so the rules never lag the site.
- **What still holds.** The rules that are not about how the site looks:
  - the build and branch workflow: never edit `/public`, nothing straight to `main`, real build output before calling anything verified;
  - the logo medallion stays unaltered;
  - Mike is the final authority on public-facing copy;
  - no fabricated builds and no stock keyboard photos;
  - the workshop-not-store posture: no cart, ratings, countdowns, trust badges or the other ecommerce patterns.
- **Use it for design work, not small fixes.** Running Impeccable loads a lot of instructions: roughly 16,000 tokens for a critique and 20,000 for a new design. For a typo, a broken link or a one-property CSS fix, make the change directly. Leave its automatic hooks off unless Mike asks for them.

### Ponytail

Ponytail is the default way to write code here: load the `ponytail` skill at the start of any coding task. Where it disagrees with this file's build and workflow rules, this file wins.
