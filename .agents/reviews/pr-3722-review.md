# PR Review Report — PR #3722

**PR:** feat(blade-svelte): BladeProvider and styleOverride changes
**Branch:** feat/blade-svelte-theme-core
**Review URL:** https://github.com/razorpay/blade/pull/3722#pullrequestreview-4816206652
**Date:** 2026-07-30

## Review Status: `commented`

## Summary

Reviewed PR #3722 using the blade repo's `/review-pr` skill with `shouldReviewUI=true`, `shouldRunHeadedBrowser=false`, and `shouldSubmitReview=true`.

## Critique Agents Spawned

1. **code-quality-critique** — Reviewed code quality of changed files (bugs, edge cases, performance, security, maintainability)
2. **api-decision-critique** — Reviewed API design decisions, prop naming, and naming convention consistency
3. **ui-critique** — Reviewed UI via Chromatic Storybook (React smoke tests) and code diff analysis
4. **filter-critique** — Deduplicated and filtered inline comments (merged 1 duplicate, 14 comments retained)

## Inline Comments (after filtering)

| Severity | Critique | File | Line | Problem |
|----------|----------|------|------|---------|
| major | code-quality | theme.css | 588 | `:root [data-blade-color-scheme='dark']` uses descendant combinator — never matches `<html>` where BladeProvider sets the attribute. Portaled content won't get dark mode. |
| major | code-quality | tooltip.module.css | 79 | Same descendant-selector issue for portaled tooltip bubbles. Comment falsely claims portaled bubbles match. |
| major | code-quality | BladeProvider.svelte | 136 | `onDestroy` checks `remainingProviders.length === 0` but provider's own DOM is still in document — condition never true, global attrs never cleaned up. |
| major | api-decision | card.ts | 209 | `getCardSurfaceClassNames` uses `ClassNames` suffix — 40+ existing functions use `Classes`. |
| major | api-decision | accordion.ts | 131 | `getAccordionWrapperClassNames` is redundant alias of `getAccordionWrapperClasses` with inconsistent naming. |
| major | api-decision | themeToCSSVariables.ts | 74 | `typographyToCssVariables` uses `Css` — all existing identifiers use `CSS` (all caps). Also affects `ThemeCssVariableSource` type. |
| minor | code-quality | BladeProvider.svelte | 87 | Error message hardcodes `[light, dark, system]` instead of using `colorSchemeNamesInput.toString()`. |
| minor | code-quality | BladeProvider.svelte | 151 | DOM query during template rendering — side-effect in render phase with multiple providers. |
| minor | code-quality | createThemeOverrides.ts | 93 | No validation on `fontSizeScaleFactor` (0, negative, NaN values produce invalid CSS). |
| minor | code-quality | BladeProvider.svelte | 49 | SSR flash: `systemPrefersDark` initialized to `false`, `viewportWidth` to `0` — light→dark flash on hydration. |
| minor | api-decision | createThemeConfig.ts | 65 | `fontFaceCss` uses `Css` instead of `CSS` — public API field name. |
| minor | api-decision | types.ts | 40 | `BladeComponentConfig.styleOverride` typed as `StyleOverride<string>` discarding per-component slot unions. |
| minor | api-decision | createThemeConfig.ts | 20 | Type name `CreateThemeFontSizeScaleOverride` misleading — prop is `fontSizeOverrides` (no `Scale`). |
| minor | api-decision | cx.ts | 1 | `cx` utility name collision with CVA's `cx` — different capability surface, same name. |

## CI Status

- **PASSING:** label, Request Slash AI review, Manage Agentic Merge Ready label, PR Title Check
- **IN_PROGRESS:** Run Tests (1-4), Run Svelte Tests, Validate Source Code, Knowledgebase Lint, Chromatic Deployment, semgrep scan, Generate PR Report
- **SKIPPED:** Update Base Stats
- **PENDING:** ci/codesandbox

## Changeset

- `@razorpay/blade-core: minor` — present
- `@razorpay/blade-svelte: minor` — present
- `@razorpay/blade: patch` — present

## UI Review

- **5 SUCCESS:** React component smoke tests (Avatar, Button, Card, AnnouncementBanner, Accordion) in light + dark modes — no visual regressions
- **10 SKIPPED:** Svelte Storybook not published via Chromatic for this PR (BladeProvider, StyleOverride Playground, and blade-core CSS module changes are Svelte-only)

## Filtered Out Issues

- **minor:** `ThemeCssVariableSource` uses `Css` instead of `CSS` (themeToCSSVariables.ts:10) — merged into the `typographyToCssVariables` major issue (same file, same convention violation)

## Screenshots

React component smoke test screenshots archived to `__ci_artifacts` branch at `artifacts/review/PR-3722/ui-critique/12-34-37/`.
