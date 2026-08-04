# PR Review Report — PR #3823

**PR:** feat(GenUI): add download and copy options
**Branch:** genui/share-download
**Review URL:** https://github.com/razorpay/blade/pull/3823#pullrequestreview-4858697300
**Date:** 2026-08-05

## Review Status: `commented`

PR not approved due to 1 critical issue (componentActions silent-failure API contract gap for non-block-level components) and 1 major issue (dead actions field in CardComponent schema type).

## Summary

Reviewed PR #3823 using the blade repo's `/review-pr` skill with `shouldReviewUI=true`, `shouldRunHeadedBrowser=false`, and `shouldSubmitReview=true`.

## Critique Agents Spawned

1. **code-quality-critique** — Reviewed code quality of changed files (1 issue found: dead `data-genui-card-ref` attribute)
2. **api-decision-critique** — Reviewed component API decisions (4 issues found: silent-failure API contract gap, dead actions field, dead attribute, componentRef type mismatch)
3. **ui-critique** — Reviewed UI via Storybook using agent-browser (all 3 checks passed)
4. **filter-critique** — Deduplicated and filtered inline comments (5 input → 2 output after dedup and filtering)

## UI Review

| Check | State |
|-------|-------|
| GenUI WithComponentActions story | SUCCESS |
| GenUI SimpleGenUI story (regression) | SUCCESS |
| GenUI TableExamples story (regression) | SUCCESS |

- WithComponentActions story renders CARD with "Download as PNG" and TABLE with "Copy as CSV" action slots below components
- No regressions in existing GenUI stories (SimpleGenUI, TableExamples)
- All table configurations render correctly with proper headers, rows, and horizontal scroll behavior

## Inline Comments (after filtering)

1. **CRITICAL** (api-decision-critique, confidence 9) — `GenUIProvider.web.tsx:21`: componentActions registry accepts any string key but only renders for block-level components (CARD/TABLE). Registering for CHART, INFO_GROUP, BADGE, etc. silently does nothing.
2. **MAJOR** (api-decision-critique, confidence 9) — `GenUIComponents.web.tsx:586`: `actions?: GenUIAction[]` added to CardComponent type but never read by RenderCardComponent. Dead/misleading schema surface.

## Changeset

Present — `.changeset/genui-export-error-state.md` declares `@razorpay/blade: minor`.
