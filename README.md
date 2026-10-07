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

The Worker only answers `/api/commission`; every page is still served as a static file. It sends each request
through [Resend](https://resend.com) to `hello@yorufoundry.com` (Zoho Mail), with Reply-To set to the client. Test the
handler with `node worker/index.test.mjs`.

Mail for yorufoundry.com is hosted by Zoho. **Never turn on Cloudflare Email Routing**: it replaces Zoho's MX records.

To switch sending on (once):

1. Make a free account at resend.com.
2. **Resend → Domains → Add domain:** `yorufoundry.com`. Add the records it lists in Cloudflare → yorufoundry.com →
   DNS → Records, exactly as shown, as **DNS only** (grey cloud). They sit on the `send` subdomain and
   `resend._domainkey`, so Zoho's records are untouched; do not edit or delete any existing record. Wait until Resend
   shows the domain as Verified.
3. **Resend → API Keys → Create:** permission "Sending access", domain `yorufoundry.com`. Copy the key (starts `re_`).
4. **Cloudflare → Workers & Pages → yoru-foundry-site → Settings → Variables and Secrets → Add:** type Secret, name
   `RESEND_API_KEY`, value the key. Requests then arrive from `commissions@yorufoundry.com` (change with a
   `COMMISSION_FROM` variable; send elsewhere with `COMMISSION_TO`).
5. Optional spam check, **Turnstile → Add widget:** hostnames `yorufoundry.com` and `mllerenafinances.workers.dev`,
   mode Managed. Put the site key in `config.turnstileSiteKey` in `build.js`, and the secret key in the Worker under
   **Settings → Variables and Secrets** as `TURNSTILE_SECRET`. Set both or neither. A hidden trap field already stops
   simple bots.


