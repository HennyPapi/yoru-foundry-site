# Yoru Foundry Agent Instructions

Before making any visual, CSS, layout, branding, navigation, responsive, or component change:

1. Read `YORU_SITE_MEMORY.md` in full.
2. Treat it as the source of truth for the approved Yoru Nocturne palette, dimensions, typography, texture system, component roles, logo, and visual direction.
3. Do not reintroduce old brown / bronze / gold / olive / green-heavy experimental palettes.
4. Do not redesign the site from scratch unless Mike explicitly asks.
5. Preserve `/assets/yoru-foundry-logo-v5.webp` as the official header logo.
6. If `public/styles.css` changes, bump the version query on **every HTML page** so stale CSS cannot flash an old palette.
7. Keep first-paint critical colors consistent:
   - body: `#181B1F`
   - header: `#F2EFE8`
   - nav text: `#171A1D`
   - header CTA: Night Iron + `#B8734F` border + Forged Bone text
8. Verify desktop, tablet, and mobile behavior after broad changes.

When in doubt, preserve the current live appearance and ask before making a major visual departure.
