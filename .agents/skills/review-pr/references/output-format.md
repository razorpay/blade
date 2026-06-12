Assemble the outputs from all critique agents into a single JSON object matching this schema exactly. Do not wrap it in markdown code fences — output raw JSON only.

```json
{
  "reviewStatus": "approved" | "commented",
  "overview-comment": {
    "ui-review": {
      "critique": "ui-critique",
      "statuses": [
        {
          "name": "Button primary variant",
          "description": "Opened the Primary story and verified hover, focus, and click states.",
          "state": "SUCCESS"
        },
        {
          "name": "Button disabled state",
          "description": "Opened the Disabled story and attempted to hover and click the button.",
          "state": "FAILURE",
          "problem": "Disabled button still shows hover styles"
        }
      ]
    },
    "sanity-review": {
      "critique": "pr-sanity-critique",
      "statuses": [
        {
          "name": "Run Tests (1)",
          "description": "Description field from gh pr checks output",
          "state": "SUCCESS",
          "link": "https://github.com/razorpay/blade/actions/runs/1234567890"
        },
        {
          "name": "Run Tests (2)",
          "description": "Description field from gh pr checks output",
          "state": "FAILURE",
          "link": "https://github.com/razorpay/blade/actions/runs/1234567890",
          "problem": "Shard timed out after 6 minutes",
          "suggestion": "Re-run the failed job"
        }
      ],
      "issues": [
        {
          "problem": "Missing changeset bump for @razorpay/blade (packages/blade was modified)"
        }
      ]
    }
  },
  "inlined-comments": [
    {
      "file": "packages/blade/src/components/Foo/Foo.tsx",
      "line": 42,
      "side": "RIGHT",
      "severity": "critical",
      "critique": "code-quality-critique",
      "problem": "Description of the problem.",
      "suggestion": "How to fix it."
    },
    {
      "file": "packages/blade/src/components/Bar/Bar.tsx",
      "line": 17,
      "side": "LEFT",
      "severity": "minor",
      "critique": "api-decision-critique",
      "problem": "Description of the API inconsistency.",
      "suggestion": "What the correct pattern is."
    }
  ]
}
```

## Assembly rules

- `reviewStatus`: can be 'approved' or 'commented'
  - Set to `approved` if all CI and UI checks passed and there are no major or critical issues found.
  - Set to `commented` for everything else
- `overview-comment.ui-review`: populated from `ui-critique.statuses`. Omit this key entirely if `ShouldReviewUI` is false.
- `overview-comment.sanity-review`: `statuses` and `issues` come directly from `pr-sanity-critique`.
- `inlined-comments`: one entry per item in `issues[]` from `code-quality-critique`, `api-decision-critique`, and `usecase-critique`. Inject `critique` (the agent's `critique_name`) and copy `file`, `line`, `side`, `severity`, `problem`, `suggestion` directly. Sort by severity: critical → major → minor.
- `side`: `"RIGHT"` for added/modified lines, `"LEFT"` for deleted lines.
- Omit `statuses` or `issues` keys entirely when the agent did not return them (never include empty arrays).
- `inlined-comments` is an empty array `[]` if no issues were found across all agents.
