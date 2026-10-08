# blade-plugin — Agent Context

Claude Code plugin and cross-agent skills for the Blade Design System. Source of truth for the Blade knowledgebase.

## Package Structure

```
.claude-plugin/plugin.json   # Claude Code manifest (name "blade"); version mirrors package.json
.codex-plugin/plugin.json    # Codex manifest, byte-identical to the Claude one
hooks/                       # SessionStart nudge + telemetry (plain Node, no deps)
skills/
  blade/                     # Main skill. SKILL.md stays small; docs live in references/
    references/components/   # One <Component>.md per component + index.md (this is the knowledgebase)
    references/patterns/
    references/general/
    scripts/publish-metric.mjs # Port of the MCP publish_lines_of_code_metric tool
  blade-upgrade/             # Changelog slicing (scripts/changelog.mjs)
  blade-new-project/         # degit the base template
  blade-figma-to-code/       # Razorpay-internal figma-to-code backend
authoring/                   # Prompts used to generate component/pattern docs
scripts/validatePlugin.mjs   # Structural checks run in CI
```

## Rules

- Knowledgebase edits happen here. `packages/blade-mcp` copies `skills/blade/references` into its gitignored `knowledgebase/` at build time; never edit it there. Only the docs are shared: `SKILL.md`, scripts and analytics here never reach MCP users.
- When adding a component doc, also add it to the `## Available components` list in `skills/blade/SKILL.md` and regenerate `references/components/index.md` (one line from the doc's Description). `yarn validate:blade-plugin` fails otherwise.
- Every changeset that touches this package uses `'@razorpay/blade-mcp': patch|minor` (fixed version group); do not add a separate `@razorpay/blade-plugin` line.
- Do not bump versions by hand. `scripts/syncPluginManifestVersion.js` stamps plugin.json files and `SKILL.md` `metadata.version` from `package.json` during release.
- No symlinks, no `bin/`, forward slashes only. The plugin is installed by git checkout on macOS, Linux and Windows and by `npx skills add`, which copies only the skill directory.
- Skill scripts that send analytics keep an identical copy of `scripts/analytics.mjs` (a port of the MCP analytics utils) in their own skill directory; the validator fails if the copies differ.
- No `.mcp.json` here. Consumers of the MCP keep configuring it themselves during the overlap period.

## Quick Commands

| Task                         | Command (repo root)                                  |
| ---------------------------- | ---------------------------------------------------- |
| Validate plugin structure    | `yarn validate:blade-plugin`                         |
| Typecheck knowledgebase code | `yarn tsc:knowledgebase`                             |
| Check docs drift vs source   | `yarn check:knowledgebase-drift --fail`              |
| Try locally in Claude Code   | `claude --plugin-dir packages/blade-plugin`          |
| Sync manifest versions       | `node scripts/syncPluginManifestVersion.js`          |
