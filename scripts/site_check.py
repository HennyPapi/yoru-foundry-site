#!/usr/bin/env python3
"""
Yoru Foundry site check
=======================
Checks the BUILT site in ./public (generated from ./src by the assembler) for bugs
and rule breaks. Plain Python 3, nothing to install.

Run from the repo root, after building:
    python3 scripts/site_check.py                        # print the report
    python3 scripts/site_check.py --report report.md     # also save it as a file
    python3 scripts/site_check.py --phase 6              # pretend you're in another phase
    python3 scripts/site_check.py --strict               # warnings fail too

How phases work
---------------
Every finding is tagged:
  [Bug]      always an error (broken links, JS errors, duplicate ids, leaked secrets...)
  [Phase N]  an error once CURRENT_PHASE reaches N, a heads-up warning before that
  [Launch]   pre-launch checklist, always a warning
Bump CURRENT_PHASE below whenever a phase closes. Errors fail the GitHub Action.

Cream rule (Phase 14): each page has exactly one cream section. Cream buttons, links and
other small inline pieces don't count; a cream card inside a cream section counts once.

Escape hatch: put  /* site-check: ignore */  inside a CSS rule to skip its color checks and
leave it out of the cream count (for a small cream detail that isn't a surface). Use sparingly.
"""

import os
import re
import shutil
import subprocess
import sys
from collections import defaultdict
from hashlib import sha1
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

# ================================================================ settings
CURRENT_PHASE = 3.5                 # <- bump this when a phase closes
PUBLIC_DIR = "public"               # generated output (what Cloudflare serves)
SOURCE_DIR = "src"                  # where edits actually go
SITE_HOSTS = {"yorufoundry.com", "www.yorufoundry.com"}
THEME_TOKEN = "--night"             # <meta name="theme-color"> must equal this token
CRITICAL_STYLE_MARKER = "critical-yf-theme"
HERO_KEYWORD = "keyboard"           # Phase 7: homepage headline must contain this
MIN_CREAM_PER_PAGE = 1              # Phase 14: every page gets a cream section...
MAX_CREAM_PER_PAGE = 1              # ...and only one (cream cards count individually)
CREAM_EXTRA_SELECTORS = [".story-tile"]          # cream surfaces the checker can't detect on its own, e.g. [".process-card"]
IGNORE_MARKER = "site-check: ignore"

LIGHT_LUMINANCE = 0.5               # brighter than this = light surface
OVERLAY_ALPHA = 0.2                 # light colors under this opacity = texture overlay, allowed
BIG_IMAGE_KB = 500
BIG_VIDEO_MB = 15
PLACEHOLDER_PATTERNS = [r"lorem ipsum", r"\bTODO\b", r"\bFIXME\b", r"example\.com", r"your[-_ ]?handle"]
SOCIAL_HOSTS = ("instagram.com", "tiktok.com", "facebook.com", "youtube.com", "x.com", "twitter.com")
SKIP_SCHEMES = ("mailto:", "tel:", "sms:", "javascript:", "data:", "blob:")
RASTER_EXT = {".jpg", ".jpeg", ".png", ".gif"}
IMAGE_EXT = RASTER_EXT | {".webp", ".avif"}
VIDEO_EXT = {".mp4", ".webm", ".mov"}
STRAY_EXT = {".md", ".map", ".bak", ".orig", ".tmp", ".log", ".psd", ".ai", ".sketch", ".fig", ".zip"}
STRAY_DIRS = {"node_modules", ".git", "src", "partials", "_partials"}
TEXT_EXT = {".html", ".css", ".js", ".mjs", ".cjs", ".json", ".jsonc", ".md", ".txt", ".yml",
            ".yaml", ".toml", ".ts", ".xml", ".svg", ".env"}
