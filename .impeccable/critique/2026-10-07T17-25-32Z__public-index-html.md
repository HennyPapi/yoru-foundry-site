---
target: whole live site
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/yoru-foundry-site/public/index.html"
target_fingerprint: "sha256:129ca5bf92426c03138cd6791354fc3f23232765ff02534b946362ae15d8f67c"
target_path: /home/user/yoru-foundry-site/public/index.html
timestamp: 2026-10-07T17-25-32Z
slug: public-index-html
---
Method: dual-agent (A: design review · B: detector + browser)

Heuristics 22/40 (Acceptable): status 3, real world 2, control 3, consistency 1, error prevention 2, recognition 2, flexibility 2, minimalist 2, recovery 2, help 3.

Specificity: the frame (header cable + keycaps, copper Enter key, footer keyboard, layout drawings, build sheet, commission policy, About story) is authored; the body between header and footer is a generic dark editorial template with slogan headings, repeated left/right hairline blocks, identical-unit rows, Cinzel capitals at every level, and developer notes published as copy.

Detector: 646 findings in public/, 632 buried-raster (false positive: hover/press frames), 6 border-accent-on-rounded (keycap spec, FP), 1 layout-transition (section-key border press, FP), 5 cramped-padding .build-media (FP), 2 tight-leading (display headings, arguable). Real: request-a-commission H1 overflows its column at 1024/1440 (594px in 541px); About line length 91-109 chars; index heading rhythm on "Built to keep" / "Choose a layout". No console errors, no 390px overflow, no missing alt, no text under 12px.

P1 Dead destinations: live mode hides placeholder YF-001, but crafted-art-75 links to it twice -> "This record is not published"; home build sheet advertises it; Journal/Archive empty but spelled across the footer; drawn waveform stands in for sound.
P1 Developer notes as public copy: "testing asset", "working prototype for the comparison system", "validate player sizing, controls, spacing, and metadata", "These cards will eventually…", "This route is intentionally…", "without changing the main layout page", company "we" on Built to Taste.
P2 Monotone type/composition and slogan headings (About: 12 display headings in one block pattern; triplet slogans; every H1 a full-stopped fragment).
P2 Home close: hub reads as a charger product shot; screen text tiny; paragraph detached from heading; cable visible below the board into the footer row.
P2 Request form: one-option Sound select, preselected $250-$400, coming-soon layouts selectable, spec path has no spec fields, no reply time, "Create Commission Request", H1 overflow.
P3 Inconsistent facts across pages (process 4/6/5 steps, layout blurbs, Built to keep/last), guide modal "Step 1/2/3" on a non-sequence.
