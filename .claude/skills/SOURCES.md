# Skills stored in this repo

Copied here so every Claude session loads them. Cloud sessions do not install the plugins that `.claude/settings.json` turns on, so the plugin entries there only take effect in a session on your own computer.

| What | Where | Source | License |
| --- | --- | --- | --- |
| Impeccable skill | `.claude/skills/impeccable/` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) `.claude/skills/impeccable/`, v4.5.0, engine 0.1.11 (commit `778c8a7`) | Apache 2.0 (`impeccable/LICENSE`, `impeccable/NOTICE.md`) |
| Impeccable helper agents (4) | `.claude/agents/impeccable-*.md` | same repo, `.claude/agents/` | Apache 2.0 |
| ponytail, ponytail-review, ponytail-audit, ponytail-debt | `.claude/skills/` | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) `skills/`, v5.0.0 (commit `b088b2d`) | MIT (`LICENSE-ponytail`) |

`frontend-design` is not copied: it is built into Claude sessions and is identical to the plugin's copy.

The copies are unmodified. To refresh one, re-copy its folder from the source at a newer version and update this table.

## What to know

- **Impeccable's engine.** The skill's launcher (`impeccable/scripts/impeccable`) runs a separate program that is not in this repo. The first time it runs in a session it downloads that program (about 18 MB) from the project's GitHub releases, checks it against the published checksum, and keeps it in `~/.impeccable/`. If the download is blocked, the skill falls back to reading `PRODUCT.md` directly.
- **Impeccable's hooks are not installed.** The plugin can also check every edit and run a pass at the end of each turn. That is off here. `/impeccable hooks on` turns it on for this project; `/impeccable hooks status` shows the state.
- **Ponytail's hooks are not installed.** As a plugin it switches itself on at the start of every session. Here `AGENTS.md` tells Claude to load it for coding work instead. `ponytail-help` and `ponytail-gain` are left out because they describe plugin-only settings and a benchmark.
- **`AGENTS.md` wins.** Both packs are general-purpose. Where one disagrees with `AGENTS.md` (palette, fonts, shadows, texture, copy, redesign), follow `AGENTS.md`.
