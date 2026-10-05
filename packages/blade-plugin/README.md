# Blade Plugin

Blade Design System for AI coding agents, packaged as a Claude Code plugin and as [Agent Skills](https://agentskills.io) that Cursor, Codex, Copilot and Gemini CLI can load.

It replaces the Blade MCP server for agents that support skills: no `npx` cold start, no tool schemas in every turn, and docs are read lazily per component.

## Skills

| Skill                 | What it does                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `blade`               | Guidelines for writing Blade UI code plus the full component, pattern and token knowledgebase in `references/` |
| `blade-svelte`        | The same for Svelte 5 apps on `@razorpay/blade-svelte`: setup, conventions and a doc per public component      |
| `blade-upgrade`       | Slices the Blade changelog for a version or range and summarises breaking changes                              |
| `blade-new-project`   | Scaffolds a Vite + React + TypeScript app with Blade (user-invoked only)                                       |
| `blade-figma-to-code` | Converts a Figma frame to Blade code via Razorpay's internal backend (VPN required)                            |

## Install

### Claude Code

Try it from a checkout of this repo:

```sh
claude --plugin-dir packages/blade-plugin
```

Marketplace distribution (a slim `razorpay/blade-plugin` repo synced from this package, plus the internal `razorpay-marketplace`) is tracked in the migration plan; install commands will be added here when it is live.

### Cursor, Codex, Copilot, Gemini CLI

```sh
npx skills add razorpay/blade --skill blade
# Svelte apps
npx skills add razorpay/blade --skill blade-svelte
```

Or, if you already run Blade MCP, ask it to `create_blade_skill`. Both put the skill at `.agents/skills/blade` with a `.claude/skills/blade` symlink.

## Telemetry

Same events as Blade MCP (`Blade MCP Tool Called`, with `protocol: "plugin"`), so existing dashboards include plugin usage:

- `publish_lines_of_code_metric`: the `blade` skill asks the agent to run `scripts/publish-metric.mjs` once after its edits, with the same arguments as the MCP tool. The line counts are reported by the agent, as with the MCP.
- `get_blade_changelog` and `get_figma_to_code`: sent by the `blade-upgrade` and `blade-figma-to-code` scripts.

The user id is the username from the project path, as in the MCP. Events are sent only when `BLADE_SEGMENT_KEY` is set; the MCP inlines the key at build time, but the plugin has no build step and the key is not committed to this repo. Set `BLADE_PLUGIN_DEBUG=1` to print each event to stderr.

## Hooks (measured telemetry)

Hooks are dependency-free Node scripts and exit immediately in projects that depend on neither `@razorpay/blade` nor `@razorpay/blade-svelte`.

- `SessionStart`: detects which Blade packages the project uses (from `package.json` and the lockfile) and nudges the agent to use `blade`, `blade-svelte` or both.
- `PreToolUse`: snapshots a code file just before the agent's first edit to it in a turn.
- `PostToolUse`: records edited files and the Blade docs read this turn from either skill, through the Read tool or shell commands such as `cat`.
- `Stop`: diffs each edited file against its snapshot (new files count in full), sends one `Blade Plugin Tool Called` event with measured line counts (separate from the agent-reported MCP-style metric above), then deletes the snapshots. Each turn reports only the agent's own changes, once. This replaces the MCP's model-reported lines-of-code metric.

Events go to Segment only when `BLADE_SEGMENT_KEY` is set; the key is not committed to this repo. Set `BLADE_PLUGIN_DEBUG=1` to also append every event to `events.log` in the plugin data directory (`$CLAUDE_PLUGIN_DATA`, or `$TMPDIR/blade-plugin`) to check the numbers locally. Session files older than 7 days are deleted automatically.

## Development

See [AGENTS.md](./AGENTS.md).
