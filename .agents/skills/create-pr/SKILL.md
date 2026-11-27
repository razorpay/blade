---
name: create-pr
description: Create a pull request ready for review with conventional commit message and structured PR body targeting master branch
disable-model-invocation: true
---

# Create PR

Usage: `/create-pr <ComponentName> <brief-description>`

Commit all changes with a conventional commit message (`feat`/`fix`/`docs`/`refactor`/`test`/`chore`), push, and create a PR ready for review targeting `master`.

Before creating the PR, follow the `pr-screenshots` skill to capture and upload before/after screenshots.

PR body should include:

- **Summary** — what changed
- **Before / After** — screenshots from the `pr-screenshots` skill (or `No visual change: <reason>`)
- **Testing Status** — unit tests, Storybook visual verification, lint and type checks
- **Related** — Figma link if applicable, any other relevant links
