const fs = require("node:fs");
const path = require("node:path");

const config = Object.freeze({
  stylesheetVersion: "yn-design-p3-3",
  siteTitle: "Yoru Foundry",
  SITE_MODE: "prelaunch",
});

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const PARTIALS = path.join(SRC, "partials");
const STATIC = path.join(SRC, "static");
const OUTPUT = path.join(ROOT, "public");
const GENERATED_HEADER =
  "<!-- GENERATED FILE — DO NOT EDIT. Edit /src and run node build.js. -->";
const REQUIRED_PLACEHOLDERS = ["HEAD", "HEADER", "FOOTER", "SCRIPTS"];
const VALID_NAV = new Set([
  "none",
  "crafted-art",
  "trust-the-process",
  "built-to-taste",
  "about",
  "products",
  "request-a-build",
]);
const VALID_FOOTERS = new Set(["standard", "archive", "emblem"]);

function fail(message) {
  throw new Error(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing required file: ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, "utf8");
}

function replaceTokens(template, values, label) {
  const output = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
    if (!(key in values)) fail(`${label}: missing value for {{${key}}}`);
    return values[key];
  });
  const unresolved = output.match(/\{\{[^}]+\}\}/g);
  if (unresolved) fail(`${label}: unresolved placeholders: ${unresolved.join(", ")}`);
  return output;
}

function toggleBlock(template, name, enabled) {
  const pattern = new RegExp(`\\{\\{#${name}\\}\\}([\\s\\S]*?)\\{\\{/${name}\\}\\}`, "g");
  return template.replace(pattern, enabled ? "$1" : "");
}

function parsePage(file) {
  const source = read(file);
  const match = source.match(/^<!-- PAGE\s*\n([\s\S]*?)\n-->\s*\n?/);
  if (!match) fail(`${path.basename(file)}: missing PAGE metadata block`);

  let page;
  try {
    page = JSON.parse(match[1]);
  } catch (error) {
    fail(`${path.basename(file)}: invalid PAGE metadata JSON (${error.message})`);
  }

  for (const key of ["output", "title", "activeNav", "layout"]) {
    if (!page[key]) fail(`${path.basename(file)}: missing metadata field "${key}"`);
  }
  if (!VALID_NAV.has(page.activeNav)) {
    fail(`${path.basename(file)}: invalid activeNav "${page.activeNav}"`);
  }
  if (!new Set(["default", "redirect"]).has(page.layout)) {
    fail(`${path.basename(file)}: invalid layout "${page.layout}"`);
  }
  if (page.layout === "default" && !VALID_FOOTERS.has(page.footerVariant)) {
    fail(`${path.basename(file)}: invalid or missing footerVariant "${page.footerVariant}"`);
  }
  if (path.basename(page.output) !== page.output || !page.output.endsWith(".html")) {
    fail(`${path.basename(file)}: output must be a top-level .html filename`);
  }

  const template = source.slice(match[0].length);
  for (const placeholder of REQUIRED_PLACEHOLDERS) {
    const count = template.split(`{{${placeholder}}}`).length - 1;
    if (count !== 1) {
      fail(`${path.basename(file)}: expected one {{${placeholder}}}, found ${count}`);
    }
  }
  return { file, page, template };
}

