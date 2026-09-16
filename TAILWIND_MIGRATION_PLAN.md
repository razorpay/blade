# Migrate blade-svelte + blade-core from CSS Modules to Tailwind (keep CVA)

## Context

`blade-svelte` components are logic-only; **all CSS lives in `blade-core`** — 39 `.module.css` files, 30 CVA `.ts` files, a 1,951-line `utilities.module.css`, and a generated `theme.css` (token CSS variables). Components consume `get*Classes()` helpers from `@razorpay/blade-core/styles` and bind them via `cx()`.

We are replacing CSS-Module authoring with **Tailwind v3 utilities driven by CVA**, while (a) keeping the `get*Classes()` public API and the Svelte components **unchanged**, (b) preserving runtime theming (dark mode / `createTheme`) by mapping Tailwind onto the existing `var(--…)` tokens, and (c) shipping so a Tailwind consumer produces a **single deduped utility layer**.

**Independence principle (load-bearing):** Blade stays a self-contained, consumer-agnostic library. It ships **standard** Tailwind artifacts (a preset + statically-analyzable class strings) that work with *any* Tailwind v3 app, plus an **optional prebuilt stylesheet** for non-Tailwind/standalone use. Nothing in the library depends on `razorpay/checkout`'s config or its custom Vite plugin. Checkout is validated as the first consumer, but only via the standard integration path (Appendix A) — no checkout-specific code, aliases, or hacks in Blade.

