---
description: How subagents in the React Native migration pipeline resolve paths relative to a base directory.
---

# Agent Base Directory

`{Worktree}` is the **absolute prefix** for every file/shell op in the agent.

- **Orchestrated:** `{Worktree}` comes from your prompt (the worktree's absolute path).
- **Standalone:** no `{Worktree}` in prompt → run `pwd` via Bash tool, use that as `{Worktree}`.

## Rules

- **Read / Write / Edit / Glob / Grep:** paths MUST start with `{Worktree}`. Bare relative paths (`.codex/artifacts/...`) silently resolve to the **parent agent's CWD** (the main checkout) — your writes land in the wrong place and the orchestrator can't find them.
- **Bash:** prefix commands with `cd {Worktree} &&` (or `cd {Worktree}/packages/...` for Storybook). Commands then use shell-relative paths normally.
- Never read or write outside `{Worktree}`.
