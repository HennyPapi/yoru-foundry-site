---
paths:
  - "src/static/**/*.css"
---

# CSS architecture rules

Moved from `AGENTS.md` unchanged, and as binding. Impeccable leads on visual design (Mike, 2026-10-08): where its guidance disagrees with a rule here, follow Impeccable.

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
