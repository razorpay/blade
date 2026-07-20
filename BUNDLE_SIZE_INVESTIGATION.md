# blade-svelte Bundle Size Investigation (PR #3745)

Investigation into the accuracy of the bundle-size monitoring infrastructure added in
[PR #3745](https://github.com/razorpay/blade/pull/3745), which mirrors the `blade`
package's size-limit setup for `blade-svelte`.

## Question

What is the effective bundle size of `blade-svelte`, base bundle + per-component breakdown,
as reported by the PR's own tooling (`scripts/generateBundleSizeInfo.js` + `size-limit`)?

## How the tooling works

`packages/blade-svelte/scripts/generateBundleSizeInfo.js`:
- Walks `dist/lib/components` for exported component groups (from the intermediate `index.js`
  files), excluding internal `Base*` components and `ComponentIds`.
- For each group (plus one `Base` run with `importedComponents: '{}'`, i.e. nothing imported),
  writes a `.size-limit.json` config pointing `path` at `./dist/lib/components/index.js` with
  an `import` filter for just that group, and runs `yarn size-limit --json`.
- `size-limit` (via `@size-limit/preset-big-lib`) bundles that import with webpack and reports
  the gzipped size — this is meant to reflect real tree-shaken cost.

## First pass: numbers looked broken

Running the tooling as-is against the PR branch produced `prBundleSizeStats.json` with **35
entries** (`Base` + 34 component groups; the Card family is skipped as "not exported from main
index"). Nearly every entry, including `Base` (which imports nothing), came back at
**~267 KB gzipped**, with the rest clustering within ±0.5 KB of that. That's the signature of
a tree-shaking failure, not real per-component costs.

### Initial (wrong) explanation

I first described `Base` as "just BladeProvider + theme, no components" — but blade-svelte has
no `BladeProvider`. That was flagged as a factual error, which prompted a proper investigation
instead of just relabeling the same broken numbers.

## Root cause investigation

Two candidate causes were checked directly against the PR branch source:

1. **`packages/blade-svelte/package.json`** — no `sideEffects` field exists at all.
   Without `sideEffects: false`, webpack (used internally by `size-limit`) must conservatively
   assume every module has side effects and cannot safely drop unused exports.

2. **`packages/blade-svelte/rollup.config.mjs`** — the library's own build sets
   `treeshake: false` explicitly, alongside `preserveModules: true` and a custom
   `injectSvelteImports()` plugin that works around a documented Svelte 5 compiler bug (import
   statements get stripped when the compiler transforms component usage into function calls).

   Initial instinct was that `treeshake: false` was the bug. **It is not.** For an ESM library
   built with `preserveModules`, disabling tree-shaking at the library's own build step is
   correct practice — the library shouldn't decide what's "unused"; that decision belongs to
   whatever bundler consumes it (an app, or in this case `size-limit`'s webpack pass), which can
   see the whole dependency graph and safely prune it. Rollup's `preserveModules` output is
   designed to preserve per-module boundaries specifically so the *consumer's* bundler can do
   this.

   That reframes `size-limit`/webpack as "the consuming app" in this measurement setup — and a
   consuming bundler can only tree-shake blade-svelte's modules if `sideEffects` tells it that's
   safe.

## Fix verified locally

In an isolated worktree off the PR branch, added:

```diff
   "svelte": "./dist/lib/components/index.js",
+  "sideEffects": false,
   "files": [
     "dist"
   ],
```

Rebuilt `blade-core` → `blade-svelte`, reran `yarn generate-bundle-size-info`. Result:

- **`Base` (nothing imported): 0 KB** (was ~267.34 KB before the fix)
- Every component group now reports a distinct, real gzipped size instead of the same flat
  ~267 KB.

This confirms the bug was **missing `sideEffects: false`** in `packages/blade-svelte/package.json`,
not the `treeshake: false` Rollup setting (which is intentional and correct given
`preserveModules`).

## Corrected numbers

Base bundle (nothing imported): **0 KB**. All values below are gzipped, includes shared runtime
cost pulled in by each isolated `size-limit` bundle (Svelte internals, blade-core utils, token
plumbing) — not a one-time app-level cost, since `Base` itself is 0 KB.

| Component(s) | Gzip Size | Delta over Base |
|---|---|---|
| PhoneNumberInput | 199.10 KB | +199.10 |
| TextInput | 170.69 KB | +170.69 |
| PasswordInput | 169.87 KB | +169.87 |
| SearchInput | 169.86 KB | +169.86 |
| OTPInput | 168.04 KB | +168.04 |
| Toast, ToastContainer, useToast | 164.30 KB | +164.30 |
| Alert | 163.62 KB | +163.62 |
| BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter | 162.89 KB | +162.89 |
| AppBar, AppBarLeading, AppBarActions | 162.65 KB | +162.65 |
| Collapsible, CollapsibleButton, CollapsibleLink, CollapsibleText, CollapsibleBody | 162.43 KB | +162.43 |
| ActionList, ActionListItem, ActionListItemAsset, ActionListItemText, ActionListItemIcon, ActionListItemAvatar, ActionListItemBadge, ActionListItemBadgeGroup, ActionListSection | 161.08 KB | +161.08 |
| Button, IconButton | 159.47 KB | +159.47 |
| Tooltip, TooltipInteractiveWrapper | 156.59 KB | +156.59 |
| SegmentedControl, SegmentedControlItem | 155.14 KB | +155.14 |
| Avatar, AvatarGroup | 154.98 KB | +154.98 |
| Accordion, AccordionItem, AccordionItemHeader, AccordionItemBody | 154.35 KB | +154.35 |
| CounterInput | 153.74 KB | +153.74 |
| Checkbox, CheckboxGroup | 153.60 KB | +153.60 |
| InputGroup, InputRow | 153.45 KB | +153.45 |
| Breadcrumb, BreadcrumbItem | 153.19 KB | +153.19 |
| Radio, RadioGroup | 152.17 KB | +152.17 |
| Tabs, TabList, TabItem, TabPanel | 152.12 KB | +152.12 |
| Chip, ChipGroup | 151.69 KB | +151.69 |
| TrustBadge | 151.59 KB | +151.59 |
| Link | 150.88 KB | +150.88 |
| Amount | 150.86 KB | +150.86 |
| Text, Heading, Code | 150.42 KB | +150.42 |
| Spinner | 150.06 KB | +150.06 |
| Badge | 149.58 KB | +149.58 |
| Counter | 149.34 KB | +149.34 |
| Switch | 149.32 KB | +149.32 |
| AnnouncementBanner | 149.18 KB | +149.18 |
| Skeleton | 148.87 KB | +148.87 |
| Divider | 147.34 KB | +147.34 |

**Skipped** (not exported from main index, so not measurable by this tooling): Card, CardBody,
TicketCard, TicketCardBody, TicketCardFooter, InfoCard, InfoCardBody, InfoCardFooter,
CardHeader, CardHeaderLeading, CardHeaderTrailing, CardHeaderIcon, CardHeaderCounter,
CardHeaderBadge, CardHeaderAmount, CardHeaderText, CardHeaderLink, CardHeaderIconButton,
CardFooter, CardFooterLeading, CardFooterTrailing.

## Open item / recommendation

Add `"sideEffects": false` to `packages/blade-svelte/package.json` as part of PR #3745 (or as a
follow-up fix) so the bundle-size CI comment reports real per-component numbers instead of a
flat ~267 KB for everything. This was verified locally in a throwaway worktree only — not yet
committed or pushed to the PR.
