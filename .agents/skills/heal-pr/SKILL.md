---
name: heal-pr
description: Heal a Blade PR by fixing CI failures, missing changesets, and sanity issues. Use when a PR has failing CI or other sanity problems that need to be auto-fixed.
disable-model-invocation: true
---

# Heal Blade PR

## Arguments

- PR: Link / Number of the PR to heal

## Steps

### 1. Diagnose

Spawn the `pr-sanity-critique` subagent to identify all issues:

```
subagent_type: pr-sanity-critique
prompt: "PR_NUMBER={PR_NUMBER}"
```

### 2. Fix

Checkout the PR branch and fix each reported issue:

```bash
gh pr checkout {PR_NUMBER} --repo razorpay/blade
```

- **Failing CI**: investigate with `gh run view --job {JOB_ID} --repo razorpay/blade`, then fix the root cause (code, tests, config)
- **Missing changeset**: create the `.changeset` file with appropriate bump type — **only if the PR contains actual source code changes**. Skip changeset creation for PRs with purely test file changes (e.g. `*.test.ts`, `*.spec.tsx`) or documentation-only changes (e.g. `*.md`, `docs/`).
- **Any other issue**: follow the critique's suggestion

For test or lint failures, verify the fix locally by re-running the failing check before committing.

### 3. Handle Non-Fixable Issues

If any issue cannot be fixed (infra outage, external service downtime, flaky environment), post a comment:

```bash
gh pr comment {PR_NUMBER} --repo razorpay/blade --body ":sparkles: Agentic PR Healer :sparkles:

**Could not auto-fix the following issues:**

{DESCRIPTION}

These require manual intervention."
```

### 4. Push

**PR Commit Policy (STRICT):**

- You must ONLY commit to the existing PR branch. NEVER create a new PR with `gh pr create` when the target PR is still open.
- Before pushing, check if the PR is already merged:

```bash
PR_STATE=$(gh pr view {PR_NUMBER} --repo razorpay/blade --json state -q '.state')
```

- **If PR state is `OPEN`**: commit and push to the existing PR branch only:

```bash
git add -A && git diff --cached --quiet || (git commit -m "fix: auto-heal PR via Slash PR Healer" && git push)
```

- **If PR state is `MERGED`**: the original branch is frozen. Create a new branch from `master`, apply the fix, and create a new PR:

```bash
git checkout master && git pull origin master
git checkout -b fix/<short-description>
# apply the fix
git add -A && git commit -m "fix: auto-heal via Slash PR Healer [from merged PR #{PR_NUMBER}]"
git push -u origin fix/<short-description>
gh pr create --title "fix: auto-heal from merged PR #{PR_NUMBER}" --body "Heal fixes from merged PR #{PR_NUMBER}" --repo razorpay/blade
```

- **If PR state is `CLOSED`**: do not push or create a PR. Post a comment explaining the PR was closed and the heal cannot be applied.
