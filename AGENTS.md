# Blade Monorepo — Agent Context

This is the monorepo for the Blade Design System. It contains different packages related to the Blade Design System of Razorpay.

## Packages

Load the Agents Context File in your context whenever change is being made to that particular package. Use CLAUDE.md when you are using Claude Code and AGENTS.md when you are using Cursor or other coding tool.

| Package                                  | Agents Context File                            | Description                                                                                                                       |
| ---------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [blade](./packages/blade/)               | ./packages/blade/CLAUDE.md or AGENTS.md        | The core Blade Design System package with cross-platform UI components for React Web and React Native                             |
| [blade-mcp](./packages/blade-mcp/)       | ./packages/blade-mcp/CLAUDE.md or AGENTS.md    | Model Context Protocol (MCP) server for AI-assisted development using Blade components                                            |
| [blade-core](./packages/blade-core/)     | ./packages/blade-core/CLAUDE.md or AGENTS.md   | Core utilities for Blade Design System (Only used in blade-svelte as of now and not in blade package)                             |
| [blade-svelte](./packages/blade-svelte/) | ./packages/blade-svelte/CLAUDE.md or AGENTS.md | Svelte components for Blade Design System (changes here should only be made when explicitly asked by the user for svelte changes) |

.. And few other smaller packages related to blade

## Finding Task Intent

We want to know if the intent of the user is to build complete feature/fix end-to-end (in that case we would want to write tests, fix lints, fix snapshots, etc) or its a small casual prompt to iterate over task faster where scope of task is limited to what user has asked for.

```sh
# existence of GITHUB__RZP_SWE_AGENT_APP__APP_ID environment variable in the session, implies that this request was triggered on cloud agent where the intent is to build things end-to-end.
if [ -z "$GITHUB__RZP_SWE_AGENT_APP__APP_ID" ]; then
  echo "Intent: 'normal-task'"
else
  echo "Intent: 'perform-task-end-to-end'"
fi
```

When intent is `perform-task-end-to-end`, load `perform-task-end-to-end` skill in your context and do the task end-to-end as guided by the skill.

## Cursor Cloud specific instructions

Environment notes for future cloud agents (dependencies are already installed by the startup update script — `yarn install` from the repo root):

- **Node:** `packages/blade` requires Node `>=20` (the strictest constraint in the monorepo). The VM ships Node 22, which works. Do not downgrade below 20.
- **Package manager:** Yarn Classic (v1) with Lerna. The root `package.json` uses `"nohoist": ["**"]`, so dependencies are **not** hoisted — each workspace package keeps its own `node_modules`. Re-run `yarn install` from the repo root after pulling to refresh all packages; the root `postinstall` rebuilds `eslint-plugin-blade`.
- **Primary product = `@razorpay/blade`** (React web + React Native components), developed/tested through Storybook. Standard lint/test/build/typecheck commands are documented in the root `package.json` scripts and `packages/blade/AGENTS.md` — use those rather than duplicating here.
- **Running the web Storybook (main dev surface):** `cd packages/blade && yarn start:web` serves on http://localhost:9009. The first load triggers a Vite dependency pre-bundle that takes ~30–60s before stories render; wait for `Local: http://localhost:9009/` in the logs before hitting the server.
- **Running tests directly:** prefer the documented `yarn test:react <Component>` form (e.g. `yarn test:react Button/Button`) from `packages/blade`, which works with or without the `SHARD` env var. Invoking `jest`/`cross-env` directly from a raw shell fails unless you use the package's local bin (`./node_modules/.bin/jest`) because `cross-env` is not on the global PATH.
- **Optional services (only when working on those packages):** Svelte components — `cd packages/blade-svelte && yarn dev` (Storybook on port 6007, also builds `blade-core` in watch mode); MCP server — `cd packages/blade-mcp && yarn dev` (stdio-based, no HTTP port). Neither is needed to develop/test the core `blade` package.
