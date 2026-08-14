# PR Review Report — PR #3884

**PR:** feat(tokens): add motion.easing.settle
**Branch:** feat/motion-settle-easing
**Review URL:** https://github.com/razorpay/blade/pull/3884#pullrequestreview-4940553510
**Date:** 2026-08-15

## Review Status: `approved`

## Summary

Reviewed PR #3884 using the blade repo's `/review-pr` skill with `shouldReviewUI=true`, `shouldRunHeadedBrowser=false`, and `shouldSubmitReview=true`.

## Critique Agents Spawned

1. **code-quality-critique** — Reviewed code quality of changed files (no issues found)
2. **api-decision-critique** — Reviewed API decisions for the new `settle` easing token (no issues found, naming consistent with existing patterns)
3. **ui-critique** — Skipped UI testing (token-only change, no component modifications, no stories to verify)
4. **filter-critique** — Deduplicated and filtered inline comments (empty input, empty output)

## Changes Reviewed

- `packages/blade/src/tokens/global/motion.ts` — Added `settle` easing token (`cubic-bezier(0.32, 0.72, 0, 1)`) with JSDoc and implementation
- `packages/blade/src/components/BladeProvider/__tests__/bladeLightTheme/bladeLightTheme.native.ts` — Added `settle` to native test fixture
- `packages/blade/src/tokens/theme/__tests__/__snapshots__/createTheme.native.test.tsx.snap` — Regenerated snapshot
- `packages/blade/src/tokens/theme/__tests__/__snapshots__/createTheme.web.test.tsx.snap` — Regenerated snapshot
- `.changeset/motion-settle-easing.md` — Changeset (minor)

## Inline Comments (after filtering)

None — no code quality or API issues found.

## Changeset

Present and appropriate (`@razorpay/blade: minor`).

## Usage

```jsx
import { useTheme } from '@razorpay/blade';

const { theme } = useTheme();
// Access the new easing token
theme.motion.easing.settle; // 'cubic-bezier(0.32, 0.72, 0, 1)' on web, EasingFactoryFn on native
```
