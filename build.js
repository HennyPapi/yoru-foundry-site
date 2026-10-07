const fs = require("node:fs");
const path = require("node:path");

const config = Object.freeze({
  stylesheetVersion: "vg-26-cable-light",
  siteTitle: "Yoru Foundry",
  SITE_MODE: "prelaunch",
  // Cloudflare Turnstile site key (public). Empty = no widget; the Worker's TURNSTILE_SECRET must be set with it.
  turnstileSiteKey: "",
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
const VALID_FOOTERS = new Set(["standard"]);

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
  return ({ placeholder: "Prelaunch study", "in-progress": "In progress", built: "Built", available: "Available" })[status] || String(status || "");
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

// Guide topics as a ruled index; each opens its guide. Process stages are a sequence, so they are numbered.
function renderStoryGrid(type, stories) {
  const group = (stories || {})[type] || {};
  const action = type === "process" ? "Open process" : "Explore comparison";
  return Object.entries(group).map(([id, story], i) => '<button class="guide-topic" type="button" data-story-type="' + escapeHtml(type) + '" data-story="' + escapeHtml(id) + '">' + (type === "process" ? '<span class="guide-step-num">Stage ' + (i + 1) + "</span>" : "") + '<span class="guide-title">' + escapeHtml(story.title) + '</span><span class="guide-intro">' + escapeHtml(story.intro) + '</span><span class="guide-open">' + action + "</span></button>").join("");
}

// One guide's steps (a real sequence): an honest media frame naming what will go there, then the step.
function renderStorySteps(story) {
  if (!story) return "";
  return (story.steps || []).map((step, index) => '<section class="guide-step"><div class="guide-media">' + mediaInner(step[3], step[1], step[1]) + '</div><div class="guide-copy"><p class="guide-step-num">Step ' + (index + 1) + "</p><h3>" + escapeHtml(step[0]) + "</h3><p>" + escapeHtml(step[2]) + "</p></div></section>").join("");
}

// A photo frame: the real image when there is one, otherwise an honest placeholder that names what goes there.
// Real media is any file that isn't one of the placeholder files (placeholder-*.svg, silence-3s.mp3).
function isRealMedia(src) { return Boolean(src) && !/placeholder|silence/.test(src); }

// The inside of a media frame: a looping silent video, a photo, or an honest label naming what goes there.
// Frames fix their aspect ratio in CSS, so real media drops in without moving the layout.
function mediaInner(src, label, alt = "", poster = "") {
  if (!isRealMedia(src)) return "<span>" + escapeHtml(label) + "</span>";
  if (/\.(mp4|webm)$/i.test(src)) return '<video src="' + escapeHtml(src) + '"' + (poster ? ' poster="' + escapeHtml(poster) + '"' : "") + ' muted loop playsinline preload="metadata" data-autoplay aria-label="' + escapeHtml(alt || label) + '"></video>';
  return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '" loading="lazy" decoding="async">';
}

function mediaFrame(src, cls, label = "Customer build photo", alt = "") {
  return '<div class="build-media' + (cls ? " " + cls : "") + '">' + mediaInner(src, label, alt) + "</div>";
}

function buildIdLine(build) {
  return '<p class="build-id">' + escapeHtml(build.id) + '<span class="build-state">' + escapeHtml(statusLabel(build.status)) + "</span>" + (build.layout ? '<span class="build-layout">' + escapeHtml(build.layout) + "</span>" : "") + "</p>";
}

const SPEC_LABELS = [["case", "Case"], ["plate", "Plate"], ["switches", "Switches"], ["lube", "Lube"], ["keycaps", "Keycaps"], ["mount", "Mount"]];

// One build record. commission.html carries every published record; script.js shows the one named by ?id=.
function renderCommissionDetail(build, soundSamples) {
  const details = (build.detailImages?.length ? build.detailImages : [null, null, null]).slice(0, 3);
  const audioSample = build.audio ? { name: build.id + " standardized sound test", file: build.audio, description: "Recorded using the standardized Yoru Foundry comparison setup." } : soundSamples[0];
  return '<section class="page-intro">' + buildIdLine(build) + "<h1>" + escapeHtml(build.name) + "</h1><p>" + escapeHtml(build.summary) + "</p></section>"
    + mediaFrame(build.heroImage, "record-hero")
    + '<section class="chapter"><h2>Documented around intent, not a catalog SKU.</h2><div><p>' + escapeHtml(build.notes) + "</p></div></section>"
    + '<dl class="spec-sheet">' + SPEC_LABELS.filter(([key]) => build.specs?.[key]).map(([key, label]) => "<div><dt>" + label + "</dt><dd>" + escapeHtml(build.specs[key]) + "</dd></div>").join("") + "</dl>"
    + '<div class="record-details">' + details.map((src) => mediaFrame(src, "square")).join("") + "</div>"
    + '<section class="chapter"><h2>Hear the build under the same conditions.</h2><div><p>The player footprint is already locked so a real recording can replace the silent reference without moving the layout.</p><div class="compare-audio record-audio">' + renderSoundPlayer(audioSample) + "</div></div></section>"
    + '<section class="chapter"><h2>Why these choices.</h2><div><p>' + escapeHtml(build.processNotes || build.notes) + '</p><p><a class="text-link" href="/request-a-build.html?layout=' + encodeURIComponent(build.layout) + '">Request a ' + escapeHtml(build.layout) + " commission</a></p></div></section>";
}

function renderBoard(layout, id, live) {
  if (!layout) fail(`content.js: unknown layout "${id}"`);
  let y = 0, w = 0, keys = "";
  layout.rows.forEach((row, i) => {
    let x = 0;
    row.forEach((u, j) => {
      if (u < 0) { x -= u; return; }
      const esc = live && i === 0 && j === 0 && !layout.noEsc;
      keys += `<rect${esc ? ' class="esc"' : ""} x="${(x + 0.06).toFixed(2)}" y="${(y + 0.06).toFixed(2)}" width="${(u - 0.12).toFixed(2)}" height=".88" rx=".12"/>`;
      x += u;
    });
    w = Math.max(w, x); y += 1 + (i === 0 ? layout.gapAfterFirst || 0 : 0);
  });
  return `<svg class="board${live ? " live" : ""}" viewBox="0 0 ${w} ${y}" role="img" aria-label="${escapeHtml(layout.name)} layout">${keys}</svg>`;
}

function renderDataBackedContent(html, content) {
  const modeContent = (content.SITE_MODE_CONTENT || {})[content.SITE_MODE] || (content.SITE_MODE_CONTENT || {}).prelaunch || {};
  const builds = Array.isArray(content.BUILDS) ? content.BUILDS : [];
  const visible = visibleBuilds(content);
  const build = visible[0] || builds[0];

  // Homepage build sheet: the first visible build's facts, then the commission terms and status.
  html = html.replace(/<aside class="build-sheet" data-build-sheet><\/aside>/, () => {
    if (!build) fail("index.html: the build sheet needs at least one build in content.js");
    const row = (item) => "<div><dt>" + escapeHtml(item.label) + "</dt><dd>" + escapeHtml(item.value) + (item.note ? "<small>" + escapeHtml(item.note) + "</small>" : "") + "</dd></div>";
    const rows = [...(build.sheet || []), ...(content.COMMISSION_TERMS || [])];
    return '<aside class="build-sheet" aria-labelledby="build-sheet-title"><div class="build-sheet-head"><h2 id="build-sheet-title">Build sheet</h2><span class="serial">' + escapeHtml(build.id) + (build.nickname ? " \u201c" + escapeHtml(build.nickname) + "\u201d" + (build.status === "placeholder" ? " (placeholder)" : "") : "") + '</span></div><dl>' + rows.map(row).join("") + '</dl><p class="build-status"><span class="status-light" aria-hidden="true"></span>' + escapeHtml(modeContent.heroStatus || "Currently accepting commissions") + '</p><p class="build-status-note">' + escapeHtml(modeContent.statusNote || "") + "</p></aside>";
  });
  // Keyboard layouts drawn at one shared scale; the 75% is drawn live with its Esc key in copper.
  html = html.replace(/<svg data-board="([\w]+)"( class="live")?><\/svg>/g, (_, id, live) => renderBoard(content.LAYOUTS?.[id], id, Boolean(live)));
  // Request page: the commission sequence (numbers on small keycaps) and what every build includes.
  html = html.replace(/<ol class="step-keys" data-commission-steps><\/ol>/, () => '<ol class="step-keys">' + (content.COMMISSION_STEPS || []).map((step, i) => '<li><span class="step-cap" aria-hidden="true">' + (i + 1) + "</span><h3>" + escapeHtml(step.title) + "</h3><p>" + escapeHtml(step.text) + "</p></li>").join("") + "</ol>");
  html = html.replace(/<ul class="included-items" data-commission-included><\/ul>/, () => '<ul class="included-items">' + (content.COMMISSION_INCLUDED || []).map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>");
  // Crafted Art: every layout as a row, drawn at one shared scale (the widest board fills its column).
  html = html.replace(/<section class="layout-rows" aria-label="Layouts" data-layout-rows><\/section>/, () => {
    const layouts = Object.entries(content.LAYOUTS || {});
    const widest = Math.max(...layouts.map(([, l]) => Math.max(...l.rows.map((r) => r.reduce((a, u) => a + Math.abs(u), 0)))));
    return '<section class="layout-rows" aria-label="Layouts">' + layouts.sort(([a], [b]) => (a === "75" ? -1 : b === "75" ? 1 : 0)).map(([id, l]) => {
      const width = Math.max(...l.rows.map((r) => r.reduce((a, u) => a + Math.abs(u), 0)));
      const live = Boolean(l.href);
      const name = live ? '<a href="' + escapeHtml(l.href) + '">' + escapeHtml(l.name) + "</a>" : escapeHtml(l.name);
      return '<article class="layout-row' + (live ? "" : " is-later") + '"><div class="layout-drawing" style="--scale:' + (width / widest).toFixed(4) + '">' + renderBoard(l, id, live) + '</div><div class="layout-copy"><h2>' + name + '</h2><p class="scale-status' + (live ? " is-live" : "") + '">' + escapeHtml(l.status) + "</p><p>" + escapeHtml(l.about || l.blurb) + "</p></div></article>";
    }).join("") + "</section>";
  });
  // Homepage hero frame: HOME_MEDIA's video or photo once there is one; the 75% drawing until then.
  html = html.replace(/<div class="forge-frame">([\s\S]*?)<\/div>/, (match, drawing) => {
    const media = content.HOME_MEDIA || {};
    const src = isRealMedia(media.video) ? media.video : media.image;
    return isRealMedia(src) ? '<div class="forge-frame has-media">' + mediaInner(src, "", media.alt || "", media.poster) + "</div>" : match;
  });
  // Homepage sound band: up to four slots; a slot gets a player once it has a real recording.
  html = html.replace(/<ul class="sound-slots" data-sound-slots><\/ul>/, () => '<ul class="sound-slots">' + (content.HOME_SOUNDS || []).slice(0, 4).map((slot) => isRealMedia(slot.file)
    ? '<li><span class="sound-label">' + escapeHtml(slot.label) + '</span><audio controls preload="none" src="' + escapeHtml(slot.file) + '"></audio></li>'
    : '<li><span class="sound-label">' + escapeHtml(slot.label) + ": recording coming soon</span></li>").join("") + "</ul>");
  // Page media written as <yf-media src="" label="..." class="portrait">: a frame now, a photo or video later.
  html = html.replace(/<yf-media([^>]*)><\/yf-media>/g, (_, attrs) => {
    const attr = (name) => (attrs.match(new RegExp(`${name}="([^"]*)"`)) || [])[1] || "";
    return mediaFrame(attr("src"), attr("class"), attr("label"), attr("alt"));
  });
  // Placeholder waveform (a fixed shape, not a recording).
  html = html.replace(/<svg data-wave><\/svg>/, () => {
    let bars = "";
    for (let i = 0; i < 100; i++) {
      const h = 8 + Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11) * 58) + (i % 7 === 0 ? 6 : 0);
      bars += '<rect' + (i < 34 ? ' class="lit"' : "") + ' x="' + i * 6 + '" y="' + (36 - h / 2).toFixed(1) + '" width="3" height="' + h.toFixed(1) + '" rx="1.5"/>';
    }
    return '<svg class="wave" viewBox="0 0 600 72" preserveAspectRatio="none" aria-hidden="true">' + bars + "</svg>";
  });

  // The archive: every published build as a ruled entry.
  html = html.replace(/<section class="archive-list" data-archive-list><\/section>/, () => {
    if (!visible.length) return '<section class="archive-list"><div class="chapter"><h2>I will add finished commissions here as they are completed and documented.</h2></div></section>';
    return '<ul class="build-list archive-list">' + visible.map((item) => '<li><a href="' + buildHref(item) + '" tabindex="-1" aria-hidden="true">' + mediaFrame(item.images?.[0], "small") + "</a><div>" + buildIdLine(item) + '<h3><a href="' + buildHref(item) + '">' + escapeHtml(item.name) + "</a></h3><p>" + escapeHtml(item.summary) + '</p><dl class="mini-specs">' + [["case", "Case"], ["switches", "Switches"], ["mount", "Mount"]].map(([k, l]) => "<div><dt>" + l + "</dt><dd>" + escapeHtml(item.specs?.[k] || "") + "</dd></div>").join("") + "</dl></div></li>").join("") + "</ul>";
  });

  const stories = content.STORIES || {};
  const soundSamples = Array.isArray(content.SOUND_SAMPLES) ? content.SOUND_SAMPLES : [];
  const compareOptions = content.COMPARE_OPTIONS || {};

  html = html.replace(/(<section class="guide-index" data-story-grid="([^"]+)">)[\s\S]*?(<\/section>)/g, (_, open, type, close) => open + renderStoryGrid(type, stories) + close);

  // Build records: every published record, the first shown; script.js switches to the one named by ?id=.
  html = html.replace(/<div class="records" data-build-records><\/div>/, () => '<div class="records">' + visible.map((item, n) => '<article class="record" data-record="' + escapeHtml(item.id) + '"' + (n ? " hidden" : "") + ">" + (n ? renderCommissionDetail(item, soundSamples).replace(/preload="metadata"/g, 'preload="none"') : renderCommissionDetail(item, soundSamples)) + "</article>").join("") + '<article class="record" data-record="none"' + (visible.length ? " hidden" : "") + '><section class="page-intro"><h1>This record is not published.</h1><p>I publish build records after the work is ready to document.</p></section></article></div>');

  html = html.replace(/(<div class="compare-audio" data-sound-player="(\d+)">)[\s\S]*?(<\/div>)/g, (_, open, index, close) => open + renderSoundPlayer(soundSamples[Number(index)] || soundSamples[0]) + close);

  const initialCompare = Array.isArray(compareOptions.stabilizer) ? compareOptions.stabilizer : [];
  const compareOptionHtml = initialCompare.map((item, index) => '<option value="' + index + '">' + escapeHtml(item[0]) + '</option>').join("");
  html = html.replace(/(<select id="compareOption[AB]" class="compare-option">)[\s\S]*?(<\/select>)/g, (_, open, close) => open + compareOptionHtml + close);
  html = html.replace(/(<p id="compareDesc[AB]" class="compare-desc">)[\s\S]*?(<\/p>)/g, (_, open, close) => open + escapeHtml(initialCompare[0]?.[1] || "") + close);

  html = html.replace(/(<div class="story-modal" id="storyModal" data-story-type="(\w+)"[\s\S]*?<h2 id="storyTitle">)[\s\S]*?(<\/h2><p id="storyIntro">)[\s\S]*?(<\/p><\/div><div id="storyContent" class="story-content">)[\s\S]*?(<\/div>)/g, (match, a, type, b, c, d) => {
    const first = Object.values(stories[type] || {})[0];
    if (!first) return match;
    return a + escapeHtml(first.title) + b + escapeHtml(first.intro) + c + renderStorySteps(first) + d;
  });
  // Built to Taste material library
  html = html.replace(/<dl class="material-list" data-materials><\/dl>/, () => '<dl class="material-list">' + (content.MATERIALS || []).map((m) => "<div><dt>" + escapeHtml(m.name) + "<small>" + escapeHtml(m.what) + "</small></dt><dd>" + escapeHtml(m.character) + "</dd></div>").join("") + "</dl>");

  return html;
}
// One header key: three rendered frames (idle, hover, pressed) stacked, with the legend as real text on the
// cap's top face. The current page's key shows pressed. Metrics come from src/static/data/header-keys.json.
function renderKey(item, page, headerKeys, extraClass = "", led = true) {
  const cap = headerKeys.caps[item.cap];
  if (!cap) fail(`header-keys.json: unknown cap "${item.cap}" for ${item.name}`);
  const [fx, fy] = cap.f.idle, [hx, hy] = cap.f["-hover"], [px, py] = cap.f["-press"];
  const style = `--w:${cap.w}px;--ml:-${cap.bl}px;--mr:-${cap.br}px;--fx:${fx}%;--fy:${fy}%;--fxh:${hx}%;--fyh:${hy}%;--fxp:${px}%;--fyp:${py}%`;
  const frames = ["", "-hover", "-press"]
    .map((s, i) => `<img${i ? ` class="${"hp"[i - 1]}"` : ""} src="/assets/keys/${item.cap}${s}.webp" alt="" width="${Math.round(cap.w)}" height="${cap.h || 74}">`)   // header renders share one 74px-tall plate band
    .join("");
  const current = page.activeNav === item.activeNav ? ' aria-current="page"' : "";
  const cls = `k${extraClass ? ` ${extraClass}` : ""}`;
  if (!led) {   // a page key: the legend is its visible, accessible text
    const open = item.type ? `<button class="${cls}" style="${style}" type="${item.type}">` : `<a class="${cls}" style="${style}" href="${item.href}">`;
    return `${open}${frames}<span class="legend">${item.legend}</span>${item.type ? "</button>" : "</a>"}`;
  }
  return `<a class="${cls}" style="${style}" href="${item.href}" aria-label="${escapeHtml(item.name)}"${current}><span class="halo" aria-hidden="true"></span><span class="under" aria-hidden="true"></span>${frames}<span class="legend glow-text" aria-hidden="true">${item.legend}</span><span class="legend" aria-hidden="true">${item.legend}</span></a>`;
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

// Homepage close: the rendered hub (screen off / on) with its cable, and the cable's centreline for the LED bead.
function renderHub() {
  const h = JSON.parse(read(path.join(SRC, "static", "data", "hub.json")));
  const img = (cls) => `<img class="${cls}" src="/assets/hub/${cls}.webp" alt="" width="${h.w}" height="${h.h}" loading="lazy" decoding="async">`;
  return `<div class="hub" data-hub style="aspect-ratio:${h.w}/${h.hubH}"><div class="hub-art" style="aspect-ratio:${h.w}/${h.h}">${img("hub-off")}${img("hub-on")}` +
    `<svg class="hub-led" viewBox="0 0 ${h.w} ${h.h}" aria-hidden="true"><defs><filter id="hub-soft"><feGaussianBlur stdDeviation="7"/></filter>` +
    `<mask id="hub-light-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${h.w}" height="${h.h}"><path class="hub-tail" d="${h.d}" filter="url(#hub-soft)"/><path class="hub-head" d="${h.d}" filter="url(#hub-soft)"/></mask></defs>` +
    `<image class="hub-light" href="/assets/hub/hub-glow.webp" width="${h.w}" height="${h.h}" mask="url(#hub-light-mask)"/><path class="hub-route" d="${h.d}"/></svg></div>` +
    `<p class="hub-line">The forge is lit. Pick a key, and I’ll meet you at the anvil.</p></div>`;
}

// Footer: a rendered keyboard whose linked words press on hover (desktop), and the same links as a list (phone).
function renderFooterBoard(data) {
  if (!data.w) fail("src/static/data/footer-board.json: no board size; run mockups/keys/board-export.py");
  const box = (r) => `left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%`;
  const ext = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "");
  const keys = Object.entries(data.keys).map(([id, k]) => {
    if (!k.hit || !k.h || !k.p) fail(`footer-board.json: key "${id}" has no boxes`);
    const img = (st) => `<img class="${st}" src="/assets/footer-board/${id}-${st}.webp" alt="" loading="lazy" decoding="async" style="${box(k[st])}">`;
    return `<a href="${k.href}" aria-label="${escapeHtml(k.name)}"${ext(k.href)}>${img("h")}${img("p")}<span class="hit" style="${box(k.hit)}"></span></a>`;
  });
  const list = data.list.map((id) => {
    const k = data.keys[id];
    if (!k) fail(`footer-board.json: list names unknown key "${id}"`);
    return `<li><a href="${k.href}"${ext(k.href)}>${escapeHtml(k.name)}</a></li>`;
  });
  return {
    board: `<img src="/assets/footer-board/board.webp" alt="" width="${data.w}" height="${data.h}" loading="lazy" decoding="async"><img class="lit" src="/assets/footer-board/board-lit.webp" alt="" loading="lazy" decoding="async">${keys.join("")}`,
    list: list.join(""),
    ratio: `${data.w}/${data.h}`,
  };
}

function renderPage(entry, partials, content, headerKeys, footerBoard) {
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
        ? "html,body{margin:0;background:#151A1A;color:#EEF0EC;min-height:100%;font-family:Alegreya,Georgia,serif}main{max-width:760px;margin:auto;padding:15vh 24px}a{color:#E8834D}"
        : "html,body{margin:0;background:#151A1A;color:#EEF0EC;min-height:100%}body{min-height:100vh}.site-header{background:#151A1A;color:#EEF0EC}.k{display:inline-grid;position:relative;color:#EEF0EC}.k img{grid-area:1/1}.k .h,.k .p{opacity:0}.k .legend{position:absolute}.k .halo,.k .under,.k .glow-text{opacity:0}.cable{display:none}",
      STYLESHEET_VERSION: config.stylesheetVersion,
    },
    `${label} head`,
  );

  const header = redirect
    ? ""
    : replaceTokens(
        partials.header,
        {
          NAV_KEYS: headerKeys.nav.map((item) => renderKey(item, page, headerKeys)).join(""),
          COMMISSION_KEY: renderKey(headerKeys.commission, page, headerKeys, "commission"),
        },
        `${label} header`,
      );
  const modeContent = (content.SITE_MODE_CONTENT || {})[content.SITE_MODE] || (content.SITE_MODE_CONTENT || {}).prelaunch || {};
  const footer = redirect
    ? ""
    : replaceTokens(
        partials.footer,
        {
          FOOTER_BOARD: footerBoard.board,
          FOOTER_LIST: footerBoard.list,
          BOARD_RATIO: footerBoard.ratio,
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
        : `<script src="/data/content.js?v=${config.stylesheetVersion}"></script><script src="/script.js?v=${config.stylesheetVersion}"></script>`,
    },
    `${label} scripts`,
  );

  let html = replaceTokens(template, { HEAD: head, HEADER: header, FOOTER: footer, SCRIPTS: scripts }, label);
  html = html.replace(/<yf-key([^>]*)>([\s\S]*?)<\/yf-key>/g, (_, attrs, legend) => {
    const attr = (name) => (attrs.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];
    return renderKey({ cap: attr("cap"), href: attr("href"), type: attr("type"), legend }, page, headerKeys, attr("class") || "", false);
  });
  html = html.replace(/<yf-hub><\/yf-hub>/g, () => renderHub());
  html = html.replace(/<yf-turnstile><\/yf-turnstile>/g, config.turnstileSiteKey
    ? `<div class="cf-turnstile wide" data-sitekey="${config.turnstileSiteKey}" data-theme="dark" data-appearance="interaction-only"></div><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
    : "");
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
  const headerKeys = JSON.parse(read(path.join(SRC, "static", "data", "header-keys.json")));
  const footerBoard = renderFooterBoard(JSON.parse(read(path.join(SRC, "static", "data", "footer-board.json"))));
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
    return [entry.page.output, renderPage(entry, partials, content, headerKeys, footerBoard)];
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
