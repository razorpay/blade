# PR Review Report — PR #3823

**PR:** feat(GenUI): add download and copy options
**Branch:** genui/share-download
**Review URL:** https://github.com/razorpay/blade/pull/3823#pullrequestreview-4864655469
**Date:** 2026-08-05

## Review Status: `commented`

PR not approved due to 1 critical inlined comment (contravariance type error making the generic ActionSlotRenderer unusable for per-component type narrowing) and 1 major inlined comment (type/runtime/docs mismatch for custom block-level component support).

## Summary

Reviewed PR #3823 using the blade repo's `/review-pr` skill with `shouldReviewUI=true`, `shouldRunHeadedBrowser=false`, and `shouldSubmitReview=true`.

## Critique Agents Spawned

1. **code-quality-critique** — Reviewed code quality of changed files (1 issue found: contravariance type error, deduplicated with api-decision-critique's finding)
2. **api-decision-critique** — Reviewed component API decisions (2 issues found: contravariance type error and type-vs-runtime-vs-doc mismatch)
3. **ui-critique** — Reviewed UI via Storybook using agent-browser (all 3 checks passed)
4. **filter-critique** — Deduplicated and filtered inline comments (3 inputs → 2 outputs, 1 duplicate removed)

## UI Review

| Check | State |
|-------|-------|
| GenUI WithComponentActions story | SUCCESS |
| GenUI SimpleGenUI story (regression) | SUCCESS |
| GenUI TableExamples story (regression) | SUCCESS |

- WithComponentActions story renders CARD with "Download as PNG" and TABLE with "Copy as CSV" action slots below components
- Clicking "Download as PNG" confirmed componentRef.current resolved to the CARD DOM node (div, 716px wide)
- Clicking "Copy as CSV" confirmed button label toggled to "Copied!", verifying TABLE action slot received component schema via data
- No regressions in existing GenUI stories (SimpleGenUI, TableExamples)
- All table configurations render correctly with proper headers, rows, and horizontal scroll behavior

## Inline Comments (after filtering)

1. **CRITICAL** (api-decision-critique, confidence 9) — `types.ts:53`: `GenUIComponentActionsRegistry` stores `GenUIActionSlotRenderer<GenUIBaseComponent>`, so a per-component-typed renderer (`GenUIActionSlotRenderer<TableComponent>`) is NOT assignable to the slot — function params are contravariant under `strictFunctionTypes` and `GenUIBaseComponent` is not assignable to `TableComponent`. The story and docs both demonstrate this usage, which fails to typecheck. The generic `<T>` on `GenUIActionSlotRenderer` is unusable for narrowing; consumers must cast inside the render prop. **Suggestion:** Use a mapped type `type GenUIComponentActionsRegistry = { [K in keyof ComponentByType]?: GenUIActionSlotRenderer<ComponentByType[K]> }` with `ComponentByType = { CARD: CardComponent; TABLE: TableComponent }`.

2. **MAJOR** (api-decision-critique, confidence 8) — `types.ts:45`: `GenUIComponentActionsRegistry` is keyed by the closed union `GenUIBlockLevelComponentType = 'CARD' | 'TABLE'`, but the docs state action slots also render for custom components with `animation.name: 'gradient-ring-entry'`, and the runtime does render slots for custom block-level components. The type rejects custom keys, requiring `as any` cast. **Suggestion:** Reconcile the three — either drop the custom-component claim from docs to match the CARD/TABLE-only type, or widen the key to string if custom block-level support is actually desired.

## Changeset

Present — `.changeset/genui-export-error-state.md` declares `@razorpay/blade: minor`.
