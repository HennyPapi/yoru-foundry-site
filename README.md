# Yoru Foundry Website

Starter website for **yorufoundry.com**, designed for Cloudflare Workers Static Assets.

## Structure

- `src/*.html` — source pages and page metadata
- `src/partials/` — shared head, header/navigation, footer, and scripts
- `src/static/` — source CSS, JavaScript, data, images, and audio
- `build.js` — dependency-free static page assembler
- `public/` — generated, gitignored deployment output; never edit directly
- `wrangler.jsonc` — Cloudflare deployment configuration

## Deploy

In Cloudflare, connect this GitHub repository and use:

- Build command: `node build.js`
- Deploy command: `npx wrangler@4 deploy`
- Non-production deploy command: `npx wrangler@4 versions upload --preview-alias design-pass`

Cloudflare builds the source and serves the generated files from `./public`.

## Before launch

Replace the gallery placeholders with your own keyboard photography.
Update Instagram/TikTok links once the accounts are ready.
The Request a Build form currently opens the visitor's email app with a pre-filled message to `hello@yorufoundry.com`.

