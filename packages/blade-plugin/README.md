# Blade Plugin

Blade Design System for AI coding agents, packaged as a Claude Code plugin and as [Agent Skills](https://agentskills.io) that Cursor, Codex, Copilot and Gemini CLI can load.

It replaces the Blade MCP server for agents that support skills: no `npx` cold start, no tool schemas in every turn, and docs are read lazily per component.

## Skills

| Skill   | What it does                                                                                                                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blade` | Guidelines for writing Blade UI code, the full component, pattern and token knowledgebase in `references/`, and workflows for upgrading Blade, scaffolding a new app and Figma-to-code (VPN required) |

## Install

### Claude Code

```sh
claude plugin marketplace add https://github.com/razorpay/claude-plugins.git
claude plugin install blade@razorpay-marketplace
```

Or try it from a checkout of this repo:

```sh
claude --plugin-dir packages/blade-plugin
```

### Cursor, Codex, Copilot, Gemini CLI

```sh
npx skills add razorpay/blade --skill blade
```

Or, if you already run Blade MCP, ask it to `create_blade_skill`. Both put the skill at `.agents/skills/blade` with a `.claude/skills/blade` symlink.

## Telemetry

Skills send the same events as Blade MCP tools, under their own event name `Blade Plugin Tool Called` (the MCP sends `Blade MCP Tool Called`), so plugin and MCP usage never mix. `toolName` keeps the MCP tool name, `skillName` says which skill sent it and `framework` is `react`:

- `publish_lines_of_code_metric`: the `blade` skill asks the agent to run `scripts/publish-metric.mjs` once after its edits, with the same arguments as the MCP tool. The line counts are reported by the agent, as with the MCP.
- `get_blade_changelog` and `get_figma_to_code`: sent by `scripts/changelog.mjs` and `scripts/figma-to-code.mjs`.

The user id is the username from the project path, as in the MCP. The Segment write key is inlined in `scripts/analytics.mjs`, the same key the MCP inlines at build time. Set `BLADE_SEGMENT_KEY` to override it, or to an empty string to turn analytics off. Set `BLADE_PLUGIN_DEBUG=1` to print each event to stderr.

## Hooks

`SessionStart` detects whether the project uses `@razorpay/blade` (from `package.json` and the lockfile) and tells the agent to use the `blade` skill. It is a dependency-free Node script, prints nothing in projects that do not use `@razorpay/blade` (a `@razorpay/blade-svelte` app whose lockfile pulls in `@razorpay/blade` transitively is not nudged), and sends no telemetry.

## Development

See [AGENTS.md](./AGENTS.md).
