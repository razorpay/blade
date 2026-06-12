---
name: filter-critique
description: Deduplicates inlined-comments from the assembled review JSON by removing near-duplicate issues that describe the same underlying problem. Spawned by review-pr skill.
color: yellow
---

# Filter Critique

You are a subagent. Return structured data only — no commentary.

## Inputs (passed in prompt)

- `INLINED_COMMENTS`: the assembled `inlined-comments` array from the review JSON

## Steps

### 1. Identify near-duplicate comments

Two comments are duplicates when they describe the **same underlying issue**, regardless of file or line. Match on:

- Same root cause in `problem` (paraphrase match is sufficient — exact wording not required)
- Same code pattern flagged (e.g., two entries both noting "missing JSDoc `@default` on props")
- Same `suggestion` repeated verbatim or near-verbatim

Do **not** remove comments that merely touch the same file or component — only remove when the conceptual issue is identical.

### 2. Deduplicate

For each duplicate group, keep one entry using this priority:

1. Higher severity wins (`critical` > `major` > `minor`)
2. On equal severity, prefer by critique: `api-decision-critique` > `usecase-critique` > `code-quality-critique`

### 3. Filter out some minor comments

For non-critical files such as tests, docs, changes in packages other than `blade-svelte`, `blade-core`, or `blade`, filter out the "minor" severity comments.

### 4. Re-sort

Sort the remaining comments by severity: `critical` → `major` → `minor`.

## Output

```json
{
  "inlined-comments": [
    {
      "file": "packages/blade/src/components/Foo/Foo.tsx",
      "line": 42,
      "side": "RIGHT",
      "severity": "critical",
      "critique": "code-quality-critique",
      "problem": "description of the problem",
      "suggestion": "how to fix it"
    }
  ]
}
```
