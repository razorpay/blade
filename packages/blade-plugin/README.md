# Blade Plugin

Blade Design System for AI coding agents, packaged as a Claude Code plugin and as [Agent Skills](https://agentskills.io) that Cursor, Codex, Copilot and Gemini CLI can load.

It replaces the Blade MCP server for agents that support skills: no `npx` cold start, no tool schemas in every turn, and docs are read lazily per component.

## Skills

| Skill                 | What it does                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `blade`               | Guidelines for writing Blade UI code plus the full component, pattern and token knowledgebase in `references/` |
| `blade-upgrade`       | Slices the Blade changelog for a version or range and summarises breaking changes                             |
| `blade-new-project`   | Scaffolds a Vite + React + TypeScript app with Blade (user-invoked only)                                      |
| `blade-figma-to-code` | Converts a Figma frame to Blade code via Razorpay's internal backend (VPN required)                           |

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
```

Or, if you already run Blade MCP, ask it to `create_blade_skill`. Both put the skill at `.agents/skills/blade` with a `.claude/skills/blade` symlink.

## Hooks and telemetry

Hooks are dependency-free Node scripts and exit immediately in projects that do not depend on `@razorpay/blade`.

- `SessionStart`: nudges the agent to use the `blade` skill in Blade projects.
- `PostToolUse`: records edited files and Blade docs read this turn.
- `Stop`: sends one `Blade Plugin Tool Called` event to Segment with `git diff --numstat` counts for the edited files, replacing the MCP's model-reported lines-of-code metric. Set `BLADE_SEGMENT_KEY` to enable sending; nothing is sent without it.

## Development

See [AGENTS.md](./AGENTS.md).