SECRET_PATTERNS = [
    ("private key", r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    ("AWS key", r"AKIA[0-9A-Z]{16}"),
    ("API key (sk-...)", r"\bsk-[A-Za-z0-9_-]{20,}"),
    ("GitHub token", r"\b(?:ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,})"),
    ("Slack token", r"\bxox[abprs]-[A-Za-z0-9-]{10,}"),
    ("Google API key", r"\bAIza[0-9A-Za-z_-]{35}"),
]


# ================================================================ report
def phase_value(phase):
    try:
        return float(phase)
    except ValueError:
        return None


def phase_label(phase):
    return phase if phase in ("Bug", "Launch") else f"Phase {phase}"


def phase_sort(phase):
    if phase == "Bug":
        return -1
    if phase == "Launch":
        return 999
    return phase_value(phase)


class Report:
    def __init__(self, current):
        self.current = current
        self.items = []

    def error(self, phase, check, where, msg):
        pv = phase_value(phase)
        level = "WARNING" if (pv is not None and pv > self.current) else "ERROR"
        self.items.append((level, phase, check, where, msg))

    def warn(self, phase, check, where, msg):
        self.items.append(("WARNING", phase, check, where, msg))

    def count(self, level):
        return sum(1 for i in self.items if i[0] == level)

    def render(self, markdown=False, note=""):
        out = []
        e, w = self.count("ERROR"), self.count("WARNING")
        status = "PASS" if e == 0 else "FAIL"
        cur = f"{self.current:g}"
        if markdown:
            out += ["## Yoru Foundry site check", f"**{status}** | current phase {cur} | {e} error(s), {w} warning(s)"]
        else:
            out += ["Yoru Foundry site check", "=======================",
                    f"{status} | current phase {cur} | {e} error(s), {w} warning(s)"]
        if note:
            out.append(f"\n> {note}" if markdown else f"\nNOTE: {note}")
        for level in ("ERROR", "WARNING"):
            group = [i for i in self.items if i[0] == level]
            if not group:
                continue
            head = "Errors (fix these)" if level == "ERROR" else "Warnings (upcoming phases, launch checklist, minor)"
            out.append("")
            out.append(f"### {head}" if markdown else head.upper())
            by_check = defaultdict(list)
            for _, phase, check, where, msg in group:
                by_check[(phase, check)].append((where, msg))
            for (phase, check), entries in sorted(by_check.items(), key=lambda k: (phase_sort(k[0][0]), k[0][1])):
                tag = f"[{phase_label(phase)}] {check} ({len(entries)})"
                out.append(f"\n**{tag}**" if markdown else f"\n{tag}")
                for where, msg in entries[:40]:
                    loc = (f"`{where}` " if markdown else f"{where}  ") if where else ""
                    first, *rest = msg.split("\n")
                    out.append(f"- {loc}{first}")
                    out += [f"  - {line}" for line in rest]
                if len(entries) > 40:
                    out.append(f"- ...and {len(entries) - 40} more")
        if e == 0 and w == 0:
            out.append("\nAll clear.")
        return "\n".join(out) + "\n"


# ================================================================ color helpers
HEX_RE = re.compile(r"#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-fA-F\w-])")
RGB_RE = re.compile(r"rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+%?))?\s*\)", re.I)
COLOR_FN_RE = re.compile(r"\b(?:rgba?|hsla?|hwb|oklch|oklab|lch|lab)\([^()]*\)", re.I)
VAR_RE = re.compile(r"var\(\s*(--[\w-]+)")
URL_RE = re.compile(r"url\(\s*(?:\"[^\"]*\"|'[^']*'|(?:[^()]|\([^()]*\))*)\s*\)", re.I)
COLOR_PROPS = re.compile(r"^(color|background.*|border.*|outline.*|fill|stroke|box-shadow|text-shadow|"
                         r"caret-color|accent-color|text-decoration.*|column-rule.*|--.*)$")


def normalize_hex(h):
    h = h.lstrip("#").upper()
    alpha = 1.0
    if len(h) in (3, 4):
        if len(h) == 4:
            alpha = int(h[3] * 2, 16) / 255
        h = "".join(c * 2 for c in h[:3])
    elif len(h) == 8:
        alpha = int(h[6:], 16) / 255
        h = h[:6]
    return "#" + h, alpha


def rgb_parts(m):
    r, g, b = (int(m.group(i)) for i in (1, 2, 3))
    a = m.group(4)
    alpha = 1.0 if a is None else (float(a[:-1]) / 100 if a.endswith("%") else float(a))
    return r, g, b, alpha


def luminance(r, g, b):
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def strip_urls(value):
    return URL_RE.sub(" ", value)


def literal_colors(value):
    """(normalized '#RRGGBB', alpha, original text) for every hex/rgb literal."""
    v = strip_urls(value)
    found = []
    for m in HEX_RE.finditer(v):
        hx, a = normalize_hex(m.group(0))
        found.append((hx, a, m.group(0)))
    for m in RGB_RE.finditer(v):
        r, g, b, a = rgb_parts(m)
        found.append((f"#{r:02X}{g:02X}{b:02X}", a, m.group(0)))
    return found


def light_colors_in(value):
    hits = []
    for hx, a, text in literal_colors(value):
        r, g, b = (int(hx[i:i + 2], 16) for i in (1, 3, 5))
        if a >= OVERLAY_ALPHA and luminance(r, g, b) > LIGHT_LUMINANCE:
            hits.append(text)
    if re.search(r"\b(white|ivory|snow|linen|beige|whitesmoke|floralwhite|ghostwhite)\b", strip_urls(value), re.I):
        hits.append("named light color")
    return hits


def pure_bw_in(value):
    hits = [text for hx, a, text in literal_colors(value) if hx in ("#FFFFFF", "#000000") and a >= 0.99]
    for word in re.findall(r"\b(white|black)\b", strip_urls(value), re.I):
        hits.append(word)
    return hits


def hardcoded_in(value):
    v = strip_urls(value)
    return [m.group(0) for m in HEX_RE.finditer(v)] + [m.group(0) for m in COLOR_FN_RE.finditer(v)]


# ================================================================ CSS parsing
def blank_comments(css):
    return re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), css, flags=re.S)


