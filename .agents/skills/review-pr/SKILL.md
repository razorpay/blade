---
name: review-pr
description: Review blade PRs by fetching diff, checking CI status, and getting Storybook URL. Use when reviewing PRs, checking PR status, or getting preview links for razorpay/blade PRs.
disable-model-invocation: true
---

# Review Blade PR

## Arguments / Clarifications

- PR: Link / Number of the PR to review
- ShouldReviewUI: Whether UI should be reviewed or not. Clarify if not mentioned.
- ShouldRunHeadedBrowser: Whether to run the browser in headed mode. Clarify if not mentioned.
- ShouldSubmitReview: Whether to submit the review as a live comment or keep it as a pending draft. Default: `true`. If `false`, the review is saved as pending and not visible on the PR until submitted manually.

## Prerequisites

- GitHub CLI (`gh`) must be installed and authenticated
- `agent-browser` command must be installed (if ShouldReviewUI is true). If not installed, go ahead and install it.
  ```sh
  npm install -g agent-browser
  agent-browser install
  ```

## Instructions

- If you're unable to spawn the subagents, stop the skill immediately and respond with error message.
  ```json
  {
    "overview-comment": {},
    "inlined-comments": [
      {
        "file": "",
        "line": 0,
        "side": "RIGHT",
        "severity": "critical",
        "confidence": 10,
        "critique": "code-quality-critique",
        "problem": "Could not spawn the subagents. Please check the logs for more details."
      }
    ]
  }
  ```

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

**code-quality-critique:**

```
subagent_type: code-quality-critique
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

### 3. Synthesize

Combine all subagent outputs into a single JSON object. Follow the output format in references/output-format.md exactly.

- [Output Format](./references/output-format.md)

### 4. Spawn filter-critique subagent

```
subagent_type: filter-critique
prompt: |
  PR_NUMBER={PR_NUMBER}
  INLINED_COMMENTS={INLINED_COMMENTS}
```

Replace `inlined-comments` in the review JSON with the filtered array returned by the agent.

Then recalculate `reviewStatus` based on the filtered array:

- Set `reviewStatus` to `'approved'` if:
  - Check `reviewStatusReason` to see if reviewStatus was not approved only because of inlined comments array before filtering and that changes now. If so, set `reviewStatus` to `'approved'` now since the issues are filtered out now.
- Otherwise, set `reviewStatus` to `'commented'`

Update `reviewStatus` in the review JSON before proceeding to Step 5.

### 5. Post review to GitHub

Save the synthesized JSON to a temp file and run the post script. Pass `--pending` if `ShouldSubmitReview` is `false` — in that case the review is saved as a draft and will not be visible on the PR until submitted manually.

```bash
# Save the review JSON to a temp file
cat > /tmp/blade-review-{PR_NUMBER}.json << 'EOF'
{REVIEW_JSON}
EOF

# If ShouldPostComment is true (default):
node .agents/skills/review-pr/scripts/post-review.js /tmp/blade-review-{PR_NUMBER}.json {PR_NUMBER}

# If ShouldPostComment is false:
node .agents/skills/review-pr/scripts/post-review.js /tmp/blade-review-{PR_NUMBER}.json {PR_NUMBER} razorpay/blade --pending
```

When `--pending` is used, the script prints the review ID and a command to submit it when ready:

```bash
# To submit the pending review later:
gh api repos/razorpay/blade/pulls/{PR_NUMBER}/reviews/{REVIEW_ID}/events --method POST --field event=COMMENT
```
