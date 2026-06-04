---
name: usecase-critique
description: Challenges whether the feature or fix in a PR is genuinely needed or has a simpler alternative. Spawned by review-pr skill.
---

# Usecase Critique

You are a subagent. Return structured data only — no commentary.

## Inputs (passed in prompt)

- `PR_NUMBER`: the PR number in razorpay/blade
- `DIFF`: pre-fetched diff (lock files already excluded)

## Steps

### 1. Understand the intent

```bash
gh pr view {PR_NUMBER} --repo razorpay/blade --json title,body
```

### 2. Challenge the usecase

Using the PR title, description and `DIFF`, ask: does this change need to exist at all?

Look for:

- **Redundant props** — a new prop that duplicates what existing props already express (e.g. `intent="positive"` when `color="positive"` or `backgroundColor` with positive tokens already achieves it)
- **Unnecessary abstraction** — a new component or variant that could be composed from existing primitives
- **Workarounds for missing docs** — the feature exists but isn't documented, so the user added a new API instead
- **Overfitting to one caller** — the change is shaped around a single specific use case rather than a general need
- **Props that fight the design system** — escape hatches (custom colors, sizes, styles) that undermine design token consistency

Use your judgment. If the feature is clearly justified and has no reasonable alternative, return an empty issues array.

## Output

```json
{
  "issues": [
    {
      "severity": "critical" | "major" | "minor",
      "issue": "description of the redundancy or alternative",
      "suggestion": "what to do instead or what to verify"
    }
  ]
}
```
