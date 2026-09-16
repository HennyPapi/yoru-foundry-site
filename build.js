const fs = require("node:fs");
const path = require("node:path");

const config = Object.freeze({
  stylesheetVersion: "yn-design-p3-5x",
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"\']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "\'": "&#039;",
  })[char]);
}

function buildHref(build) { return "/commission.html?id=" + encodeURIComponent(build.id); }

function statusLabel(status) {
  return ({ placeholder: "PRELAUNCH STUDY", "in-progress": "IN PROGRESS", built: "BUILT", available: "AVAILABLE" })[status] || String(status || "").toUpperCase();
}

function loadSiteContent() {
  const file = path.join(STATIC, "data", "content.js");
  const source = read(file);
  const marker = "__SITE_MODE__";
  const count = source.split(marker).length - 1;
  if (count !== 1) fail("src/static/data/content.js: expected one " + marker + ", found " + count);
  const createContent = new Function("window", source.replace(marker, config.SITE_MODE) + "\nreturn window.YORU_CONTENT;");
  const content = createContent({});
  if (!content) fail("src/static/data/content.js: YORU_CONTENT was not created");
  return content;
}

function visibleBuilds(content) {
  const builds = Array.isArray(content.BUILDS) ? content.BUILDS : [];
  return content.SITE_MODE === "live" ? builds.filter((build) => build.status !== "placeholder") : builds;
}


function renderSoundPlayer(sample) {
  if (!sample) return "<p>Audio reference is not available yet.</p>";
  return '<div class="sound-player-copy"><strong>' + escapeHtml(sample.name) + '</strong><p>' + escapeHtml(sample.description) + '</p></div><audio controls preload="metadata" src="' + escapeHtml(sample.file) + '" aria-label="' + escapeHtml(sample.name) + '"></audio>';
}

function renderStoryGrid(type, stories) {
  const group = (stories || {})[type] || {};
  return Object.entries(group).map(([id, story], index) => {
    const action = type === "process" ? "Open process →" : "Explore comparison →";
    return '<button class="story-tile" data-story-type="' + escapeHtml(type) + '" data-story="' + escapeHtml(id) + '"><div class="sample-image"><img src="/img/placeholder-3x2.svg" alt="" width="1200" height="800" loading="lazy" decoding="async"></div><span>' + String(index + 1).padStart(2, "0") + '</span><h2>' + escapeHtml(story.title) + '</h2><p>' + escapeHtml(story.intro) + '</p><b>' + action + '</b></button>';
  }).join("");
}

function renderStorySteps(story) {
  if (!story) return "";
  return (story.steps || []).map((step, index) => '<section class="story-row ' + (index % 2 ? "reverse" : "") + '"><div class="story-media"><img src="/img/placeholder-3x2.svg" alt="" width="1200" height="800" loading="lazy" decoding="async"><span class="media-label">' + escapeHtml(step[1]) + '</span></div><div class="story-copy"><p class="eyebrow">STEP ' + String(index + 1).padStart(2, "0") + '</p><h3>' + escapeHtml(step[0]) + '</h3><p>' + escapeHtml(step[2]) + '</p></div></section>').join("");
}

