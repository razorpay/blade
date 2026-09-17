# Figma Token Publisher

This plugin is used to sync the tokens from Figma to Code.

![token-figma-plugin](https://user-images.githubusercontent.com/11384858/220534254-869a169d-1970-4f21-a23b-de177f6d1419.gif)

## Quickstart

- Run `yarn` to install dependencies.
- Run `yarn build:watch` to start webpack in watch mode.
- Open `Figma` -> `Plugins` -> `Development` -> `Import plugin from manifest...` and choose `manifest.json` file from this repo.

## How a token push works

The plugin is only the first half of the pipeline. The second half lives in
`packages/blade/scripts` and runs inside the `blade-tokens-upload.yml` workflow.

| Stage                                      | Where                                                     |
| ------------------------------------------ | --------------------------------------------------------- |
| Read Figma variables, validate, tag values | `src/plugin/makeColorTokens.ts`, `validateColorTokens.ts` |
| gzip + base64, dispatch the workflow       | `src/app/api/api.ts`                                      |
| Write source files, verify, open the PR    | `packages/blade/scripts/uploadTokens.js`                  |

### The payload is sent in two shapes

`app/api/api.ts` dispatches the workflow with `ref: 'master'`, so **the script that runs is always
the one on `master`**, while the plugin build is installed by hand. The two halves version
independently and the plugin cannot assume the script has caught up with it.

So the payload carries the tokens twice:

| Key                                                  | Read by                                       |
| ---------------------------------------------------- | --------------------------------------------- |
| `themeColorTokens` / `globalColorTokens`             | any script, including old ones — flat strings |
| `taggedThemeColorTokens` / `taggedGlobalColorTokens` | a current script — `{ k, v }` values          |

In the flat shape the quoting is baked into the string (backticks for a template, single quotes for
a string, bare for an expression), because those scripts write the value out verbatim after
stripping one layer of JSON quotes.

**Any change to the payload shape has to keep the flat keys readable by the script on `master`.**
Sending only a new shape takes down every push until the script lands.

### Value tagging

Figma variables become one of three things in TypeScript, and the plugin says which:

| Kind | Written as         | Example                                |
| ---- | ------------------ | -------------------------------------- |
| `e`  | a bare expression  | `globalColors.chromatic.azure[500]`    |
| `s`  | a quoted string    | `'transparent'`                        |
| `t`  | a template literal | `` `hsla(0, 0%, 0%, ${opacity[8]})` `` |

An alias is written bare only when it resolves to one of `expressionRoots` in
`packages/blade/scripts/tokenTargets.json`. Everything else becomes a string. The write side then
re-reads what it produced and fails if any bare value cannot be resolved from the imports of the
file it landed in.

### Adding a theme

Two places, both of which will complain if you miss the other:

1. `FIGMA_MODE_THEME_MAP` in `src/plugin/makeColorTokens.ts` — maps the Figma mode prefix
   (`blade`, `bladeNeutral`) to the code theme name. An unmapped mode is reported as an error
   rather than dropped.
2. `themes` in `packages/blade/scripts/tokenTargets.json` — lists every file the theme is written
   into. `blade` and `blade-core` keep identical copies, so both belong in the list. A theme in
   the payload with no entry here blocks the push.

### Tokens that live in code, not Figma

A push regenerates the whole declaration from the payload, so a token Figma has never heard of is
deleted. Deprecated aliases are exactly that — they are kept for consumers, not authored in Figma —
which is how `popup.[background|border].[subtle|intense]` got dropped from a PR.

`preservedTokenPaths` in `packages/blade/scripts/tokenTargets.json` lists the paths to carry over
verbatim, comments included. `*` matches one segment, so a leading `*` covers both modes:

```json
"preservedTokenPaths": ["*.popup.background.subtle", "*.popup.border.subtle"]
```

A path Figma _does_ define is unaffected — the payload always wins where it has an opinion. When a
token is genuinely ready to go, delete its line here and the next push removes it.

This is not the plugin's concern: Figma has no way to express "deprecated but keep it", so the
decision belongs on the code side.

### What blocks a push

The plugin refuses to publish, and the workflow opens the PR as a **draft** with the reasons in the
body, when any of these hold:

- a value would be written as a bare identifier the target file cannot resolve
- a theme came back missing `onLight` or `onDark`
- the two themes disagree on which token paths exist
- a token removed from Figma is still referenced somewhere in the repo
- typecheck or the snapshot run fails

Removals, hardcoded colours, and emphasis groups where every level shares one value are reported
as warnings rather than blocked.

### Replaying a payload locally

The plugin logs the payload it posts. Save it, then:

```bash
cd packages/blade
node ./scripts/uploadTokens.js "$(cat payload.b64)" --dry-run --skip-typecheck --skip-snapshots
```

`--dry-run` writes the files and prints the PR body it would have used, but touches neither git nor
GitHub. Drop the skip flags to run the full verification.
