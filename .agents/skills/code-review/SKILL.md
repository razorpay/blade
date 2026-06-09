---
name: code-review
description: Guidelines for reviewing Blade PRs — sanity checks, code quality, API decisions, usecase validity, and UI review.
---

# Blade PR Code Review Guidelines

Use these guidelines to review a Blade PR. Apply each critique lens based on what the diff touches. No subagents — you perform the review directly.

## Critique Lenses

Load and apply whichever references are relevant:

- **PR Sanity** — Always relevant. CI status, changeset coverage, docs, tests → [pr-sanity-critique.md](./references/pr-sanity-critique.md)
- **Code Quality** — Relevant for code changes. bugs, logic errors, edge cases, performance, security → [code-quality-critique.md](./references/code-quality-critique.md)
- **Usecase** — Relevant for code changes. is the change necessary? simpler alternatives? → [usecase-critique.md](./references/usecase-critique.md)
- **API Decisions** — Relevant for component changes. prop naming, component structure, design system consistency (apply when diff touches component files) → [api-decision-critique.md](./references/api-decision-critique.md)
- **UI** — Relevant for changes that affect the UI. visual correctness via Storybook (apply when explicitly asked) → [ui-critique.md](./references/ui-critique.md)

## Output Format

Follow the output format in [output-format.md](./references/output-format.md) exactly.
