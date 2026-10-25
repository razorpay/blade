# blade-plugin — Agent Context

Claude Code plugin and cross-agent skills for the Blade Design System. Source of truth for the Blade knowledgebases (React and Svelte).

## Package Structure

```
.claude-plugin/plugin.json   # Claude Code manifest (name "blade"); version mirrors package.json
.codex-plugin/plugin.json    # Codex manifest, byte-identical to the Claude one
hooks/                       # SessionStart framework detection + skill nudge (plain Node, no deps)
skills/
  blade/                     # React knowledgebase (@razorpay/blade). SKILL.md stays small; docs live in references/
    references/components/   # One <Component>.md per component + index.md
    references/patterns/
    references/general/
    references/upgrade.md, new-project.md, figma-to-code.md # Workflows, ported from the MCP tools
    scripts/publish-metric.mjs # Port of the MCP publish_lines_of_code_metric tool
    scripts/changelog.mjs      # Changelog slicing for references/upgrade.md
    scripts/figma-to-code.mjs  # Razorpay-internal figma-to-code backend
  blade-svelte/              # Svelte knowledgebase (@razorpay/blade-svelte)
    references/components/   # One <Component>.md per component family + index.md
    references/general/      # Usage, Styling, Theming, Adapters, Composing, AvailableIcons
    scripts/                 # Identical copies of blade's analytics.mjs and publish-metric.mjs
authoring/                   # Prompts used to generate component/pattern docs
```

Structural checks run in CI live in the repo-root `scripts/validateBladePlugin.mjs`.

## Rules

- Knowledgebase edits happen here. `packages/blade-mcp` copies `skills/blade/references` into its gitignored `knowledgebase/` at build time; never edit it there. Only the docs are shared: `SKILL.md`, scripts and analytics here never reach MCP users.
- When adding a component doc, also add it to the `## Available components` list in that skill's `SKILL.md` and regenerate `references/components/index.md` (one line from the doc's Description). `yarn validate:blade-plugin` fails otherwise.
- Svelte docs follow `authoring/svelte-components.prompt.txt`: props from each component's `$props()` type (the drift check reads the same), examples as ```svelte blocks using runes, imports from `@razorpay/blade-svelte/components`, `/icons`or`/runes`, icons as sources, and classes that pass Blade's class lint (`yarn tsc:knowledgebase --target svelte` checks all of it).
- The blade-svelte general docs are its own (Usage, Styling, Theming, Adapters, Composing, AvailableIcons), not copies of the React ones: blade-svelte styles with token classes and themes through CSS variables. `AvailableIcons.md` lists exactly the package's icon exports; the Svelte lint checks this. Each general doc has a line in `references/general/index.md` and is named in `SKILL.md`'s "General docs" line; `yarn validate:blade-plugin` fails otherwise.
- `Composing.md` teaches an app to build its own components on blade-svelte; state only what blade-svelte's public entries export (`src/components/index.ts`, `src/runes/index.ts`). Docs for such an app's components follow `authoring/composed-components.prompt.txt`.
- `@razorpay/blade-plugin` versions independently of `@razorpay/blade-mcp`. Every changeset that touches this package uses `'@razorpay/blade-plugin': patch|minor`; also add `'@razorpay/blade-mcp'` when the change is in `skills/blade/references`, because blade-mcp ships those docs.
- Do not bump versions by hand. `scripts/syncPluginManifestVersion.js` stamps plugin.json files and `SKILL.md` `metadata.version` from `package.json` during release.
- Everything in this directory ships to Claude Code plugin users. Put repo tooling in the root `scripts/`, not here, so it does not clash with `skills/blade/scripts/`.
- No symlinks, no `bin/`, forward slashes only. The plugin is installed by git checkout on macOS, Linux and Windows and by `npx skills add`, which copies only the skill directory.
- Keep workflows as `references/*.md` in the `blade` skill rather than separate skills. Any new skill that sends analytics keeps an identical copy of `scripts/analytics.mjs` (a port of the MCP analytics utils) in its own directory; the validator fails if the copies differ.
- No `.mcp.json` here. Consumers of the MCP keep configuring it themselves during the overlap period.

