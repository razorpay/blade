# blade-plugin — Agent Context

Claude Code plugin and cross-agent skills for the Blade Design System. Source of truth for the Blade knowledgebases (React and Svelte).

## Package Structure

```
.claude-plugin/plugin.json   # Claude Code manifest (name "blade"); version mirrors package.json
.codex-plugin/plugin.json    # Codex manifest, byte-identical to the Claude one
skills/
  blade/                     # React knowledgebase (@razorpay/blade). SKILL.md stays small; docs live in references/
    references/components/   # One <Component>.md per component + index.md
    references/patterns/
    references/general/
    scripts/publish-metric.mjs # Port of the MCP publish_lines_of_code_metric tool
  blade-svelte/              # Svelte knowledgebase (@razorpay/blade-svelte), same layout, no patterns yet
    references/components/
    references/general/      # Usage.md is Svelte-specific; the other general docs are copies of blade's
  blade-upgrade/             # Changelog slicing (scripts/changelog.mjs)
  blade-new-project/         # degit the base template
  blade-figma-to-code/       # Razorpay-internal figma-to-code backend
authoring/                   # Prompts used to generate component/pattern docs
scripts/validatePlugin.mjs   # Structural checks run in CI
```

## Rules

- Knowledgebase edits happen here. `packages/blade-mcp` copies `skills/blade` at build time; never edit `packages/blade-mcp/bladeSkill`. The MCP does not ship the Svelte knowledgebase.
- When adding a component doc, also add it to the `## Available components` list in that skill's `SKILL.md` and add a line to its `references/components/index.md` (one line from the doc's Description). `yarn validate:blade-plugin` fails otherwise.
- Svelte docs follow `authoring/svelte-components.prompt.txt`: types copied from `packages/blade-svelte/src/components/**/types.ts`, examples as ```svelte blocks using runes and imports from `@razorpay/blade-svelte/components`.
- `Tokens.md` and `WhiteLabelling.md` exist in both skills: the blade-svelte files are copies with a short Svelte note at the top. When you edit one, edit the other. `AvailableIcons.md` differs per skill (blade-svelte ships far fewer icons), and `ChartColorSystem.md` is React-only because blade-svelte has no charts.
- Changesets for this package use `'@razorpay/blade-plugin': patch|minor`. It versions independently of `@razorpay/blade-mcp`; add a `@razorpay/blade-mcp` line only when the React knowledgebase change should reach MCP users.
- Do not bump versions by hand. `scripts/syncPluginManifestVersion.js` stamps plugin.json files and every `SKILL.md` `metadata.version` from `package.json` during release.
- No symlinks, no `bin/`, forward slashes only. The plugin is installed by git checkout on macOS, Linux and Windows and by `npx skills add`, which copies only the skill directory.
- Skill scripts that send analytics keep an identical copy of `scripts/analytics.mjs` (a port of the MCP analytics utils) in their own skill directory; the validator fails if the copies differ.
- No `.mcp.json` here. Consumers of the MCP keep configuring it themselves during the overlap period.

## Quick Commands

| Task                              | Command (repo root)                                     |
| --------------------------------- | ------------------------------------------------------- |
| Validate plugin structure         | `yarn validate:blade-plugin`                            |
| Typecheck React knowledgebase     | `yarn tsc:knowledgebase`                                |
| Compile Svelte knowledgebase      | `yarn tsc:knowledgebase --target svelte`                |
| Check React docs drift vs source  | `yarn check:knowledgebase-drift --fail`                 |
| Check Svelte docs drift vs source | `yarn check:knowledgebase-drift --target svelte --fail` |
| Try locally in Claude Code        | `claude --plugin-dir packages/blade-plugin`             |
| Sync manifest versions            | `node scripts/syncPluginManifestVersion.js`             |
