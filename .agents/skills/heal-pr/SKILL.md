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
- **Missing changeset**: create the `.changeset` file with appropriate bump type
- **Any other issue**: follow the critique's suggestion

For test or lint failures, verify the fix locally by re-running the failing check before committing.

### 3. Handle Non-Fixable Issues

If any issue cannot be fixed (infra outage, external service downtime, flaky environment), post a comment:

```bash
gh pr comment {PR_NUMBER} --repo razorpay/blade --body ":sparkles: Agentic CI Healer :sparkles:

**Could not auto-fix the following issues:**

{DESCRIPTION}

These require manual intervention."
```

### 4. Push

```bash
git add -A && git commit -m "fix: auto-heal PR via Slash CI Healer" && git push
```