## Quick Commands

| Task                              | Command (repo root)                                     |
| --------------------------------- | ------------------------------------------------------- |
| Validate plugin structure + hooks | `yarn validate:blade-plugin`                            |
| Run script and hook tests         | `yarn --cwd packages/blade-plugin test`                 |
| Typecheck React knowledgebase     | `yarn tsc:knowledgebase`                                |
| Compile Svelte knowledgebase      | `yarn tsc:knowledgebase --target svelte`                |
| Check React docs drift vs source  | `yarn check:knowledgebase-drift --fail`                 |
| Check Svelte docs drift vs source | `yarn check:knowledgebase-drift --target svelte --fail` |
| Try locally in Claude Code        | `claude --plugin-dir packages/blade-plugin`             |
| Sync manifest versions            | `node scripts/syncPluginManifestVersion.js`             |

## Checking another package's Svelte knowledgebase

The Svelte lint and drift check also run against a package an app builds on blade-svelte, with its own docs. Run them from a checkout of this repo (after `yarn install`); paths on the command line are relative to where you run them:

```sh
node scripts/lintKnowledgebaseSvelte.js --package <dir> --docs <dir>
node scripts/checkKnowledgebaseDriftSvelte.js --package <dir> --docs <dir> --fail [Name…]
# or, with the options in a JSON file (paths relative to the file)
yarn tsc:knowledgebase --target svelte --config <file>
yarn check:knowledgebase-drift --target svelte --config <file> --fail
```

| Flag (config key)                                               | Default                                                    | What                                                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--package` (`packageDir`)                                      | none: blade-svelte's own knowledgebase                     | The package: its `package.json` `name` is what examples import                                              |
| `--entry <specifier>=<file>` (`entries`, `{ specifier: file }`) | the script targets of its `package.json` `exports`         | Its public entries; file relative to the package. An import under its name that is not an entry is an error |
| `--components <specifier>` (`components`)                       | every entry                                                | The entries whose components get their props checked and drift-compared                                     |
| `--components-dir` (`componentsDir`)                            | the package                                                | Only components declared under it are its own (drift-compared); re-exported Blade components are not        |
| `--docs` (`docsDir`)                                            | required with a package                                    | The docs whose Svelte examples are linted: every `.md` under it                                             |
| `--component-docs` (`componentDocsDir`)                         | `--docs`                                                   | Where `{Name}Props` are read                                                                                |
| `--drift-ignore` (`driftIgnore`)                                | none                                                       | The drift check's exceptions, shaped as `scripts/knowledgebaseDriftIgnore.svelte.json`                      |
| `--tsconfig` (`tsconfig`)                                       | `<package>/tsconfig.json`                                  | How the package's `$props()` types resolve (its `@razorpay/blade-svelte` included); relative to the package |
| `--blade-svelte` (`bladeSvelteDir`)                             | the one the package resolves, else `packages/blade-svelte` | The blade-svelte the examples are checked against: names, props and the class lint                          |
| `--name`, `--report`                                            | the package's name; the repo-root report files             | The label in messages; where the JSON report is written                                                     |

With a package, the lint checks imports from its entries as it does blade-svelte's, its components' props, and runs Blade's class lint with its component entries as `sources` (their `class` places them). `AvailableIcons.md` is not checked. With no package the checks are blade-svelte's, unchanged.

The checks stay repo-root scripts: they need `ts-morph` and `svelte/compiler`, which neither blade-svelte (it ships source to apps) nor this plugin (no repo tooling here) should carry. A consumer runs them from a checkout of this repo against its own path; `--blade-svelte` defaults to the copy the consumer has installed, so its docs are checked against the version it uses.
