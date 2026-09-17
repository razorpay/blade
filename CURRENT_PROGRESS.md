# Tailwind Migration — Current Progress

Migrating `blade-svelte` + `blade-core` styling from **CSS Modules → Tailwind v3 (CVA retained)**, per [`TAILWIND_MIGRATION_PLAN.md`](./TAILWIND_MIGRATION_PLAN.md).

- **Branch:** `feat/blade-tailwind-migration`
- **PR:** [#3999](https://github.com/razorpay/blade/pull/3999) (ready for review)
- **Commits:** 3 (Phase 0, Phase 1, changeset)
- **Last updated:** 2026-09-17

The public `get*Classes()` API and the Svelte components are **unchanged** — only the values (hashed CSS-module classes → literal Tailwind strings) change. Runtime dark/brand theming is preserved because every utility resolves to the existing `var(--…)` tokens.

---

## ✅ Phase 0 — Shared infrastructure (DONE, verified)

`packages/blade-core`

- **Tailwind preset** — `tailwind/preset.cjs`, **generated** from the same token sources as `theme.css` via `tailwind/generatePreset.ts` (`yarn generate:tailwind-preset`). `preflight: false`, `theme.extend`-only.
  - Namespaced spacing (`p-spacing-4`) + semantic color keys so Blade never collides with a consumer's default scale (`p-4`, `bg-red-500`).
  - Opacity maps onto Tailwind defaults + only the two missing literal steps (`56`, `64`) — preserves `utilities.module.css` semantics (those classes are literal percentages, **not** the opacity tokens).
  - Every value resolves to `var(--…)`; dark mode keys off `[data-blade-color-scheme='dark']`.
- **Safelist** — `tailwind/safelist.cjs` (generated), covers runtime-composed classes (styled-props, dynamic colors) the JIT scanner can't see; re-exported by the preset.
- **Hard-case plugin** — `tailwind/plugin.cjs` (hand-authored), emits component classes into the same build.
- **`cn` / `twMerge`** — `src/utils/cx.ts`, `extendTailwindMerge` configured for Blade's custom groups; `cx` kept for non-conflicting joins.
- **styled-props resolver** — `src/utils/styledProps/getStyledPropsClasses.ts` remapped from the `utilities.module.css` vocabulary to Tailwind (display/visibility/position/margin/self/flex-wrap).
- **Drift-guard test** — `tailwind/__tests__/preset-drift.test.ts`.
- **package.json** — new exports `./tailwind/preset`, `./tailwind/safelist`; `generate:tailwind-preset` script; `tailwindcss` peer + `tailwind-merge` dep.

## ✅ Phase 1 — Gated pilot: Badge + Button (DONE, verified)

- **Badge** (pure atomic + `compoundVariants`) — `src/styles/Badge/badge.ts` rewritten; chained `.color-*.emphasis-*` selectors + checkout shape rules moved into `compoundVariants`; `getBadgeClasses` routed through `cn`. `badge.module.css` **deleted**.
- **Button** (hybrid via plugin) — the 677-line `button.module.css` (accent `--btn-*` var bundles, radial-highlight `::before`, multi-layer inset box-shadow / focus-ring stacks, definite/indefinite loaders, `@keyframes`, `prefers-reduced-motion`) ported faithfully into `tailwind/plugin.cjs` as `blade-btn-*` component classes. `button.module.css` + its side-effect import **deleted**. `information`/`notice` colors keep their original no-op behavior.
- **blade-svelte Storybook/dev** wired to the standard consumer path (Appendix A): `tailwind.config.cjs` (preset + content-scan), `.storybook/tailwind.css` (`@tailwind components/utilities`, no base), `postcss.config.cjs`, `preview.js`. `autoprefixer`/`tailwindcss` added to devDependencies.

### Verification performed

- `blade-core`: `yarn build`, `yarn typecheck`, `yarn test` green (new preset-drift, `cn`/tailwind-merge dedup, styled-props mapping tests).
- `blade-svelte`: full suite **101/101** pass (incl. Button SSR + styleOverride), `svelte-check` **0 errors**.
- **Single-bundle dedup (plan Q1):** standard-consumer Tailwind build over Blade source emits Badge/Button classes with each shared utility emitted **exactly once**, no Blade utility sheet imported.
- Real Tailwind-engine checks: all Badge classes + every Button hard case (box-shadows, `::before`, both `@keyframes`, reduced-motion, states, icon-only sizing) resolve to the correct `var(--…)`.
- `dist` JS carries literal Tailwind strings, no `.module.css` import for the pilot.

---

## ⏳ Remaining work (NOT done)

### Gate before Phase 2
- [x] **Live visual-parity verification** of Badge + Button — DONE 2026-09-17 via blade-svelte Storybook (:6007) + agent-browser. Verified Badge subtle/intense × 6 colors and Button variants/disabled/indefinite-loader/icon-only-sizes in **light, dark (`[data-blade-color-scheme='dark']`), and an ICICI `createTheme` brand**. compoundVariants (Badge color×emphasis) + all plugin hard cases (loader `@keyframes`, disabled bundle, icon-only square sizing, box-shadow/border stacks) render correctly; brand override flips primary→orange while other semantics stay put. **Gate PASSED.**

### Phase 2 — one-shot sweep (~28 remaining components) — IN PROGRESS (started 2026-09-17)
Migrate the rest, deleting each `.module.css`. Unmigrated components currently keep their `.module.css` and render unchanged (both paths coexist).

**Per-component checklist (proven on the first wave):**
1. Rewrite the CVA `.ts`: `styles['hashed']` → literal Tailwind strings; chained selectors (`.a.b`) → `compoundVariants`; route class getters through `cn`.
2. Hard cases (keyframes / pseudo-elements / nested descendant selectors / box-shadow stacks) → `tailwind/plugin.cjs` as `.blade-*` component classes; CVA references them by literal name.
3. Runtime-composed classes → **literal lookup maps** in the resolver (JIT-visible), not string interpolation (avoids touching the generated safelist).
4. Delete the `.module.css`.
5. **Remove the `import './x.module.css'` side-effect from BOTH `x.ts` AND `x/index.ts`** (the `index.ts` import is the easy-to-miss one — it broke the Storybook module graph until removed). Components whose `index.ts` still imports css: Avatar, IconButton, Skeleton, Spinner (handle when migrating each).
6. Verify: blade-core typecheck+test, blade-svelte svelte-check+test, Storybook visual spot-check (light/dark/brand where colored).

**Done + verified (8):** Divider, Code, TrustBadge, Counter, BaseLink, AnnouncementBanner, Collapsible, Breadcrumb. Plugin additions: `.blade-link` (BaseLink child transition), `.blade-announcement-banner-*` (dark-mode token swaps under both scoped + legacy selectors), `.blade-breadcrumb-*` (separator `:last-child` combinators + stepper descendant gap). All green: blade-core typecheck + 84/85 tests, blade-svelte svelte-check 0 errors + 101/101, and Storybook visual (light/dark/brand) for the whole set.

**⚠️ Workflow gotcha:** editing `tailwind/plugin.cjs` requires a **Storybook restart** — Vite HMR reloads source/CSS but NOT the Tailwind config, so new `.blade-*` component classes silently don't generate until restart. Batch plugin edits per wave, restart once, then visual-verify.

**Wave 2 done + verified (4):** ActionList, SegmentedControl, AppBar, BaseText. Plugin additions: `.blade-actionlist-*` (row state stack + section-separator hide), `.blade-segmented-item*` (focus/hover/disabled + selected hover override), `.blade-appbar-*` (logo img/svg descendant + title flex override), `:where(.blade-text-base)` (zero-specificity margin reset). BaseText color now emits safelisted `text-<token>` utilities; opacity/line-clamp/tracking are literal utilities. Verified: blade-core 84/85 (preset-drift PASS), blade-svelte 101/101 + svelte-check 0, visual (Text/Heading/ActionList/SegmentedControl/AppBar).

**Reclassified as hard/plugin (were listed "atomic"):** InputGroup (`:global()` corner-rounding into Input's `__blade-*` wrapper hooks — do WITH Input), CounterInput (`@keyframes` ×3 + `::-webkit-*-spin-button` + `[data-keyboard-focus]`), Tabs (large; assess).

**Remaining (24 `.module.css`):** Spinner, Input(baseInput/formHint/formLabel) + InputGroup, CounterInput, Tabs, Modal, BottomSheet, Toast(+toastContainer), Checkbox, Radio(+radioGroup), Chip(+chipGroup), Accordion, Card, Avatar, Tooltip, Switch, Skeleton, IconButton, Alert.

**Wave 3 done + verified (3):** Spinner, Skeleton, Switch. Plugin: `.blade-spinner-box` + `@keyframes spinner-rotate` (color set on root as `text-*`, SVG inherits via currentColor); `.blade-skeleton` dual-`@keyframes` fade-in+pulse; full `.blade-switch-*` port (compound size across track/thumb/icon, sibling focus ring, label-hover, `path` fills, `@media` mobile sizing). Skeleton flex tables remapped to Tailwind (`self-*`, `flex-*`). Verified: typecheck, svelte-check 0, visual (spinner ring, skeleton pulse, switch on/off with checkmark).

**Remaining (21 `.module.css`):** IconButton, Input(baseInput/formHint/formLabel) + InputGroup, CounterInput, Tabs, Modal, BottomSheet, Toast(+toastContainer), Checkbox, Radio(+radioGroup), Chip(+chipGroup), Accordion, Card, Avatar, Tooltip, Alert.

**Commits (stacked branch `feat/blade-tailwind-phase2` on top of `feat/blade-tailwind-migration`):** wave 1 (8), wave 2 (4), wave 3 (3).

- Mostly atomic (lower risk): Divider, Code, Counter, TrustBadge, CounterInput, Breadcrumb, AppBar, ActionList, AnnouncementBanner, Collapsible, BaseText, BaseLink, InputGroup, SegmentedControl, Tabs.
- Hard cases (need plugin component classes — keyframes / pseudo-elements / box-shadow / nested selectors): **Spinner** (spinner-rotate keyframes, nested `.color-* .spinner-icon`), **Input** (baseInput/formHint/formLabel), **Modal**, **BottomSheet**, **Toast** (toast/toastContainer), **Checkbox**, **Radio** (radio/radioGroup), **Chip** (chip/chipGroup), **Accordion**, **Card**, **Avatar**, **Tooltip**, **Switch**, **Skeleton** (flex-utility mapping tables emit `align-self-*` etc. → remap to Tailwind `self-*`).

### Phase 3 — cleanup
- [ ] Delete `utilities.module.css` + `utilities.ts` once nothing references them.
- [ ] Remove `rollup-plugin-postcss` module handling from `blade-core/rollup.config.mjs`; shrink/remove `getStylesConfig`.
- [ ] Optional prebuilt stylesheet for non-Tailwind consumers.
- [ ] Update `blade-core`/`blade-svelte` READMEs + `Installation.stories.svelte`; publish the standard integration doc.
- [ ] Clean stale `*.module.css/` dirs left in `dist` by incremental builds (build has no clean step).

---

## Notes / gotchas
- `kebabCase` keeps digits attached → `--border-radius-2xsmall` (not `-2-xsmall`); the preset generates Tailwind keys directly from token keys.
- `src/tokens/__tests__/theme-css-layers.test.ts` **fails on `master` already** (committed `theme.css` utility tail is prettier-indented; the test expects it unindented) — pre-existing and unrelated to this migration; left untouched.
- The `@layer blade` override-wins guarantee and a preflight-absence test are noted in the plan as guardrails but are **not yet added** as dedicated tests.
