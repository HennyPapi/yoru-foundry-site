---
target: the redesign mockup
total_score: 22
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 3
target_identity: "file:/home/user/yoru-foundry-site/mockups/home.html"
target_fingerprint: "sha256:60c233cc0106150c406bb95d2fdda7487234d925baba8b2b3cb36a11997e13fe"
target_path: /home/user/yoru-foundry-site/mockups/home.html
timestamp: 2026-10-06T17-33-58Z
slug: mockups-home-html
---
Method: dual-agent (A: design review sub-agent · B: detector sub-agent)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Status + build window work; lit waveform implies playback next to a disabled play button |
| 2 | Match System / Real World | 2 | Drawings and build sheet speak keyboard; H1, lede, title still don't; "Ember" is in-house jargon |
| 3 | User Control and Freedom | 3 | Logo isn't a home link; no menu below 860px |
| 4 | Consistency and Standards | 2 | Built to Taste key is copper-filled like the CTA; .btn has no hover; two <main> |
| 5 | Error Prevention | 3 | Coming-soon layouts now inert; copper learning key could be mistaken for the commission |
| 6 | Recognition Rather Than Recall | 3 | Descriptions on every key; build-sheet values need prior knowledge |
| 7 | Flexibility and Efficiency | 1 | Still no enthusiast / bring-your-own-parts path |
| 8 | Aesthetic and Minimalist Design | 3 | Strong rhythm; ~330px void under build sheet; hero CTA below the fold at 1440x900 |
| 9 | Error Recovery | n/a | No inputs |
| 10 | Help and Documentation | 2 | Built to Taste surfaced; jargon unexplained where it appears |
| **Total** | | **22/36** | **Good-adjacent (61%)** |

## Design Specificity Verdict
Mostly authored for a keyboard workshop now: scaled layout drawings, keycap press, build sheet, sound band. Still interchangeable where it's most read: H1 and lede (old copy), and the empty hero frame dominates the first screen.
Detector: 0 real findings. CLI clean with project config (1 cramped-padding on the full-bleed band without it, false positive). Browser: 3 at 1440, 1 at 390, all false positives (border-bottom-width matched "width"; heading-rhythm misread section padding and ruled-list rows). Texture changes no findings.

## Priority Issues
- [P1] Copper discipline broken: Built to Taste key is the largest copper block, plus lit waveform and glow. Fix: Green Sand face with copper edge; waveform lit bars Verdigris/Bright; copper fills only on the commission keycap and Esc. Command: quieter, colorize.
- [P1] First screen at 1440x900 has no product and no action: CTA top at 898px, empty frame dominates, void under build sheet. Fix: cap frame height or move copy beside build sheet; put the 75% drawing in the frame until footage exists; Mike's H1. Command: layout, clarify.
- [P1] No bring-your-own-parts / spec-first path, no budget or consultation reassurance. Fix: build-sheet rows awaiting Mike's copy; "New to custom boards?" / "I know my spec" links. Command: onboard.
- [P2] Texture mirror-tile artifacts: kaleidoscope symmetry and repeated specks on keys and frame; reads as leatherette at 2x. Fix: offset-stitched tile, finer key scale, per-key phase, lower frame opacity. Command: polish.
- [P2] Navigation and semantics: no mobile menu, logo not a link, two <main>, footer contacts not links, .btn lacks hover, 24px tap target. Command: harden, adapt.

## Persona Red Flags
Jordan: no "keyboard" until the drawings; Ember/Gasket opaque. Riley: disabled play looks live; logo dead; footer email not clickable. Casey: no menu; drawings ~66% down; duplicate CTAs on first screen. Newcomer: Built to Taste styled like a purchase. Enthusiast: no BYO acknowledgement.

## Minor Observations
Texture holds token color (contrast drop ~0.5:1 worst-case, all AA). Key row reads as four cards of different widths, becomes 2x2 at 820. 2px top rule on build sheet fights hairlines. H1 wraps differently by breakpoint. Footer still uses dot-joined string. Hero glow nearly invisible at 1x. Logo ring visible on Cast.

## Questions to Consider
- Why is the strongest object (scaled 75% drawing) at 70% depth instead of in the empty hero frame?
- Which copper is the one colored key?
- Sound band: promise it honestly, or hold it until one real recording exists?
