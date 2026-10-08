#!/usr/bin/env node
// Runs after Claude edits a file (see .claude/settings.json). Rebuilds the site
// and runs scripts/site_check.py. Says nothing when both pass, so a passing
// check costs no tokens. On a failure it prints only the errors and exits 2,
// which is how a post-edit hook shows its message to Claude.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { relative, resolve } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const MAX_LINES = 40;

// Only source edits can change the built site.
let edited = "";
try {
  const file = JSON.parse(readFileSync(0, "utf8")).tool_input?.file_path;
  if (file) {
    edited = relative(root, resolve(root, file));
    const affectsSite = edited.startsWith("src/") || edited === "build.js" || edited === "scripts/site_check.py";
    if (!affectsSite) process.exit(0);
  }
} catch {
  // Unreadable input: run the check anyway.
}

function fail(title, text) {
  const lines = text.trim().split("\n");
  const shown = lines.slice(0, MAX_LINES);
  if (lines.length > MAX_LINES) shown.push(`...and ${lines.length - MAX_LINES} more lines. Run the command yourself for the rest.`);
  process.stderr.write(`${title}${edited ? ` after editing ${edited}` : ""}\n${shown.join("\n")}\n`);
  process.exit(2);
}

const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, encoding: "utf8" });

const build = run("node", ["build.js"]);
if (build.status !== 0) fail("node build.js failed", `${build.stdout}${build.stderr}` || String(build.error));

const check = run("python3", ["scripts/site_check.py"]);
if (check.status !== 0) {
  // Keep the status line and the errors; drop the warnings, which are not failures.
  const out = check.stdout || `${check.stderr}${check.error ?? ""}`;
  const status = out.split("\n").find((l) => l.startsWith("FAIL")) ?? "";
  const errors = out.split(/\nERRORS \(FIX THESE\)\n/)[1]?.split(/\nWARNINGS \(/)[0];
  fail("Site check failed", errors ? `${status}\n${errors}\nFix in src/, never in public/.` : out);
}
