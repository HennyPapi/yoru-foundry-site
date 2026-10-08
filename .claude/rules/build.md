---
paths:
  - "src/**/*"
  - "build.js"
  - "public/**/*"
---

# Build rules

Moved from `AGENTS.md` unchanged, and as binding.

### Static build workflow

- `/src` is the source of truth for page HTML. Every source page declares its output filename, title, active navigation item, and layout in its `PAGE` metadata block.
- Shared markup lives only in `/src/partials`: `head.html`, `header.html`, `footer.html`, and `scripts.html`.
- Static source assets, CSS, JavaScript, content data, images, and audio live in `/src/static`.
- `/public` is generated, gitignored deployment output. **Never edit `/public` directly.** Edit `/src` and run the build.
- Build command: `node build.js`. There is no framework, bundler, or watch-mode dependency.
- `build.js` contains the single `config` object for `stylesheetVersion`, `siteTitle`, and `SITE_MODE`.
- A stylesheet version bump is one edit to `config.stylesheetVersion`; `node build.js` propagates it to every generated page.
- Active navigation is rendered from each page's `activeNav` metadata. Do not restore client-side pathname-based active-nav detection.
- `src/static/data/content.js` has a dual role: `build.js` evaluates it at build time for prerendering, and the built copy is also available for client-side hydration. **Critical content must exist in generated HTML at build time; client-side JavaScript may hydrate/enhance it but must never be required for the content to exist.** Do not regress to empty client-side shells.
- A page's closing link is its PAGE `next` field (`{"href", "text"}`), rendered by the build at the end of `<main>`. The links form one path (Mike, 2026-10-07): About → Why Yoru → Trust the Process → Built to Taste → Crafted Art → (layout page) → Request a Commission; Journal joins it at Built to Taste, Archive goes to the request page. Do not hand-write closing links in page HTML.
- Every page has the one footer (`footerVariant: standard`), the Phase 9 keyboard footer (2026-10-07). Do not add footer variants.
- Every generated HTML page must begin with `<!-- GENERATED FILE — DO NOT EDIT. Edit /src and run node build.js. -->`.
- The build must fail with a non-zero exit code for missing placeholders, invalid navigation values, duplicate/invalid outputs, or any source page that fails to create a non-empty output file.
- Cloudflare Workers Builds runs `node build.js` before uploading `/public`. Non-production branches use version uploads and preview URLs; only `main` may deploy to production.

### Content-as-data rule

- Repeated structured content must be represented as data rather than maintained as duplicated markup.
- Examples: process steps, comparison options, product/layout metadata, commission specs, material options, archive entries, status labels, and other repeatable collections.
- Keep one source of truth for repeated content, then render or reuse it consistently.
- Unique editorial prose may remain in semantic HTML when it is page-specific.
- Do not duplicate the same factual content across pages if it can be sourced from one data structure.
- Placeholders should use the same content shape that future real content will use so photography, video, audio, and completed builds can drop in without layout rewrites.
- Do not over-engineer one-off content into a data layer when there is no reuse or structural benefit.
