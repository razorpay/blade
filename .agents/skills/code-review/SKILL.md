---
name: code-review
description: Guidelines for reviewing Blade PRs — sanity checks, code quality, API decisions, usecase validity, and UI review.
---

# Blade PR Code Review Guidelines

Use these guidelines to review a Blade PR. Apply each critique lens based on what the diff touches. No subagents — you perform the review directly.

## Arguments

- Identify PR_NUMBER from the PR link.

## Critique Lenses

Load and apply whichever references are relevant (they are referenced relative to this skill file path):

- **PR Sanity** — Always relevant. CI status, changeset coverage, docs, tests → [pr-sanity-critique.md](./references/pr-sanity-critique.md)
- **API Decisions** — Relevant for component changes. prop naming, component structure, design system consistency (apply when diff touches component files) → [api-decision-critique.md](./references/api-decision-critique.md)

All issues raised by PR Sanity and API Decisions are critical and high importance issues. They take priority over any other code quality or other issues.
