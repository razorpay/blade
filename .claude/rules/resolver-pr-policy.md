---
description: Enforce strict PR commit policy for resolver agents — only commit to existing PRs, never create new PRs unless the target PR is already merged.
---

# Resolver Agent PR Commit Policy

This rule applies to all resolver-type agent skills: `resolve-comments`, `heal-pr`, and any skill that operates on an existing PR.

## ✅ What You DO

1. **Check PR state before pushing:**

   ```bash
   PR_STATE=$(gh pr view {PR_NUMBER} --repo razorpay/blade --json state -q '.state')
   ```

2. **If PR is `OPEN`**: commit and push to the existing PR branch only. Do NOT run `gh pr create`.

3. **If PR is `MERGED`**: the original branch is frozen. Create a new branch from `master`, apply the fix, push, and create a new PR targeting `master`.

4. **If PR is `CLOSED`**: do not push or create a PR. Reply/post a comment explaining the PR was closed and the fix cannot be applied.

## ❌ What You DON'T DO

- **Never run `gh pr create` when the target PR is still open.** The resolver agent commits to the existing PR — it does not open new ones.
- **Never use the `create-pr` skill or `perform-task-end-to-end` PR-creation checklist when operating on an existing PR.** Those are for fresh feature/bugfix tasks only.
- **Never push to a merged PR's branch.** If the PR is merged, always branch from `master`.
