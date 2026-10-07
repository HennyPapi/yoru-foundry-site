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
The Request a Commission form posts to a small Cloudflare Worker (`worker/`) that emails each request to you, with
Reply-To set to the client. Until email is switched on below, the form falls back to opening the visitor's email app
with the request filled in, so nothing is lost.

## Commission form email

The Worker only answers `/api/commission`; every page is still served as a static file. Test the handler with
`node worker/commission.test.mjs`.

To switch sending on (Cloudflare dashboard, once):

1. **yorufoundry.com → Email → Email Routing.** If it already shows routing rules for `hello@yorufoundry.com`, it is
   on; go to step 2. If `hello@` is hosted somewhere else (Google Workspace, Zoho, iCloud), stop and say so first:
   turning Email Routing on replaces the domain's mail (MX) records.
2. **Destination addresses:** the inbox that should receive requests must be listed and verified. This is the real
   inbox `hello@` forwards to (for example a Gmail address), not `hello@` itself.
3. In `wrangler.jsonc`, uncomment the `send_email` line. If the verified inbox is not `hello@yorufoundry.com`, add
   `"vars": { "COMMISSION_TO": "that-inbox@example.com" }`. Requests arrive from `commissions@yorufoundry.com`
   (change with `COMMISSION_FROM`).
4. Optional spam check, **Turnstile → Add widget:** hostnames `yorufoundry.com` and `mllerenafinances.workers.dev`,
   mode Managed. Put the site key in `config.turnstileSiteKey` in `build.js`, and the secret key in the Worker under
   **Settings → Variables and Secrets** as `TURNSTILE_SECRET`. Set both or neither. A hidden trap field already stops
   simple bots.


