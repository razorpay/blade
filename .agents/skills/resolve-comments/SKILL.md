---
name: resolve-comments
description: Resolve PR review comments by pushing code fixes or replying with explanations. Use when a PR has review comments that need to be auto-resolved.
disable-model-invocation: true
---

# Resolve PR Review Comments

## Arguments

- PR: Link / Number of the PR to resolve comments on
- COMMENT_URLS: Newline-separated list of comment URLs to resolve

## Steps

### 1. Fetch Comment Details

Use `gh` CLI to fetch the PR and each comment:

```bash
gh pr view {PR_NUMBER} --repo razorpay/blade
gh api repos/razorpay/blade/pulls/comments/{COMMENT_ID}
```

### 2. Resolve Each Comment

For each comment in `COMMENT_URLS`, determine the appropriate resolution:

- **Code fix required**: push a fix commit to the PR branch, reply to the inlined comment (mention `[resolved by agent]`) at the end, and mark the inlined comment thread as resolved on GitHub.
- **Clarification request**: reply to the inlined comment with a clear explanation and `[resolved by agent]` at the end.
- **Invalid or irrelevant comment**: skip resolving it, reply with why it is invalid or irrelevant, and add `[resolved by agent]` at the end.
  - Go through the rest of the relevant code, commits, PR info, whenever applicable, to determine if the comment is invalid or irrelevant.
- **Needs PR author input**: add the label `Human Help Needed 🧑🏻‍💻` to the PR instead of guessing.

#### Handling mismatched changes

- Case 1: Diff has peice of change that doesn't match the title or description of the PR.
  - In most cases, its safe to assume that the code was changed but the PR info was not updated to reflect the changes. You can go and update the PR info instead of reverting the change.

### 3. Making Changes in branch

- Try not to deviate from the original change the PR was intended for (check PR info, diff, relevant code state in that branch, etc to get context whenever needed).
- Its possible that while working on the change, you find out that the comment is invalid or irrelevant or you don't need to make the change at all. In that case, just reply to the inlined comment with small message and add `[resolved by agent]` at the end.

### 4. Push Fixes

If any code fixes were made:

```bash
git add -A && git diff --cached --quiet || (git commit -m "fix: <relevant commit message> [resolved by agent]" && git push)
```

### 5. Reply to Comments

After resolving, reply to each inlined comment with small message and add `[resolved by agent]` at the end (if you have not already done so).

- Never post a new comment on the PR. Only reply to the inlined comments.