def split_declarations(body):
    out, depth, quote, start = [], 0, None, 0
    for i, ch in enumerate(body):
        if quote:
            if ch == quote:
                quote = None
        elif ch in "\"'":
            quote = ch
        elif ch == "(":
            depth += 1
        elif ch == ")":
            depth = max(0, depth - 1)
        elif ch == ";" and depth == 0:
            out.append((body[start:i], start))
            start = i + 1
    out.append((body[start:], start))
    return out


def iter_rules(clean):
    stack, last, quote = [], 0, None
    for i, ch in enumerate(clean):
        if quote:
            if ch == quote:
                quote = None
            continue
        if ch in "\"'":
            quote = ch
        elif ch == "{":
            if stack:
                stack[-1][2] = True
            stack.append([clean[last:i].strip(), i + 1, False])
            last = i + 1
        elif ch == "}":
            if stack:
                sel, start, has_child = stack.pop()
                if not has_child:
                    yield sel, clean[start:i], start
            last = i + 1
        elif ch == ";" and not stack:
            last = i + 1


def line_of(text, offset):
    return text.count("\n", 0, offset) + 1


def iter_declarations(css):
    """(selector, prop, value, line, ignored)"""
    clean = blank_comments(css)
    for sel, body, off in iter_rules(clean):
        ignored = IGNORE_MARKER in css[off:off + len(body)]
        for decl, doff in split_declarations(body):
            if ":" not in decl:
                continue
            prop, value = decl.split(":", 1)
            prop = prop.strip().lower()
            if not prop or " " in prop:
                continue
            lead = len(decl) - len(decl.lstrip())
            yield sel, prop, value.strip(), line_of(css, off + doff + lead), ignored


def is_token_block(selector):
    s = selector.lower()
    return ":root" in s or s.startswith("@property")


class Tokens:
    def __init__(self, css_sources):
        self.all_defs = defaultdict(list)    # every custom property definition
        self.root_defs = defaultdict(list)   # only :root / @property definitions
        for css in css_sources:
            for sel, prop, value, _, _ in iter_declarations(css):
                if prop.startswith("--"):
                    self.all_defs[prop].append(value)
                    if is_token_block(sel):
                        self.root_defs[prop].append(value)

    def resolve(self, value, depth=0):
        """All literal strings a value can end up as, following var() chains."""
        results = [value]
        if depth < 8:
            for name in VAR_RE.findall(value):
                for d in self.all_defs.get(name, []):
                    results += self.resolve(d, depth + 1)
        return results

    def token_hexes(self):
        hexes = set()
        for defs in self.root_defs.values():
            for d in defs:
                for resolved in self.resolve(d):
                    hexes |= {hx for hx, _, _ in literal_colors(resolved)}
        return hexes

    def value_of(self, name):
        for d in self.root_defs.get(name, []):
            for resolved in self.resolve(d):
                cols = literal_colors(resolved)
                if cols:
                    return cols[0][0]
        return None


REPLACEMENT_FOCUS = re.compile(r"(?:^|[;{\s])(border(?:-[\w-]+)?|box-shadow|outline-offset|outline-color)\s*:\s*(?!none\b|0\b|transparent\b)[^;}]+", re.I)


def focus_has_replacement(css, selector):
    target = " ".join(selector.split())
    return any(" ".join(sel.split()) == target and REPLACEMENT_FOCUS.search(body)
               for sel, body, _ in iter_rules(blank_comments(css)))


def check_css(css, where, tokens, report, line_offset=0, is_file=True):
    for sel, prop, value, line, ignored in iter_declarations(css):
        loc = f"{where}:{line + line_offset}"
        shown = "(inline style)" if sel == "__inline__" else " ".join(sel.split())
        if ignored:
            continue
        if COLOR_PROPS.match(prop):
            bw = pure_bw_in(value)
            if bw:
                report.error("1", "Pure white or black (Phase 1 rule)", loc,
                             f"{shown} -> {prop}: {', '.join(dict.fromkeys(bw))}")
        if (is_file or sel == "__inline__") and not is_token_block(sel) and COLOR_PROPS.match(prop):
            hc = hardcoded_in(value)
            if hc:
                report.error("3", "Hardcoded color outside :root tokens", loc,
                             f"{shown} -> {prop}: {', '.join(dict.fromkeys(hc))}")
        if prop in ("outline", "outline-style", "outline-width") and re.match(r"^(none|0(px)?)\b", value) \
                and ":focus" in sel and ":not(:focus-visible)" not in sel \
                and not focus_has_replacement(css, sel):
            report.error("3", "Focus ring removed with no replacement", loc,
                         f"{shown} -> {prop}: {value} (no border or box-shadow on focus either)")


