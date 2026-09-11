# Yoru Foundry Website

Starter website for **yorufoundry.com**, designed for Cloudflare Workers Static Assets.

## Structure

- `public/index.html` — website content
- `public/styles.css` — styling
- `public/script.js` — menu + build-request email form
- `wrangler.jsonc` — Cloudflare deployment configuration

## Deploy

In Cloudflare, connect this GitHub repository and use:

- Build command: leave blank
- Deploy command: `npx wrangler deploy`

Cloudflare will serve the files from `./public`.

## Before launch

Replace the gallery placeholders with your own keyboard photography.
Update Instagram/TikTok links once the accounts are ready.
The Request a Build form currently opens the visitor's email app with a pre-filled message to `hello@yorufoundry.com`.
