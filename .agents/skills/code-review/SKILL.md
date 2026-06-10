---
name: code-review
description: Review blade PRs by fetching diff, checking CI status, and getting Storybook URL. Use when reviewing PRs, checking PR status, or getting preview links for razorpay/blade PRs.
disable-model-invocation: true
---

# Review Blade PR

## Arguments / Clarifications

- PR: Link / Number of the PR to review
- ShouldReviewUI: Whether UI should be reviewed or not. Clarify if not mentioned.
- ShouldRunHeadedBrowser: Whether to run the browser in headed mode. Clarify if not mentioned.

## Prerequisites

- GitHub CLI (`gh`) must be installed and authenticated
- `agent-browser` command must be installed (if ShouldReviewUI is true)

## Steps

### 1. Fetch the diff and PR metadata

Run these in parallel:

```bash
gh api repos/razorpay/blade/pulls/{PR_NUMBER}/files --jq '[.[] | select(.filename | test("lock$|lock\\.json$|lock\\.yaml$") | not) | {filename, patch}]'
```

```bash
gh pr view {PR_NUMBER} --repo razorpay/blade --json title,body
```

Store the outputs as `DIFF`, `PR_TITLE`, and `PR_BODY`.

### 2. Spawn Critique Subagents in parallel

**pr-sanity-critique:**

```
subagent_type: pr-sanity-critique
prompt: "PR_NUMBER={PR_NUMBER}"
```

**code-quality-critique:**

```
subagent_type: code-quality-critique
prompt: |
  PR_NUMBER={PR_NUMBER}
  PR_TITLE={PR_TITLE}
  PR_BODY={PR_BODY}
  DIFF={DIFF}
```

**usecase-critique:**

```
subagent_type: usecase-critique
prompt: |
  PR_NUMBER={PR_NUMBER}
  PR_TITLE={PR_TITLE}
  PR_BODY={PR_BODY}
  DIFF={DIFF}
```

**api-decision-critique** (only if the diff contains component changes):

```
subagent_type: api-decision-critique
prompt: |
  PR_NUMBER={PR_NUMBER}
  PR_TITLE={PR_TITLE}
  PR_BODY={PR_BODY}
  DIFF={DIFF}
```

**ui-critique** (only if ShouldReviewUI is true):

```
subagent_type: ui-critique
prompt: |
  PR_NUMBER={PR_NUMBER}
  HEADED={ShouldRunHeadedBrowser}
  PR_TITLE={PR_TITLE}
  PR_BODY={PR_BODY}
  DIFF={DIFF}
```

### 4. Synthesize and output

Combine both subagent outputs. Follow the output format in references/output-format.md exactly.

- [Output Format](./references/output-format.md)