Target Tailwind version is **v3.4.x** (matches the first consumer, checkout, and is the current stable major; v4's CSS-first `@theme` is intentionally not used).

## Locked decisions

1. **Tailwind v3.4.x**, standard JS **preset** distribution.
2. **Delivery = consumer scans Blade source** for the Tailwind path: Blade ships a preset + source/`dist` containing **literal** class strings; the consumer adds Blade to its `content` and Blade's preset to `presets`. Blade ships **no** compiled utility sheet on this path (that would reintroduce duplication). Optional prebuilt sheet exists for non-Tailwind consumers.
3. **Tokens map onto existing CSS vars** — preset entries resolve to `var(--…)`; runtime dark/brand theming via `BladeProvider` is untouched.
4. **Pilot first, then one-shot the rest.** Migrate Badge + Button as a gated pilot; once parity is proven, migrate **all remaining ~28 components in one pass**.
5. **Named preset utilities** (not arbitrary values) for tokens: register Blade tokens in the preset so components use `bg-feedback-background-neutral-intense`, `px-spacing-2`, `rounded-max`. These are standard Tailwind utilities generated from `theme.extend` (like `bg-red-500`), **not** hand-authored CSS. Reserve arbitrary values (`p-[var(--spacing-4)]`, `h-[14px]`) only for genuine one-offs a token doesn't cover. Rationale: readable, autocompletable, lintable, matches checkout's own themed-Tailwind style; identical runtime theming to arbitrary values since both resolve to the same `var(--…)`.

## Answers to the review questions

**Q1 — One Tailwind bundle, zero repeated classes on the consumer?** Yes, by construction. Tailwind's JIT generates each utility class **once per build** regardless of how many files reference it. The consumer runs one Tailwind build over the union of *its own* sources + *Blade's* `dist`, so `flex`, `p-spacing-4`, `bg-interactive-background-primary-default`, etc. are each emitted a single time and shared. The two things that would break this are explicitly avoided: (i) Blade does **not** ship/import a second compiled utility sheet on the Tailwind path; (ii) the only Blade stylesheets the consumer imports are `theme.css` (CSS-variable *definitions*, no utility classes) and `fonts.css`. Hard-case styles are emitted by the **same** build via a preset plugin (below), not a separate file. Net: one utility bundle, no duplicates.

**Q2 — Follows Svelte-library + Tailwind best practices?** Yes — enumerated in "Best practices" below. The core ones: distribute a **preset** (Tailwind's official multi-project mechanism) rather than forcing consumers to hand-copy theme; **`preflight: false`** so the library never resets a consumer's globals; keep class strings **statically analyzable** + **safelist** anything runtime-composed; **CVA + `tailwind-merge`** for variants and conflict-free overrides; **no `<style>` blocks** in Svelte SFCs (blade-svelte already ships zero CSS); `prettier-plugin-tailwindcss` for deterministic class ordering.

**Q3 — No checkout hacks; library stays independent?** Enforced. The preset is a standard `tailwindcss` preset consumed via the ordinary `presets`/`content` API — no dependency on checkout's `@razorpay/native/tailwind` plugin or its `tailwind.config.js`. Hard cases live in a Blade-owned Tailwind **plugin**, not a consumer-specific file. Blade also ships an optional prebuilt sheet so it works with zero Tailwind knowledge (its own Storybook uses the standard path). Checkout integration is documented as an example only (Appendix A).

**Q4 — Migrate everything after a successful pilot?** Yes. Phase 1 is the gated pilot (Badge + Button); Phase 2 is a **single big-bang migration of all remaining components**, removing `.module.css` wholesale; Phase 3 is cleanup.

## Reference facts (already discovered — trust these, verify only if code changed)

**Repo layout & counts (`packages/blade-core/src/styles/`):** 39 `.module.css` files (38 component + `utilities.module.css`), 30 CVA `.ts` files, 19 `get*TemplateClasses()` anti-tree-shake fns. `blade-svelte` ships **JS only, zero CSS** (`emitCss:false`); all CSS is authored in `blade-core` and consumed via `@razorpay/blade-core/styles`.

**Token → CSS-var contract (this is what Tailwind must map onto):**
- CSS-var naming = `--<kebab-cased-dot-path>` produced by `packages/blade-core/src/utils/tokenToCSSVariable/tokenToCSSVariable.ts`. Examples: `--spacing-4`, `--border-radius-medium`, `--font-size-100`, `--interactive-background-primary-default`, `--surface-text-on-sea-subtle`, `--feedback-background-neutral-intense`. **There is NO `--colors-` prefix** — the semantic category (`interactive`/`surface`/`feedback`/`overlay`/`popup`/`data`) is the first segment. camelCase segments kebab-split (`staticWhite`→`static-white`, `onSea`→`on-sea`, `skyBlue`→`sky-blue`).
- **Spacing scale is non-linear** (unitless→px): `0:0,1:2,2:4,3:8,4:12,5:16,6:20,7:24,8:32,9:40,10:48,11:56`. So `spacing.2`=4px — do **not** assume a `4*n` scale, and never reuse Tailwind's default `p-2`(=8px).
- **border.radius** keys: `none,2xsmall(2),xsmall(4),small(8),medium(12),large(16),xlarge(20),2xlarge(24),max(9999),round(50%)`. **border.width**: `none,thinner(.5),thin(1),thick(1.5),thicker(2)`.
- Token **categories** to map: global (mode-agnostic) `spacing, border-radius, border-width, breakpoint, font-family, font-size, font-weight, line-height, letter-spacing, duration, delay, easing, opacity, elevation`; semantic (light/dark-split) colors `surface, feedback, interactive, overlay, popup, data`. `size` tokens and raw chromatic/neutral palettes are **not** emitted — ignore.
- **Light/dark/brand mechanics:** `theme.css` sets light in `:root` and dark under `:root[data-blade-color-scheme='dark']` (+ legacy `body[data-theme='dark']`). `bladeNeutralTheme` and `createTheme(...)` brands are **never** static — `BladeProvider` injects them at runtime as inline `--var` overrides on `[data-blade-provider]` via `themeToCSSVariables` (`packages/blade-core/src/utils/themeToCSSVariables/`). ⇒ Tailwind color utilities must resolve to `var(--…)`, and any dark-specific config keys off the `[data-blade-color-scheme='dark']` attribute (not `.dark` class or `prefers-color-scheme`).
- `theme.css` is generated by `packages/blade-core/scripts/generateThemeCSS.ts` (wrapped by `scripts/writeThemeCSS.ts`, `yarn generate:tokens-css`); a CI drift test (`src/tokens/__tests__/theme-css-*.test.ts`) fails if the committed file diverges. The Tailwind preset generator must follow this same generate-and-drift-guard pattern.

**Existing utilities & merge:** `packages/blade-core/src/styles/utilities.module.css` (1,951 lines) is a hand-rolled atomic layer (`display-flex`, `margin-x-spacing-1`, `padding-spacing-2`, `cursor-pointer`, `width-full`…) re-exported via `utilities.ts` as `utilityClasses`; CVA files reference it (e.g. Button's `isDisabled`→`utilityClasses['cursor-not-allowed']`). `packages/blade-core/src/utils/cx.ts` is just a re-export of CVA's `cx` (plain space-join, **no** conflict resolution). `mergeStyleOverride.ts` merges per-slot `styleOverride` records via `Object.assign` (later wins) — framework-agnostic, survives unchanged.

**Unaffected by this migration:** text/icon color & size flow into `BaseText`/`Icon` as **dot-notation token strings** (e.g. `feedback.text.neutral.intense`), resolved by `getTokenCSSVariable`, not as CSS classes. The `styleOverride` subsystem (`slotMetadata.ts`, `shared/styleOverride.ts`) injects per-slot classes into the same `cx()` merges — keep it, just route through `cn`.

## Architecture: the migration seam

Keep every `get*Classes()` / `get*TemplateClasses()` signature identical. **Only the values change**: `styles['color-neutral']` (hashed CSS-module class) → literal Tailwind strings. Svelte components (`Badge.svelte`, `BaseButton.svelte`, …) do **not** change. `.module.css` files are deleted as each component migrates.

Compound multi-prop CSS (today chained selectors like `.color-neutral.emphasis-subtle` inside the `.module.css`) moves **into CVA `compoundVariants`**, since there is no stylesheet to hold the chained selector. This is the main logic shift and is squarely what CVA is for.

### Representative transform — `packages/blade-core/src/styles/Badge/badge.ts`

Before → After (drop the `.module.css` import; color×emphasis moves into `compoundVariants`; values reference Blade tokens via the preset):
```ts
import { cva } from 'class-variance-authority';       // no './badge.module.css'

export const badgeStyles = cva(
  'inline-flex items-center justify-center rounded-max w-fit flex-nowrap bg-transparent',
  {
    variants: {
      size: {
        xsmall: 'h-[14px] px-spacing-2', small: 'h-[16px] px-spacing-2',
        medium: 'h-[20px] px-spacing-2', large: 'h-[24px] px-spacing-3',
      },
      color:    { neutral: '', positive: '', negative: '', notice: '', information: '', primary: '' },
      emphasis: { subtle: '', intense: '' },
    },
    compoundVariants: [
      // was `.color-neutral.emphasis-subtle { background: var(--feedback-background-neutral-subtle) }`
      { color: 'neutral', emphasis: 'subtle',  class: 'bg-feedback-background-neutral-subtle' },
      { color: 'neutral', emphasis: 'intense', class: 'bg-feedback-background-neutral-intense' },
      { color: 'primary', emphasis: 'subtle',  class: 'bg-surface-background-primary-subtle' },
      { color: 'primary', emphasis: 'intense', class: 'bg-surface-background-primary-intense' },
      // … positive/negative/notice/information × subtle/intense …
      { emphasis: 'subtle',  class: 'rounded-max' },
      { emphasis: 'intense', size: 'large',  class: 'rounded-small' },
      { emphasis: 'intense', size: 'xsmall', class: 'rounded-xsmall' },
    ],
    defaultVariants: { size: 'medium', color: 'neutral', emphasis: 'subtle' },
  },
);
```
`getBadgeClasses`, `getBadgeTemplateClasses`, and the token-string helpers (`getBadgeTextColorToken`, `badgeTextSizes`, …) are unchanged — text/icon color still flows into `BaseText`/`Icon` as dot-notation tokens, unaffected.

**`variants` vs `compoundVariants` (why `color`/`emphasis` are empty above):** `variants` apply classes based on **one** prop value in isolation (e.g. `size='large'` alone fully determines height/padding → stays in `variants`). `compoundVariants` apply classes only when **several** props match simultaneously (AND). Background color depends on `color` **and** `emphasis` together (`neutral+subtle` vs `neutral+intense` differ), so those two are declared as `variants` with empty strings and the real `bg-*` is emitted from `compoundVariants`. This is the one structural shift the migration forces: in CSS-Modules that pairing was a chained selector `.color-neutral.emphasis-subtle {…}` resolved by CSS specificity; with no stylesheet to hold it, the multi-prop logic moves into `compoundVariants`. Rule of thumb when migrating each component: single-axis rules → `variants`; any rule that was a multi-class CSS selector (`.a.b`) → one `compoundVariants` entry per combination.

## Best practices this follows

- **Preset distribution** — export a standard `tailwindcss` preset; consumers `presets: [require('@razorpay/blade-core/tailwind/preset')]`. Official multi-project pattern; no theme copy-paste.
- **`preflight: false`** in the preset — a library must never inject Tailwind's global reset into a consumer.
- **`theme.extend` only** — additive; never overrides a consumer's own scales.
- **Static class strings** — CVA base/variant/compound values are literals so the JIT scanner sees them; runtime-composed classes (styled-props) are covered by a generated **safelist**.
- **CVA + `tailwind-merge`** — variants via CVA; conflict-free last-wins overrides via `extendTailwindMerge` configured for Blade's custom groups.
- **No `<style>` blocks** in `.svelte` (blade-svelte already emits zero CSS) — utilities only.
- **Deterministic ordering** — adopt `prettier-plugin-tailwindcss` for class ordering across the packages.
- **Namespaced/semantic token keys** — no bare `p-4`/`rounded-md`-style names, so Blade utilities can never collide with a consumer's default scale.
- **Preset/token single source of truth** — preset is generated from the same token sources as `theme.css`, with a CI drift guard.

## Shared infrastructure (Phase 0, before the pilot)

### 1. Tailwind preset — `packages/blade-core/tailwind/preset.cjs` (generated)

`theme.extend`-only, mapping Blade tokens → `var(--…)`. **Generated** from token sources by a script mirroring `scripts/generateThemeCSS.ts` (reuse `tokenToCSSVariable`) so preset and `theme.css` never drift; add a CI drift test like the existing `theme-css-*` tests.

- **Colors** → full semantic tree (unique names): `bg-interactive-background-primary-default`, `text-surface-text-gray-normal`, `border-feedback-border-positive-intense` → `var(--<kebab-dot-path>)` (baked alpha, no `<alpha-value>` trick).
- **Spacing** → keys `spacing-0..spacing-11` → `var(--spacing-N)` ⇒ `p-spacing-4`, `mx-spacing-2`, `gap-spacing-3` (namespaced).
- **borderRadius / borderWidth / opacity / zIndex / transitionDuration / transitionTimingFunction / fontFamily / fontWeight / letterSpacing / screens** → Blade-named keys → `var(--…)`.
- **`corePlugins: { preflight: false }`**.
- **Plugin (hard cases)** — `plugin(({ addComponents, addUtilities, theme }) => …)` inside the preset owns the irreducible bits so they are generated by the *same* build: Button's `--btn-accent-*` var bundles, the radial-highlight `::before` component class, focus-ring/box-shadow stacks, and `theme.extend.keyframes` + `animation` for `btnDots`/`btnProgressRecede` + `prefers-reduced-motion`. CVA references these as literal class names (e.g. `blade-btn-surface`). No hand-authored CSS file, no `[&::before]:…` arbitrary-variant hacks.

### 2. Class-merge util — `cn` (`packages/blade-core/src/utils/cx.ts`)

`cx` today is CVA's plain join (no conflict resolution). Add:
```ts
import { extendTailwindMerge } from 'tailwind-merge';
export const twMerge = extendTailwindMerge({ /* register: spacing-N, rounded-<blade>, semantic bg-/text-/border- groups */ });
export const cn = (...args) => twMerge(cx(...args));
```
Route base+override merges (`getBadgeClasses`, `BaseButton` styleOverride path, styled-props) through `cn`; keep `cx` for non-conflicting joins.

### 3. styled-props resolver — `packages/blade-core/src/utils/styledProps/getStyledPropsClasses.ts`

Remap emitted names from the `utilities.module.css` vocabulary to Tailwind. This function currently returns `{ classes: string[], inlineStyles }`; keep that shape and the inline-style fallbacks (numeric `zIndex`/`order`, arbitrary px, grid, array margins). Representative remap:

| Current (utilities.module.css) | Tailwind |
|---|---|
| `display-flex` / `display-block` / `display-none` | `flex` / `block` / `hidden` |
| `margin-x-spacing-1` / `margin-spacing-2` | `mx-spacing-1` / `m-spacing-2` |
| `padding-x-spacing-1` / `padding-spacing-2` | `px-spacing-1` / `p-spacing-2` |
| `top-spacing-3` / `left-spacing-2` | `top-spacing-3` / `left-spacing-2` |
| `align-self-center` / `justify-self-*` | `self-center` / `justify-self-*` |
| `flex-wrap-wrap` / `flex-wrap-nowrap` | `flex-wrap` / `flex-nowrap` |
| `visibility-hidden` / `position-absolute` | `invisible` / `absolute` |
| `cursor-pointer` / `cursor-not-allowed` / `width-full` (used by Button CVA) | `cursor-pointer` / `cursor-not-allowed` / `w-full` |

Maps stay literal (scannable); the full producible set goes in the safelist. Delete `utilities.module.css` + `utilities.ts` once nothing references them.

### 4. Safelist — `packages/blade-core/tailwind/safelist.cjs` (generated)

Enumerate every runtime-producible Blade class (all `p/px/py/m/mx/my/gap-spacing-N`, `self-*`, `flex-wrap*`, the full semantic `bg-/text-/border-` set). Exported from the preset so any consumer picks it up.

### 5. Cascade layer

Preserve the `@layer blade` guarantee (unlayered consumer styles beat Blade without `!important`). Emit Blade's `utilities`/`components` into `@layer blade`; keep `layers.css` (`@layer blade;`) as the order declaration. Add a test asserting an unlayered consumer class wins.

## Build / bundling changes

**blade-core (`rollup.config.mjs`, `postcss.config.js`, `package.json`):**
- Migrated `.ts` files drop `import './x.module.css'` + the `styles` object; `getStylesConfig` shrinks and is removed once the last module is gone.
- Add `yarn generate:tailwind-preset` (alongside `generate:tokens-css`) + drift test.
- `exports`: add `./tailwind/preset` and `./tailwind/safelist`; keep `./tokens/theme.css`, `./fonts.css`. **Optional prebuilt sheet** for non-Tailwind consumers: a `./styles.css` produced by Blade running its own Tailwind build over its source (self-contained, `@layer blade`, preflight off). Tailwind consumers do not import it (keeps Q1's dedup true); non-Tailwind consumers import it instead of adding a preset.

**blade-svelte:** still ships JS only (`emitCss:false`). Verify CVA literal strings survive in published `dist` JS (they do) so a scanning consumer finds them.

**Storybook / Vitest (Blade's own dev — uses the standard path, no checkout coupling):** add `tailwindcss` + `postcss` to the Vite path (`postcss.config.*` is already Vite-consumed). Add a Blade Tailwind entry CSS (`@tailwind components; @tailwind utilities;` — **no `@tailwind base`**) that scans `blade-core/src/**` + `blade-svelte/src/**` with Blade's own preset; import it in `.storybook/preview.js` alongside `theme.css`. This exercises the exact preset consumers use.

## Hard cases (kept inside the one Tailwind build)

~90% of rules are atomic-friendly. The irreducible bits — Button's radial-highlight `::before` (`--btn-gradient-size`), `@keyframes`, `prefers-reduced-motion`, multi-layer `box-shadow`/focus stacks parameterized by `--btn-accent-*` — are emitted by the **preset plugin** (`addComponents`/`addUtilities` + `theme.extend.keyframes/animation`), referencing the same `var(--…)` tokens. CVA references the generated component classes by name. This keeps everything in a single generated bundle (Q1) with no consumer-specific file (Q3). Button is the pilot precisely to lock this boundary before the sweep.

## Rollout

- **Phase 0 — infra:** preset + generator + drift test, plugin for hard cases, `cn`/tailwind-merge, styled-props remap, safelist, Blade Storybook/Vitest Tailwind build, `preflight:false`, `@layer blade` wiring, optional prebuilt-sheet build.
- **Phase 1 — gated pilot:** migrate **Badge** (pure atomic + compoundVariants) and **Button/BaseButton** (hybrid via plugin). Gate = visual parity vs current Storybook (all variants, dark via `[data-blade-color-scheme='dark']`, a `createTheme` brand), green tests/types, and a standard-path consumer smoke test proving single-bundle dedup.
- **Phase 2 — one-shot sweep (after gate passes):** migrate **all remaining ~28 components in one pass**, deleting every `.module.css`. Can fan out via the existing worktree/orchestrator pattern in `.claude/rules/` for parallel authoring, but lands as the completed set.
- **Phase 3 — cleanup:** delete `utilities.module.css` + `utilities.ts`, remove `rollup-plugin-postcss` module handling, update `blade-core`/`blade-svelte` READMEs + `Installation.stories.svelte`, publish the standard integration doc (Appendix A).

## Key risks / gotchas

- **Class-name collision** with a consumer's scale → namespaced (`spacing-N`) + semantic (color) keys; test that Blade emits no bare `p-4`/`rounded-md`.
- **JIT can't see runtime-composed classes** → safelist + literal maps in resolvers.
- **tailwind-merge misconfig** on custom groups → unit-test dedup for `p-spacing-*`, semantic `bg-*`, and styleOverride precedence.
- **Preflight leakage** → `preflight:false`; assert no `*,::before` reset in Blade output.
- **Layer ordering** regressions → keep `@layer blade` + override-wins test.
- **Preset/`theme.css` drift** → shared generator + CI drift test.
- **Accidental duplicate bundle** → CI/consumer check asserting the Tailwind path imports no Blade utility sheet (only `theme.css` + fonts).

## Verification

- **Unit:** `cd packages/blade-core && yarn test` — preset-generator drift, `cn`/tailwind-merge dedup, styled-props→Tailwind mapping, plugin output.
- **Type/build:** `yarn typecheck` (blade-core); `yarn build` in blade-core then blade-svelte; confirm blade-svelte `dist` JS carries literal Tailwind strings and zero CSS.
- **Visual parity:** blade-svelte Storybook — Badge + Button across all variants, dark mode, and a `createTheme` brand, vs the pre-migration build; existing browserstack/playwright suites as regression.
- **Independence + single-bundle proof:** in a throwaway **standard** Tailwind v3 app (not checkout), add only `presets:[blade preset]` + Blade in `content`, render Badge/Button, and assert (a) correct styling and (b) exactly one copy of each shared utility with no Blade utility sheet loaded. Repeat the standalone/non-Tailwind path using the optional prebuilt sheet.
- **Guardrails:** CI drift test, preflight-absence test, layer-order override test, duplicate-bundle check.

## Key files

- **Tokens/theme:** `packages/blade-core/src/tokens/theme.css` (generated), `scripts/generateThemeCSS.ts` + `scripts/writeThemeCSS.ts`, `src/utils/tokenToCSSVariable/tokenToCSSVariable.ts`, `src/utils/themeToCSSVariables/`, `src/tokens/global/*.ts`, `src/tokens/theme/{bladeTheme,bladeNeutralTheme,createTheme}.ts`.
- **New Tailwind artifacts:** `packages/blade-core/tailwind/preset.cjs` + generator + drift test; `packages/blade-core/tailwind/safelist.cjs`.
- **Styles to migrate:** `packages/blade-core/src/styles/**/{*.module.css,*.ts,index.ts}` (start `Badge/`, `Button/` incl. `Button/index.ts` side-effect import); `src/styles/utilities.module.css` + `utilities.ts` (delete at end); `src/styles/index.ts` (barrel, first line `import './layers.css'`); `src/styles/layers.css`.
- **Merge/props utils:** `packages/blade-core/src/utils/cx.ts` (add `cn`/`twMerge`), `src/utils/styledProps/getStyledPropsClasses.ts`, `src/utils/mergeStyleOverride.ts`.
- **Svelte consumers (should NOT change):** `packages/blade-svelte/src/components/Badge/Badge.svelte`, `Button/BaseButton/BaseButton.svelte`.
- **Build/dev:** `packages/blade-core/rollup.config.mjs`, `postcss.config.js`, `package.json` (exports); `packages/blade-svelte/rollup.config.mjs`, `.storybook/{main.js,preview.js}`, `vitest.config.ts`, `package.json`.

## Appendix A — checkout integration (example only, not part of the library)

Illustrative, non-load-bearing. Any Tailwind v3 consumer follows the same shape; checkout happens to use a source-scanning Vite plugin:
1. `presets: [require('@razorpay/blade-core/tailwind/preset')]` in `tailwind.config.js` (additive).
2. Add Blade to scanned sources (`@razorpay/blade-svelte/dist/**/*.js`, `@razorpay/blade-core/dist/**/*.js`) in `content` (or checkout's `tailwindCssPlugin({ content })`), plus Blade's safelist.
3. Keep the existing `@razorpay/blade-core/tokens/theme.css` + `@razorpay/blade-core/fonts.css` imports and wrap in `<BladeProvider>` (defines the `var(--…)` the utilities resolve to). Do **not** import any Blade utility sheet on this path.