function renderPage(entry, partials) {
  const { page, template, file } = entry;
  const label = path.basename(file);
  const redirect = page.layout === "redirect";
  const description = page.description
    ? `<meta name="description" content="${page.description}">`
    : "";
  const head = replaceTokens(
    toggleBlock(partials.head, "STANDARD", !redirect),
    {
      DESCRIPTION_META: description,
      HEAD_EXTRA: redirect
        ? `<meta http-equiv="refresh" content="0; url=${page.redirectUrl}">`
        : "",
      FULL_TITLE: `${page.title} | ${config.siteTitle}`,
      CRITICAL_CSS: redirect
        ? "html,body{margin:0;background:#181B1F;color:#F2EFE8;min-height:100%;font-family:Manrope,system-ui,sans-serif}main{max-width:760px;margin:auto;padding:15vh 24px}a{color:#C88967}"
        : "html,body{margin:0;background:#181B1F;color:#F2EFE8;min-height:100%}body{min-height:100vh}.site-header{background:#F2EFE8;color:#171A1D}.nav,.nav a,.products-menu summary{color:#171A1D}.nav-cta{background:#181B1F!important;color:#F2EFE8!important;border:1px solid #B8734F!important}",
      STYLESHEET_VERSION: config.stylesheetVersion,
    },
    `${label} head`,
  );

  const active = (item) => page.activeNav === item;
  const header = redirect
    ? ""
    : replaceTokens(
        partials.header,
        {
          NAV_CRAFTED_ART: active("crafted-art") ? ' class="active"' : "",
          NAV_TRUST: active("trust-the-process") ? ' class="active"' : "",
          NAV_TASTE: active("built-to-taste") ? ' class="active"' : "",
          NAV_ABOUT: active("about") ? ' class="active"' : "",
          NAV_PRODUCTS: active("products") ? " active" : "",
          NAV_REQUEST: active("request-a-build") ? " active" : "",
        },
        `${label} header`,
      );
  const footerLead =
    page.footerVariant === "emblem"
      ? '<div class="footer-brand"><img src="/assets/yoru-emblem.svg" alt=""><div><strong>YORU FOUNDRY</strong><span>Refined by Craft.</span></div></div>'
      : '<div class="socials"><span>Follow the Foundry</span><a href="https://www.instagram.com/yorufoundry/" target="_blank" rel="noopener">Instagram&nbsp; @yorufoundry</a><a href="https://www.tiktok.com/@yoru.foundry" target="_blank" rel="noopener">TikTok&nbsp; @yoru.foundry</a></div>';
  const footerLinks =
    page.footerVariant === "archive"
      ? '<a href="/archive.html">Archive</a><a href="/why-yoru.html">Why Yoru</a><a href="/journal.html">Journal</a><a href="/crafted-art.html">Crafted Art</a><a href="/about.html">About</a><a href="mailto:hello@yorufoundry.com">hello@yorufoundry.com</a>'
      : '<a href="/crafted-art.html">Crafted Art</a><a href="/about.html">About</a><a href="mailto:hello@yorufoundry.com">hello@yorufoundry.com</a>';
  const footer = redirect
    ? ""
    : replaceTokens(
        partials.footer,
        {
          FOOTER_LEAD: footerLead,
          FOOTER_LINKS: footerLinks,
          COPYRIGHT_CLASS: page.footerVariant === "emblem" ? "" : ' class="copyright"',
        },
        `${label} footer`,
      );
  const scripts = replaceTokens(
    partials.scripts,
    {
      PAGE_SCRIPTS: redirect
        ? `<script>location.replace(${JSON.stringify(page.redirectUrl)})</script>`
        : '<script src="/data/content.js?v=phase2-1"></script><script src="/script.js?v=phase2-1"></script>',
    },
    `${label} scripts`,
  );

  const html = replaceTokens(template, { HEAD: head, HEADER: header, FOOTER: footer, SCRIPTS: scripts }, label);
  if (!html.trim()) fail(`${label}: produced no output`);
  return `${GENERATED_HEADER}\n${html}`;
}

function injectSiteMode() {
  const file = path.join(OUTPUT, "data", "content.js");
  const source = read(file);
  const marker = "__SITE_MODE__";
  const count = source.split(marker).length - 1;
  if (count !== 1) fail(`src/static/data/content.js: expected one ${marker}, found ${count}`);
  fs.writeFileSync(file, source.replace(marker, config.SITE_MODE));
}

function build() {
  const partials = Object.fromEntries(
    ["head", "header", "footer", "scripts"].map((name) => [
      name,
      read(path.join(PARTIALS, `${name}.html`)),
    ]),
  );
  const files = fs.existsSync(SRC)
    ? fs.readdirSync(SRC).filter((name) => name.endsWith(".html")).sort()
    : [];
  if (!files.length) fail("No source pages found in /src");

  const entries = files.map((name) => parsePage(path.join(SRC, name)));
  const outputs = new Set();
  const rendered = entries.map((entry) => {
    if (outputs.has(entry.page.output)) fail(`Duplicate output: ${entry.page.output}`);
    outputs.add(entry.page.output);
    return [entry.page.output, renderPage(entry, partials)];
  });

  if (!fs.existsSync(STATIC)) fail("Missing required directory: src/static");
  fs.rmSync(OUTPUT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.cpSync(STATIC, OUTPUT, { recursive: true });
  injectSiteMode();

  for (const [output, html] of rendered) {
    const destination = path.join(OUTPUT, output);
    fs.writeFileSync(destination, html);
    if (!fs.existsSync(destination) || fs.statSync(destination).size === 0) {
      fail(`${output}: output file was not created`);
    }
  }
  console.log(`Built ${rendered.length} pages in /public (${config.SITE_MODE}).`);
}

try {
  build();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