# ================================================================ cream counting
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
NOT_SURFACES = {"a", "button", "span", "input", "label", "select", "textarea", "small", "strong", "em", "i",
                "b", "img", "svg", "path", "code", "mark", "sup", "sub", "abbr", "time", "option", "html", "body",
                "header", "nav", "footer"}   # site chrome isn't a content section
ATTR_RE = re.compile(r"""\[\s*([\w-]+)\s*(?:([~]?=)\s*["']?([^"'\]]*)["']?)?\s*\]""")


def is_light_bg(prop, value, tokens):
    if prop not in ("background", "background-color", "background-image"):
        return False
    return any(light_colors_in(r) for r in tokens.resolve(value))


def cream_selectors(css, tokens):
    """Simple selectors (tag/classes/ids) whose rule paints a cream background."""
    out = []
    for sel, prop, value, _, ignored in iter_declarations(css):
        if ignored or is_token_block(sel) or sel.startswith("@") or not is_light_bg(prop, value, tokens):
            continue
        for part in sel.split(","):
            part = re.sub(r"\s*([>+~])\s*", r" \1 ", part.strip())
            last = re.split(r"\s+(?![^\[]*\])", part)[-1]
            attrs = tuple(ATTR_RE.findall(last))
            bare = ATTR_RE.sub("", last)
            if not last or ":" in bare or "[" in bare:
                continue    # hover/focus states and pseudo-elements aren't surfaces
            tag = re.match(r"^[a-zA-Z][\w-]*", bare)
            tag = tag.group(0).lower() if tag else None
            classes, ids = frozenset(re.findall(r"\.([\w-]+)", bare)), frozenset(re.findall(r"#([\w-]+)", bare))
            if (tag or classes or ids or attrs) and tag not in NOT_SURFACES:
                out.append((tag, classes, ids, attrs))
    return out


def attr_matches(attrs, name, op, val):
    if name not in attrs:
        return False
    have = attrs[name] or ""
    if op == "=":
        return have == val
    if op == "~=":
        return val in have.split()
    return True


class CreamCounter(HTMLParser):
    """Counts outermost cream surfaces on a page."""
    def __init__(self, selectors, tokens):
        super().__init__(convert_charrefs=True)
        self.selectors, self.tokens = selectors, tokens
        self.stack, self.found = [], []

    def handle_starttag(self, tag, attrs):
        if tag in VOID_TAGS:
            return
        a = dict(attrs)
        classes, id_ = set((a.get("class") or "").split()), a.get("id")
        cream = False
        if tag not in NOT_SURFACES:
            cream = any((t is None or t == tag) and c <= classes and (not i or id_ in i)
                        and all(attr_matches(a, name, op, val) for name, op, val in at)
                        for t, c, i, at in self.selectors)
            if not cream and a.get("style"):
                cream = any(is_light_bg(pr, v, self.tokens) for _, pr, v, _, _ in iter_declarations("x{" + a["style"] + "}"))
        in_chrome = any(t in ("header", "nav", "footer") for t, _ in self.stack)
        if cream and not in_chrome and not any(c for _, c in self.stack):
            self.found.append((tag + "".join("." + c for c in sorted(classes)[:2]), self.getpos()[0]))
        self.stack.append((tag, cream))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break


