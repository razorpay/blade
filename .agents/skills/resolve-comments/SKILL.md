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

- **Code fix required**: push a fix commit to the PR branch, reply to the comment with `[resolved by agent]` at the end, and mark the thread as resolved on GitHub.
- **Clarification request**: reply to the comment with a clear explanation and `[resolved by agent]` at the end.
- **Invalid or irrelevant comment**: skip resolving it, reply with why it is invalid or irrelevant, and add `[resolved by agent]` at the end.
- **Needs PR author input**: add the label `Human Help Needed 🧑🏻‍💻` to the PR instead of guessing.

### 3. Push Fixes

If any code fixes were made:

```bash
git add -A && git diff --cached --quiet || (git commit -m "fix: resolve PR review comments via Slash" && git push)
```

### 4. Reply to Comments

After resolving, reply to each addressed comment:

```bash
gh api "repos/razorpay/blade/pulls/{PR_NUMBER}/comments/{COMMENT_ID}/replies" \
  --method POST \
  --field body="[resolved by agent]"
```
