# blade-plugin — Agent Context

Claude Code plugin and cross-agent skills for the Blade Design System. Source of truth for the Blade knowledgebase.

## Package Structure

```
.claude-plugin/plugin.json   # Claude Code manifest (name "blade"); version mirrors package.json
.codex-plugin/plugin.json    # Codex manifest, byte-identical to the Claude one
skills/
  blade/                     # Main skill. SKILL.md stays small; docs live in references/
    references/components/   # One <Component>.md per component + index.md (this is the knowledgebase)
    references/patterns/
    references/general/
    references/upgrade.md, new-project.md, figma-to-code.md # Workflows, ported from the MCP tools
    scripts/publish-metric.mjs # Port of the MCP publish_lines_of_code_metric tool
    scripts/changelog.mjs      # Changelog slicing for references/upgrade.md
    scripts/figma-to-code.mjs  # Razorpay-internal figma-to-code backend
authoring/                   # Prompts used to generate component/pattern docs
```

Structural checks run in CI live in the repo-root `scripts/validateBladePlugin.mjs`.

## Rules

- Knowledgebase edits happen here. `packages/blade-mcp` copies `skills/blade/references` into its gitignored `knowledgebase/` at build time; never edit it there. Only the docs are shared: `SKILL.md`, scripts and analytics here never reach MCP users.
- When adding a component doc, also add it to the `## Available components` list in `skills/blade/SKILL.md` and regenerate `references/components/index.md` (one line from the doc's Description). `yarn validate:blade-plugin` fails otherwise.
- Every changeset that touches this package uses `'@razorpay/blade-mcp': patch|minor` (fixed version group); do not add a separate `@razorpay/blade-plugin` line.
- Do not bump versions by hand. `scripts/syncPluginManifestVersion.js` stamps plugin.json files and `SKILL.md` `metadata.version` from `package.json` during release.
- Everything in this directory ships to Claude Code plugin users. Put repo tooling in the root `scripts/`, not here, so it does not clash with `skills/blade/scripts/`.
- No symlinks, no `bin/`, forward slashes only. The plugin is installed by git checkout on macOS, Linux and Windows and by `npx skills add`, which copies only the skill directory.
- Keep workflows as `references/*.md` in the `blade` skill rather than separate skills. Any new skill that sends analytics keeps an identical copy of `scripts/analytics.mjs` (a port of the MCP analytics utils) in its own directory; the validator fails if the copies differ.
- No `.mcp.json` here. Consumers of the MCP keep configuring it themselves during the overlap period.

## Quick Commands

| Task                         | Command (repo root)                         |
| ---------------------------- | ------------------------------------------- |
| Validate plugin structure    | `yarn validate:blade-plugin`                |
| Typecheck knowledgebase code | `yarn tsc:knowledgebase`                    |
| Check docs drift vs source   | `yarn check:knowledgebase-drift --fail`     |
| Try locally in Claude Code   | `claude --plugin-dir packages/blade-plugin` |
| Sync manifest versions       | `node scripts/syncPluginManifestVersion.js` |