# ================================================================ HTML parsing
class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = defaultdict(list)
        self.refs, self.stylesheets, self.inline_styles = [], [], []
        self.style_blocks = []          # (css, line, starttag_text)
        self.images, self.media, self.form_actions = [], [], []
        self.meta, self.title, self.h1 = {}, "", None
        self.text_chunks = []
        self._title = self._style = False
        self._h1_depth = 0
        self._h1_buf = []
        self._buf, self._line, self._tag = [], 0, ""
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if a.get("id"):
            self.ids[a["id"]].append(line)
        if a.get("style"):
            self.inline_styles.append((a["style"], line))
        if tag == "title":
            self._title = True
        if tag == "style":
            self._style, self._buf, self._line, self._tag = True, [], line, self.get_starttag_text() or ""
        if tag in ("script", "noscript"):
            self._skip += 1
        if tag == "h1" and self.h1 is None:
            self._h1_depth = 1
        if tag == "meta":
            key = (a.get("name") or a.get("property") or "").lower()
            if key:
                self.meta[key] = a.get("content") or ""
        if tag == "link" and a.get("href"):
            rel = (a.get("rel") or "").lower()
            if "stylesheet" in rel:
                self.stylesheets.append(a["href"])
            if "preconnect" not in rel and "dns-prefetch" not in rel:
                self.refs.append(("link", a["href"], line))
        if tag == "a" and a.get("href") is not None:
            self.refs.append(("a", a["href"], line))
        if tag in ("img", "source", "video", "audio", "script", "iframe", "track") and a.get("src"):
            self.refs.append((tag, a["src"], line))
        if tag == "video" and a.get("poster"):
            self.refs.append(("poster", a["poster"], line))
        if a.get("srcset"):
            for part in a["srcset"].split(","):
                if part.strip():
                    self.refs.append((tag, part.strip().split()[0], line))
        if tag == "img":
            self.images.append((a.get("src", ""), "alt" in a, line))
        if tag in ("audio", "video"):
            self.media.append((tag, "autoplay" in a, "muted" in a, line))
        if tag == "form":
            self.form_actions.append((a.get("action") or "", line))

    def handle_endtag(self, tag):
        if tag == "title":
            self._title = False
        if tag == "style" and self._style:
            self._style = False
            self.style_blocks.append(("".join(self._buf), self._line, self._tag))
        if tag in ("script", "noscript"):
            self._skip = max(0, self._skip - 1)
        if tag == "h1" and self._h1_depth:
            self._h1_depth = 0
            self.h1 = " ".join("".join(self._h1_buf).split())

    def handle_data(self, data):
        if self._title:
            self.title += data
        if self._style:
            self._buf.append(data)
        elif not self._skip:
            self.text_chunks.append(data)
            if self._h1_depth:
                self._h1_buf.append(data)


# ================================================================ helpers
def rel(path):
    return os.path.relpath(path).replace(os.sep, "/")


def resolve_local(url, page_path, public_root):
    url = url.strip()
    if not url or url.startswith(SKIP_SCHEMES):
        return None
    parts = urlsplit(url)
    if parts.scheme in ("http", "https") or url.startswith("//"):
        if parts.hostname not in SITE_HOSTS:
            return None
    path = unquote(parts.path)
    if not path:
        return [page_path], parts.fragment
    base = public_root if path.startswith("/") else os.path.dirname(page_path)
    target = os.path.normpath(os.path.join(base, path.lstrip("/")))
    if path.endswith("/"):
        return [os.path.join(target, "index.html")], parts.fragment
    cands = [target]
    if not os.path.splitext(target)[1]:
        cands += [target + ".html", os.path.join(target, "index.html")]
    return cands, parts.fragment


ACTIVE_WORD = re.compile(r"(active|current|selected)", re.I)


def normalized_block(raw, tag):
    m = re.search(rf"<{tag}\b[^>]*>.*?</{tag}>", raw, re.S | re.I)
    if not m:
        return None
    s = m.group(0)
    s = re.sub(r'\s(aria-current|aria-selected)(="[^"]*")?', "", s)
    s = re.sub(r'\sdata-[\w-]*(active|current|page)[\w-]*(="[^"]*")?', "", s)
    s = re.sub(r'class="([^"]*)"', lambda c: 'class="' + " ".join(
        w for w in c.group(1).split() if not ACTIVE_WORD.search(w)) + '"', s)
    s = re.sub(r'\sclass=""', "", s)
    s = re.sub(r"(©|&copy;)\s*\d{4}", "©YEAR", s)
    s = " ".join(s.split())
    return re.sub(r"\s+(/?>)", r"\1", s)


def first_difference(a, b, width=70):
    i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
    start = max(0, i - 20)
    return a[start:start + width], b[start:start + width]


def check_variants(pages, tag, phase, label, report):
    groups = defaultdict(list)
    for p, (_, raw) in pages.items():
        norm = normalized_block(raw, tag)
        if norm:
            groups[norm].append(os.path.basename(p))
    if len(groups) > 1:
        ordered = sorted(groups.items(), key=lambda kv: len(kv[1]), reverse=True)
        base = ordered[0][0]
        desc = "; ".join(
            f"variant {chr(65 + i)} ({len(g)} page{'s' if len(g) > 1 else ''}: {', '.join(sorted(g)[:6])}"
            f"{', ...' if len(g) > 6 else ''})" for i, (_, g) in enumerate(ordered))
        details = []
        for i, (norm, g) in enumerate(ordered[1:], start=1):
            a, b = first_difference(base, norm)
            details.append(f"variant {chr(65 + i)} first differs from A here -> A: ...{a}...  |  {chr(65 + i)}: ...{b}...")
        report.error(phase, f"{label} markup differs between pages", "",
                     f"{len(groups)} variants -> {desc}\n" + "\n".join(details))


