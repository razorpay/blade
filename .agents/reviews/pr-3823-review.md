# PR Review Report — PR #3823

**PR:** feat(GenUI): add download and copy options
**Branch:** genui/share-download
**Review URL:** https://github.com/razorpay/blade/pull/3823#pullrequestreview-4862538944
**Date:** 2026-08-05

## Review Status: `commented`

PR not approved due to 2 major inlined comments from api-decision-critique: (1) GenUIActionSlotRenderer generic is unusable for per-component type narrowing due to contravariance under strictFunctionTypes — documented usage fails to typecheck, and (2) GenUIComponentActionsRegistry key type (CARD|TABLE only) mismatches docs and runtime that support custom block-level components.

## Summary

Reviewed PR #3823 using the blade repo's `/review-pr` skill with `shouldReviewUI=true`, `shouldRunHeadedBrowser=false`, and `shouldSubmitReview=true`.

Previous review issue (permissive `Record<string, ...>` registry type) was resolved by tightening to `Partial<Record<GenUIBlockLevelComponentType, ...>>`. This re-review confirms that fix but surfaces two new API design concerns introduced by the tightening: a contravariance type error making the generic slot renderer unusable, and a type-vs-runtime-vs-doc mismatch for custom block-level component support.

## Critique Agents Spawned

1. **code-quality-critique** — Reviewed code quality of changed files (0 issues found)
2. **api-decision-critique** — Reviewed component API decisions (2 issues found: contravariance type error and type-vs-runtime-vs-doc mismatch)
3. **ui-critique** — Reviewed UI via Storybook using agent-browser (all 3 checks passed)
4. **filter-critique** — Deduplicated and filtered inline comments (2 inputs → 2 outputs, both kept as non-duplicate substantive issues)

## UI Review

| Check | State |
|-------|-------|
| GenUI WithComponentActions story | SUCCESS |
| GenUI SimpleGenUI story (regression) | SUCCESS |
| GenUI TableExamples story (regression) | SUCCESS |

- WithComponentActions story renders CARD with "Download as PNG" and TABLE with "Copy as CSV" action slots below components
- Clicking "Download as PNG" confirmed componentRef.current resolved to the CARD DOM node (div, 701px wide)
- Clicking "Copy as CSV" confirmed button label toggled to "Copied!", verifying TABLE action slot received component schema via data
- No regressions in existing GenUI stories (SimpleGenUI, TableExamples)
- All table configurations render correctly with proper headers, rows, and horizontal scroll behavior

## Inline Comments (after filtering)

1. **MAJOR** (api-decision-critique, confidence 9) — `types.ts:54`: `GenUIComponentActionsRegistry` stores `GenUIActionSlotRenderer<GenUIBaseComponent>`, so a per-component-typed renderer (`GenUIActionSlotRenderer<TableComponent>`) is NOT assignable to the slot — function params are contravariant under `strictFunctionTypes` and `GenUIBaseComponent` is not assignable to `TableComponent`. The story and docs both demonstrate this usage, which fails to typecheck. The generic `<T>` on `GenUIActionSlotRenderer` is unusable for narrowing; consumers must cast inside the render prop. **Suggestion:** Use a mapped type `type GenUIComponentActionsRegistry = { [K in keyof ComponentByType]?: GenUIActionSlotRenderer<ComponentByType[K]> }` with `ComponentByType = { CARD: CardComponent; TABLE: TableComponent }`.

2. **MAJOR** (api-decision-critique, confidence 7) — `types.ts:45`: `GenUIComponentActionsRegistry` is keyed by the closed union `GenUIBlockLevelComponentType = 'CARD' | 'TABLE'`, but the docs state action slots also render for custom components with `animation.name: 'gradient-ring-entry'`, and the runtime does render slots for custom block-level components. The type rejects custom keys, requiring `as any` cast. **Suggestion:** Reconcile the three — either drop the custom-component claim from docs to match the CARD/TABLE-only type, or widen the key to string if custom block-level support is actually desired.

## Changeset

Present — `.changeset/genui-export-error-state.md` declares `@razorpay/blade: minor`.
