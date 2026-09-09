# PR Review Report — PR #3877

**PR:** fix(blade-svelte): constrain BottomSheet portalTarget to container bounds
**Branch:** fix/bottomsheet-portal-target
**Review URL:** https://github.com/razorpay/blade/pull/3877#pullrequestreview-4929435495
**Date:** 2026-08-13

## Review Status: `commented`

## Summary

Reviewed PR #3877 using the blade repo's `/review-pr` skill with `shouldReviewUI=true`, `shouldRunHeadedBrowser=false`, and `shouldSubmitReview=true`.

## Critique Agents Spawned

1. **code-quality-critique** — Reviewed code quality of changed files (1 issue: missing changeset)
2. **api-decision-critique** — Reviewed API decisions (no issues found; `portalTarget` is an existing prop, no new API surface)
3. **ui-critique** — Reviewed UI via Storybook using agent-browser (all checks passed)
4. **filter-critique** — Deduplicated and filtered inline comments (kept the missing changeset comment)

## UI Review

| Check | State |
|-------|-------|
| BottomSheet With Portal Target | SUCCESS |
| BottomSheet Default (regression check) | SUCCESS |

- **With Portal Target**: Opened the story, clicked 'Open bottom sheet', and verified the BottomSheet surface and backdrop render inside the bounded 320x560 phone-frame container. Backdrop uses `position:absolute` (not `fixed`), confirming the `portalRoot` CSS wrapper works correctly.
- **Default (regression check)**: Opened the default BottomSheet story, verified the sheet still renders full-viewport with `position:fixed`. Existing behavior is not broken by the portalTarget changes.

## Inline Comments (after filtering)

1. **Missing changeset** (minor, confidence: 9) — `packages/blade-svelte/src/components/BottomSheet/BottomSheet.svelte`
   - This PR changes BottomSheet rendering behavior and adds a new public export (`bottomSheetPortalRootClass`) to blade-core, but no `.changeset` file was added.
   - Suggestion: Add a `.changeset` file for `@razorpay/blade-svelte` (patch) describing the portalTarget positioning fix.

## Changeset

Missing — a `.changeset` file should be added for `@razorpay/blade-svelte` (patch) since this is a user-facing bug fix.
