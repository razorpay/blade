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

## Verify Before Fixing

Before raising a fix PR, **always** verify that a fix is actually needed. Do not blindly jump to a code change based on a screenshot or a user report.

### Required Steps

1. **Reproduce the issue** — Use storybook, unit tests, or a minimal example to confirm the bug exists. A screenshot alone is not reproduction.
2. **Check consumer usage first** — Many "bugs" are actually consumer misconfiguration (e.g. wrong prop like `maxRows="multiple"` instead of default `maxRows="single"`). Check if the issue reproduces with default/correct props before assuming a Blade code defect.
3. **Check existing stories and tests** — Look at the component's stories and test files. If the "buggy" behaviour is already demonstrated as expected behaviour there, it's not a bug.
4. **Confirm root cause with evidence** — Point to the specific line(s) of code causing the issue. Don't guess — read the code path end-to-end.
5. **If no fix is needed** — Tell the user the correct usage (e.g. "remove `maxRows='multiple'`") instead of raising a PR.

### Anti-patterns to Avoid

- ❌ Seeing a screenshot → finding something plausible in code → raising a PR
- ❌ Fixing a symptom without understanding the root cause
- ❌ Raising a docs-only change when the real issue was a consumer prop misuse
- ✅ Reproducing → checking usage → confirming root cause → then fixing