function renderCommissionDetail(build, soundSamples) {
  if (!build) {
    return '<section class="page-hero-shell section-shell"><div class="section-shell-frame"><div class="page-hero"><p class="eyebrow">BUILD RECORD</p><h1>This record is not published.</h1><p>I publish build records after the work is ready to document.</p></div></div></section>';
  }
  const details = (build.detailImages?.length ? build.detailImages : ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"]).slice(0, 3);
  const audioSample = build.audio ? { name: build.id + " standardized sound test", file: build.audio, description: "Recorded using the standardized Yoru Foundry comparison setup." } : soundSamples[0];
  return '<section class="page-hero-shell section-shell"><div class="section-shell-frame"><div class="page-hero"><p class="eyebrow">' + escapeHtml(statusLabel(build.status)) + ' • ' + escapeHtml(build.id) + ' • ' + escapeHtml(build.layout) + '</p><h1>' + escapeHtml(build.name) + '</h1><p>' + escapeHtml(build.summary) + '</p></div></div></section><section class="commission-hero-media"><img src="' + escapeHtml(build.heroImage || "/img/placeholder-16x9.svg") + '" alt="" width="1600" height="900"></section><section class="commission-story"><div><p class="eyebrow">THE RECORD</p><h2>Documented around intent, not a catalog SKU.</h2></div><div><p>' + escapeHtml(build.notes) + '</p></div></section><section class="commission-detail-grid"><article><span>Case</span><strong>' + escapeHtml(build.specs.case) + '</strong></article><article><span>Plate</span><strong>' + escapeHtml(build.specs.plate) + '</strong></article><article><span>Switches</span><strong>' + escapeHtml(build.specs.switches) + '</strong></article><article><span>Lube</span><strong>' + escapeHtml(build.specs.lube) + '</strong></article><article><span>Keycaps</span><strong>' + escapeHtml(build.specs.keycaps) + '</strong></article><article><span>Mount</span><strong>' + escapeHtml(build.specs.mount) + '</strong></article></section><section class="commission-media-grid">' + details.map((src) => '<div class="detail-media"><img src="' + escapeHtml(src) + '" alt="" width="1000" height="1000" loading="lazy" decoding="async"></div>').join("") + '</section><section class="sound-sample"><div><p class="eyebrow">STANDARDIZED SOUND TEST</p><h2>Hear the build under the same conditions.</h2><p>The player footprint is already locked so a real recording can replace the silent reference without moving the layout.</p></div><div class="compare-audio build-audio">' + renderSoundPlayer(audioSample) + '</div></section><section class="commission-story"><div><p class="eyebrow">PROCESS NOTES</p><h2>Why these choices.</h2></div><div><p>' + escapeHtml(build.processNotes || build.notes) + '</p><a class="text-link" href="/request-a-build.html?layout=' + encodeURIComponent(build.layout) + '">Request a ' + escapeHtml(build.layout) + ' commission →</a></div></section>';
}

function renderDataBackedContent(html, content) {
  const modeContent = (content.SITE_MODE_CONTENT || {})[content.SITE_MODE] || (content.SITE_MODE_CONTENT || {}).prelaunch || {};
  const builds = Array.isArray(content.BUILDS) ? content.BUILDS : [];
  const visible = visibleBuilds(content);
  const build = visible[0] || builds[0];

  html = html.replace(/(<p class="kicker" data-site-hero-eyebrow>)[\s\S]*?(<\/p>)/, (_, open, close) => open + escapeHtml(modeContent.heroEyebrow || "YORU FOUNDRY") + close);
  html = html.replace(/<a class="button primary" data-site-hero-cta href="[^"]*">[\s\S]*?<\/a>/, () => '<a class="button primary" data-site-hero-cta href="' + escapeHtml(modeContent.heroCta?.href || "/crafted-art.html") + '">' + escapeHtml(modeContent.heroCta?.label || "Explore Crafted Art") + "</a>");
  html = html.replace(/(<span data-site-hero-status>)[\s\S]*?(<\/span>)/, (_, open, close) => open + escapeHtml(modeContent.heroStatus || "Built one at a time") + close);

  if (build) {
    const home = build.home || {};
    const heroSpecs = Array.isArray(home.heroSpecs) && home.heroSpecs.length ? home.heroSpecs : [build.specs?.case, build.specs?.mount, build.specs?.switches];
    html = html.replace(/(<div class="hero-showpiece-frame" data-hero-build-media>)[\s\S]*?(<\/div>)/, (_, open, close) => open + '<img src="' + escapeHtml(build.heroImage || "/img/placeholder-16x9.svg") + '" alt="" width="1600" height="900" decoding="async">' + '<span class="showpiece-index">' + escapeHtml(build.id.replace("-", " / ")) + "</span>" + '<div class="showpiece-caption">' + escapeHtml(home.heroCaption || build.summary) + "</div>" + close);
    html = html.replace(/(<div class="showpiece-specs" data-hero-build-specs>)[\s\S]*?(<\/div>)/, (_, open, close) => open + heroSpecs.map((value) => "<span>" + escapeHtml(value) + "</span>").join("") + close);

    const featureSpecs = Array.isArray(home.featuredSpecs) && home.featuredSpecs.length ? home.featuredSpecs : [
      { label: "Layout", value: build.layout },
      { label: "Plate", value: build.specs?.plate },
      { label: "Case", value: build.specs?.case },
      { label: "Mount", value: build.specs?.mount },
    ];
    const featureMedia = home.featuredMediaLabel ? '<div class="featured-photo">' + escapeHtml(home.featuredMediaLabel) + "</div>" : '<div class="featured-photo"><img src="' + escapeHtml(build.images?.[0] || "/img/placeholder-4x5.svg") + '" alt="" width="1200" height="1500" loading="lazy" decoding="async"></div>';
    const featureHtml = featureMedia + '<div class="featured-copy"><p class="eyebrow">' + escapeHtml(home.featuredEyebrow || (statusLabel(build.status) + " • " + build.id)) + "</p><h2>" + escapeHtml(home.featuredHeading || build.name) + "</h2><p>" + escapeHtml(home.featuredBody || build.notes) + '</p><dl class="commission-specs">' + featureSpecs.map((item) => "<div><dt>" + escapeHtml(item.label) + "</dt><dd>" + escapeHtml(item.value) + "</dd></div>").join("") + '</dl><a class="text-link" href="' + escapeHtml(home.featuredHref || buildHref(build)) + '">' + escapeHtml(home.featuredLinkLabel || ("View " + build.id + " record →")) + "</a></div>";
    html = html.replace(/(<section class="featured-commission editorial-light" data-featured-build>)[\s\S]*?(<\/section>)/, (_, open, close) => open + featureHtml + close);
  }

  html = html.replace(/(<section class="archive-grid" data-archive-grid aria-live="polite">)[\s\S]*?(<\/section>)/, (_, open, close) => {
    if (!visible.length) return open + '<div class="archive-empty"><p class="eyebrow">ARCHIVE IN PROGRESS</p><h2>I will add finished commissions here as they are completed and documented.</h2></div>' + close;
    const entries = visible.map((item) => {
      const placeholder = item.status === "placeholder";
      const image = item.images?.[0] || "/img/placeholder-4x5.svg";
      return '<a href="' + buildHref(item) + '" class="archive-entry' + (placeholder ? " is-placeholder" : "") + '"><div class="archive-media"><img src="' + escapeHtml(image) + '" alt="" width="1200" height="1500" loading="lazy" decoding="async"></div><div class="archive-copy"><span class="archive-status">' + escapeHtml(statusLabel(item.status)) + " • " + escapeHtml(item.id) + " • " + escapeHtml(item.layout || "") + "</span><h2>" + escapeHtml(item.name) + "</h2><p>" + escapeHtml(item.summary) + '</p><div class="archive-specs" aria-label="Build specifications"><span><b>CASE</b><em>' + escapeHtml(item.specs?.case || "") + "</em></span><span><b>SWITCHES</b><em>" + escapeHtml(item.specs?.switches || "") + "</em></span><span><b>MOUNT</b><em>" + escapeHtml(item.specs?.mount || "") + "</em></span></div></div></a>";
    }).join("");
    return open + entries + close;
  });

  const stories = content.STORIES || {};
  const soundSamples = Array.isArray(content.SOUND_SAMPLES) ? content.SOUND_SAMPLES : [];
  const compareOptions = content.COMPARE_OPTIONS || {};

  html = html.replace(/(<section class="[^"]*story-tile-grid[^"]*" data-story-grid="([^"]+)">)[\s\S]*?(<\/section>)/g, (_, open, type, close) => open + renderStoryGrid(type, stories) + close);

  html = html.replace(/(<div data-build-detail>)[\s\S]*?(<\/div>)/, (_, open, close) => {
    const detailBuild = content.SITE_MODE === "live" ? visible[0] : (visible[0] || builds[0]);
    return open + renderCommissionDetail(detailBuild, soundSamples) + close;
  });

  html = html.replace(/(<div class="compare-audio" data-sound-player="(\d+)">)[\s\S]*?(<\/div>)/g, (_, open, index, close) => open + renderSoundPlayer(soundSamples[Number(index)] || soundSamples[0]) + close);

  const initialCompare = Array.isArray(compareOptions.stabilizer) ? compareOptions.stabilizer : [];
  const compareOptionHtml = initialCompare.map((item, index) => '<option value="' + index + '">' + escapeHtml(item[0]) + '</option>').join("");
  html = html.replace(/(<select id="compareOption[AB]" class="compare-option">)[\s\S]*?(<\/select>)/g, (_, open, close) => open + compareOptionHtml + close);
  html = html.replace(/(<p id="compareDesc[AB]" class="compare-desc">)[\s\S]*?(<\/p>)/g, (_, open, close) => open + escapeHtml(initialCompare[0]?.[1] || "") + close);

  html = html.replace(/(<div class="story-modal" id="storyModal"[\s\S]*?<p class="eyebrow">)(TRUST THE PROCESS|BUILT TO TASTE)(<\/p><h2 id="storyTitle">)[\s\S]*?(<\/h2><p id="storyIntro">)[\s\S]*?(<\/p><\/div><div id="storyContent" class="story-content">)[\s\S]*?(<\/div>)/g, (match, a, label, b, c, d, e) => {
    const type = label === "TRUST THE PROCESS" ? "process" : "taste";
    const first = Object.values(stories[type] || {})[0];
    if (!first) return match;
    return a + label + b + escapeHtml(first.title) + c + escapeHtml(first.intro) + d + renderStorySteps(first) + e;
  });

  return html;
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

function renderPage(entry, partials, content) {
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
        ? "html,body{margin:0;background:#0C0E11;color:#F2EFE8;min-height:100%;font-family:Manrope,system-ui,sans-serif}main{max-width:760px;margin:auto;padding:15vh 24px}a{color:#CB9560}"
        : "html,body{margin:0;background:#0C0E11;color:#F2EFE8;min-height:100%}body{min-height:100vh}.site-header{background:#F2EFE8;color:#171A1D}.nav,.nav a,.products-menu summary{color:#171A1D}.nav-cta{background:#181B1F!important;color:#F2EFE8!important;border:1px solid #B8734F!important}",
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
      ? '<div class="footer-brand"><img src="/assets/yoru-emblem.svg" alt="" width="48" height="48"><div><strong>YORU FOUNDRY</strong> <span aria-hidden="true">·</span> <span>Refined by Craft.</span></div></div>'
      : '<div class="socials"><span>Follow the Foundry</span><a href="https://www.instagram.com/yorufoundry/" target="_blank" rel="noopener">Instagram&nbsp; @yorufoundry</a><a href="https://www.tiktok.com/@yoru.foundry" target="_blank" rel="noopener">TikTok&nbsp; @yoru.foundry</a></div>';
  const footerLinks =
    page.footerVariant === "archive"
      ? '<a href="/archive.html">Archive</a><a href="/why-yoru.html">Why Yoru</a><a href="/journal.html">Journal</a><a href="/crafted-art.html">Crafted Art</a><a href="/about.html">About</a><a href="mailto:hello@yorufoundry.com">hello@yorufoundry.com</a>'
      : '<a href="/crafted-art.html">Crafted Art</a><a href="/about.html">About</a><a href="mailto:hello@yorufoundry.com">hello@yorufoundry.com</a>';
  const modeContent = (content.SITE_MODE_CONTENT || {})[content.SITE_MODE] || (content.SITE_MODE_CONTENT || {}).prelaunch || {};
  const footer = redirect
    ? ""
    : replaceTokens(
        partials.footer,
        {
          FOOTER_LEAD: footerLead,
          FOOTER_LINKS: footerLinks,
          COPYRIGHT_CLASS: ' class="copyright"',
          FOOTER_STATUS: escapeHtml(modeContent.footerStatus || "Built one at a time."),
          COPYRIGHT_YEAR: String(new Date().getFullYear()),
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

  let html = replaceTokens(template, { HEAD: head, HEADER: header, FOOTER: footer, SCRIPTS: scripts }, label);
  html = renderDataBackedContent(html, content);
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
  const content = loadSiteContent();
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
    return [entry.page.output, renderPage(entry, partials, content)];
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