# ================================================================ main
def main():
    args = sys.argv[1:]
    strict = "--strict" in args
    report_path = args[args.index("--report") + 1] if "--report" in args else None
    current = float(args[args.index("--phase") + 1]) if "--phase" in args else CURRENT_PHASE
    current = float(os.environ.get("SITE_PHASE", current))

    root = os.path.abspath(PUBLIC_DIR)
    if not os.path.isdir(root):
        hint = " Run the build first (the same command Cloudflare uses) so it exists." if os.path.isdir(SOURCE_DIR) else ""
        print(f"Can't find ./{PUBLIC_DIR}.{hint} Run this from the repo root.")
        return 2

    report = Report(current)
    note = (f"Line numbers point to generated files in {PUBLIC_DIR}/. Make fixes in the matching "
            f"{SOURCE_DIR}/ page or partial, never in {PUBLIC_DIR}/.") if os.path.isdir(SOURCE_DIR) else ""

    all_files = []
    for dirpath, dirnames, files in os.walk(root):
        for d in list(dirnames):
            if d in STRAY_DIRS:
                report.error("13", "Folder that shouldn't be public", rel(os.path.join(dirpath, d)), "served to the world")
        all_files += [os.path.join(dirpath, f) for f in files]

    pages, fragments = {}, []
    for p in sorted(f for f in all_files if f.endswith(".html")):
        with open(p, encoding="utf-8", errors="replace") as fh:
            raw = fh.read()
        if not re.search(r"<html\b|<!doctype", raw, re.I):
            fragments.append(p)
            continue
        parser = PageParser()
        parser.feed(raw)
        pages[p] = (parser, raw)
    css_text = {}
    for p in sorted(f for f in all_files if f.endswith(".css")):
        with open(p, encoding="utf-8", errors="replace") as fh:
            css_text[p] = fh.read()
    js_files = sorted(f for f in all_files if f.endswith((".js", ".mjs")))

    def is_critical(block):
        css, _, starttag = block
        return CRITICAL_STYLE_MARKER in starttag or CRITICAL_STYLE_MARKER in css

    other_blocks = [b[0] for parser, _ in pages.values() for b in parser.style_blocks if not is_critical(b)]
    tokens = Tokens(list(css_text.values()) + other_blocks)
    token_hexes = tokens.token_hexes()
    theme_value = tokens.value_of(THEME_TOKEN)

    # ---------- stylesheets
    motion_used = reduced_motion = False
    for p, css in css_text.items():
        check_css(css, rel(p), tokens, report)
        clean = blank_comments(css)
        motion_used |= bool(re.search(r"\b(transition|animation)\s*:|@keyframes", clean))
        reduced_motion |= "prefers-reduced-motion" in clean
        for m in URL_RE.finditer(clean):
            u = m.group(0)[4:-1].strip().strip("\"'").strip()
            if u.lower().startswith("data:"):
                continue
            res = resolve_local(u, p, root)
            if res and not any(os.path.isfile(c) for c in res[0]):
                report.error("Bug", "Missing file referenced in CSS", f"{rel(p)}:{line_of(css, m.start())}", u)

    # ---------- pages
    versions, linked_from, titles = {}, defaultdict(set), defaultdict(list)
    has_critical = {}
    for p, (parser, raw) in pages.items():
        name = rel(p)
        is_404 = os.path.basename(p) == "404.html"

        crit = [b for b in parser.style_blocks if is_critical(b)]
        has_critical[name] = bool(crit) or CRITICAL_STYLE_MARKER in raw
        for css, line, _ in parser.style_blocks:
            check_css(css, name, tokens, report, line_offset=line - 1, is_file=False)
        for css, line in parser.inline_styles:
            check_css("__inline__{" + css + "}", name, tokens, report, line_offset=line - 1, is_file=False)
        if token_hexes:
            for css, line, _ in crit:
                stale = [t for hx, _, t in literal_colors(css) if hx not in token_hexes]
                if stale:
                    report.error("3.5", "First-paint color doesn't match any token (flash on load)",
                                 f"{name}:{line}", ", ".join(dict.fromkeys(stale)))

        tc = parser.meta.get("theme-color", "")
        if tc and theme_value:
            tc_cols = literal_colors(tc)
            if not tc_cols or tc_cols[0][0] != theme_value:
                report.error("3.5", "theme-color doesn't match the night token", name,
                             f"meta says {tc}, {THEME_TOKEN} is {theme_value}")
        if not tc and not is_404:
            report.error("3.5", "Missing theme-color meta", name, "browser chrome may flash the wrong color")

        sheets = [s for s in parser.stylesheets if urlsplit(s).hostname in (None, *SITE_HOSTS)]
        if not sheets:
            report.error("Bug", "Page loads no stylesheet", name, "")
        else:
            versions[name] = " + ".join(sorted(sheets))

        for id_, lines in parser.ids.items():
            if len(lines) > 1:
                report.error("Bug", "Duplicate id (breaks scripts and anchors)", name,
                             f'id="{id_}" appears {len(lines)}x (lines {", ".join(map(str, lines))})')

        for kind, url, line in parser.refs:
            u = url.strip()
            if u in ("", "#"):
                if kind == "a":
                    report.warn("Launch", "Placeholder link (href=\"#\" or empty)", f"{name}:{line}", "goes nowhere")
                continue
            host = (urlsplit(u).hostname or "").lower()
            if kind == "a" and any(host.endswith(s) for s in SOCIAL_HOSTS) and not urlsplit(u).path.strip("/"):
                report.warn("Launch", "Social link has no account", f"{name}:{line}", u)
            res = resolve_local(u, p, root)
            if res is None:
                continue
            cands, frag = res
            hit = next((c for c in cands if os.path.isfile(c)), None)
            if not hit:
                report.error("Bug", "Broken link or missing file", f"{name}:{line}", u)
                continue
            if hit.endswith(".html") and hit != p:
                linked_from[hit].add(p)
            if frag and hit in pages and frag not in pages[hit][0].ids and frag != "top":
                report.warn("Bug", "Anchor points to a missing id", f"{name}:{line}", u)

        for src, has_alt, line in parser.images:
            if not has_alt:
                report.warn("Launch", "Image without alt text", f"{name}:{line}", src or "(no src)")
        for tag, autoplay, muted, line in parser.media:
            if autoplay and not muted:
                report.error("8", "Autoplay with sound (blocked on iPhone)", f"{name}:{line}", f"<{tag} autoplay>")
        for action, line in parser.form_actions:
            if action.lower().startswith("mailto:"):
                report.error("10", "Form sends through mailto", f"{name}:{line}", action)

        text = " ".join(parser.text_chunks)
        for pat in PLACEHOLDER_PATTERNS:
            m = re.search(pat, text, re.I)
            if m:
                report.warn("Launch", "Placeholder text on page", name, f"'{m.group(0)}'")

        if os.path.basename(p) == "index.html" and os.path.dirname(p) == root:
            if not parser.h1:
                report.error("7", "Homepage has no <h1>", name, "")
            elif HERO_KEYWORD not in parser.h1.lower():
                report.error("7", f"Hero headline doesn't say '{HERO_KEYWORD}s'", name, f"'{parser.h1}'")

        if not is_404:
            t = " ".join(parser.title.split())
            if t:
                titles[t].append(name)
            else:
                report.warn("Launch", "Missing <title>", name, "")
            if not parser.meta.get("description"):
                report.warn("Launch", "Missing meta description", name, "")
            if not parser.meta.get("og:image"):
                report.warn("Launch", "Missing social preview image (og:image)", name, "")

    # ---------- site-wide
    if any(has_critical.values()):
        for name, ok in sorted(has_critical.items()):
            if not ok and not name.endswith("404.html"):
                report.error("3.5", "Missing first-paint style", name, f"no '{CRITICAL_STYLE_MARKER}' block")
    elif pages:
        report.warn("Bug", "First-paint style not found on any page", "",
                    f"update CRITICAL_STYLE_MARKER in site_check.py if it was renamed")

    if versions:
        common = max(set(versions.values()), key=list(versions.values()).count)
        for name, v in sorted(versions.items()):
            if v != common:
                report.error("Bug", "Stylesheet link differs from other pages (stale CSS risk)", name,
                             f"{v}  vs most pages: {common}")

    if css_text and not theme_value:
        report.warn("Bug", "Night token not found", "", f"{THEME_TOKEN} isn't defined in :root; update THEME_TOKEN in site_check.py")
    check_variants(pages, "footer", "3.5", "Footer", report)   # pulled forward from Phase 9
    check_variants(pages, "header", "6", "Header", report)

    cream_sels = cream_selectors("".join(f"{sel} {{ background: #F2EFE8; }}\n" for sel in CREAM_EXTRA_SELECTORS),
                                 Tokens([]))
    for css in list(css_text.values()) + [b[0] for parser, _ in pages.values() for b in parser.style_blocks]:
        cream_sels += cream_selectors(css, tokens)
    for p, (_, raw) in pages.items():
        if os.path.basename(p) == "404.html":
            continue
        counter = CreamCounter(cream_sels, tokens)
        counter.feed(raw)
        n = len(counter.found)
        if n < MIN_CREAM_PER_PAGE or n > MAX_CREAM_PER_PAGE:
            rule = (f"exactly {MIN_CREAM_PER_PAGE}" if MIN_CREAM_PER_PAGE == MAX_CREAM_PER_PAGE
                    else f"{MIN_CREAM_PER_PAGE}-{MAX_CREAM_PER_PAGE}")
            where = ", ".join(f"{d} (line {l})" for d, l in counter.found[:6]) or "none"
            report.error("14", "Cream sections per page", rel(p), f"{n} found, rule is {rule}: {where}")

    for t, names in titles.items():
        if len(names) > 1:
            report.warn("Launch", "Same <title> on several pages", ", ".join(names), f"'{t}'")

    index = os.path.join(root, "index.html")
    for p in pages:
        if p != index and os.path.basename(p) != "404.html" and not linked_from.get(p):
            report.error("13", "Page nothing links to (orphan)", rel(p), "link it or delete it")
    for p in fragments:
        report.error("13", "HTML fragment in public (leaked partial?)", rel(p), "not a full page but still served")

    for p in all_files:
        base, ext = os.path.basename(p), os.path.splitext(p)[1].lower()
        if ext in STRAY_EXT or base == ".DS_Store" or base.endswith("~") or base.startswith(".env"):
            report.error("13", "File that shouldn't be public", rel(p), "served to anyone who guesses the URL")
        size = os.path.getsize(p)
        if ext in IMAGE_EXT and size > BIG_IMAGE_KB * 1024:
            report.error("12", f"Image over {BIG_IMAGE_KB} KB", rel(p), f"{size // 1024} KB")
        if ext in RASTER_EXT and "icon" not in base.lower():
            report.error("12", "Image not in WebP/AVIF", rel(p), ext)
        if ext in VIDEO_EXT and size > BIG_VIDEO_MB * 1024 * 1024:
            report.error("12", f"Video over {BIG_VIDEO_MB} MB", rel(p), f"{size // (1024 * 1024)} MB")

    js_text = ""
    for p in js_files:
        with open(p, encoding="utf-8", errors="replace") as fh:
            src = fh.read()
        js_text += src
        if "mailto:" in src:
            report.error("10", "Form sends through mailto", rel(p), "script builds a mailto: link")
    motion_used |= bool(re.search(r"lenis|IntersectionObserver|\.animate\(", js_text, re.I))
    reduced_motion |= "prefers-reduced-motion" in js_text
    if motion_used and not reduced_motion:
        report.error("11", "No reduced-motion guard", "", "motion exists but nothing checks prefers-reduced-motion")

    if shutil.which("node"):
        for p in js_files:
            r = subprocess.run(["node", "--check", p], capture_output=True, text=True)
            if r.returncode != 0:
                lines = r.stderr.strip().splitlines()
                where = rel(p)
                m = re.search(r":(\d+)\s*$", lines[0]) if lines else None
                if m:
                    where += ":" + m.group(1)
                report.error("Bug", "JavaScript syntax error", where,
                             next((l.strip() for l in lines if "Error" in l), "syntax error"))

    if not os.path.isfile(os.path.join(root, "404.html")):
        report.warn("Launch", "No custom 404 page", f"{PUBLIC_DIR}/404.html", "broken links show a blank error")
    if os.path.isfile("wrangler.jsonc"):
        with open("wrangler.jsonc", encoding="utf-8") as fh:
            if "not_found_handling" not in fh.read():
                report.warn("Launch", "404 page not enabled", "wrangler.jsonc",
                            'add "not_found_handling": "404-page" inside "assets"')
    for f in ("robots.txt", "sitemap.xml"):
        if not os.path.isfile(os.path.join(root, f)):
            report.warn("Launch", f"No {f}", f"{PUBLIC_DIR}/{f}", "")

    # ---------- secrets anywhere in the (public) repo
    me = os.path.abspath(__file__)
    for dirpath, dirnames, files in os.walk("."):
        dirnames[:] = [d for d in dirnames if d not in (".git", "node_modules")]
        for f in files:
            p = os.path.join(dirpath, f)
            if os.path.abspath(p) == me:
                continue
            if f.startswith(".env") and not f.endswith((".example", ".sample")):
                report.error("Bug", "Secrets file in the repo", rel(p), "the repo is public; delete it and rotate the keys")
                continue
            if os.path.splitext(f)[1].lower() not in TEXT_EXT or os.path.getsize(p) > 2_000_000:
                continue
            with open(p, encoding="utf-8", errors="replace") as fh:
                content = fh.read()
            for label, pat in SECRET_PATTERNS:
                for m in re.finditer(pat, content):
                    report.error("Bug", "Possible leaked secret", f"{rel(p)}:{line_of(content, m.start())}",
                                 f"{label} ({m.group(0)[:6]}...). The repo is public; rotate it")

    # ---------- output
    print(report.render(note=note))
    md = report.render(markdown=True, note=note)
    if report_path:
        with open(report_path, "w", encoding="utf-8") as fh:
            fh.write(md)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as fh:
            fh.write(md)
    failed = report.count("ERROR") > 0 or (strict and report.count("WARNING") > 0)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
