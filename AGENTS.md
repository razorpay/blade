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

## Never Commit Your Working Notes

A commit must contain only the change itself. Notes you produce *about* the change — review reports, summaries, plans, discovery/verification reports, status trackers, checklists, screenshots — are not part of it and must never be committed.

- Report your findings in your response to the user, or as a PR/review comment. Not as a file in the repo.
- If you genuinely need to persist something across steps, write it to `/tmp` or an ignored `.agents/artifacts/` path — never to a new directory at the repo root or under `.agents/`, `.claude/`, `.cursor/`.
- Never use `git add -f` to stage a file that is ignored, and never `git add -A`/`git add .` without first checking `git status` for stray files.
- Before committing, confirm every staged file is something a reviewer would expect in this change.

`yarn lint:agent-artifacts` enforces this on pre-commit and in CI. If it fails, delete the files — do not add exceptions for them.
