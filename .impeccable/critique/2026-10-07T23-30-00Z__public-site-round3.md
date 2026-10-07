---
target: whole live site, round 3 (critique + audit + copy sweep)
total_score: 28
max_score: 40
audit_score: 17/20
p0_count: 0
p1_count: 2
timestamp: 2026-10-07T23-30-00Z
slug: public-site-round3
---
Critique 28/40 (+1): status 3, real world 3, control 3, consistency 2, error prevention 3, recognition 3, flexibility 3, minimalist 2, recovery 3, help 3.
Audit 17/20: a11y 3 (axe 0 violations x40), performance 3, responsive 3, theming 4, integrity 4.
Detector 643: all known false positives (hover/press frames, keycap edge, placeholder frames, display leading).

P1: process modal title collides with close button at 390; placeholder frames too large (About portrait 772x965 at 820, guide modals).
P2: request "From first conversation..." overflows at 320; heading scale flat (88/64/34); About chapter layouts inconsistent + "Refined by Craft." orphan + pull quote repeats nearby; inner pages share one composition; Crafted Art coming-soon layouts same weight as 75%, no closing link; request form empty left column, browser-only validation, "I know my spec" not to #spec; footer hover/press frames eager (455KB at 2x); no _headers / unversioned assets; mobile footer empty nav landmark; thin meta descriptions, no JSON-LD.
P3: A/B cross-variable compare; footer phone links 19px; form status display:none; hub path x3; no apple-touch-icon/favicon.ico; font weights over-requested; no print css.
Copy: implies finished builds/recordings exist (crafted-art, index, archive, built-to-taste); "Customer build photo" label; developer line on build records; commission.html indexed while empty; privacy "we use"; "catalog"; "customers" vs "you"; Ember naming; duplicated sentences across pages; straight quotes; heading case drift; "Back to Layouts"/"Explore comparison" labels; "Not sure" variants.
