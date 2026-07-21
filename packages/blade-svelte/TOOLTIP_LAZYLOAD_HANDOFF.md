# Handoff: Lazy-loading Tooltip in blade-svelte + making it actually reduce bundle size

## Goal

Make `Tooltip` in blade-svelte's `TextInput` (shared via `BaseInput`) load lazily so its
~12 KB is deferred off the initial bundle for consumers who never use the tooltip path.

## TL;DR of the investigation

- Lazy-loading Tooltip **inside the component alone changes the bundle by 0 bytes.**
- Root cause: a module only splits into its own chunk if **every** remaining path to it is
  dynamic. Two things keep a static path alive and merge the dynamic import back in:
  1. `blade-svelte/package.json` has **no `sideEffects` field** → consumer bundlers assume
     `sideEffects: true` (conservative) and won't drop the barrel's static re-export of Tooltip.
  2. `Tooltip.js` has a genuine top-level side effect: `void getTooltipTemplateClasses();`
     (CSS-retention hack) → the module isn't safely droppable/splittable.
- Vite confirms with: *"Tooltip.js is dynamically imported by BaseInputVisuals.js but also
  statically imported by components/index.js … dynamic import will not move module into another chunk."*

### Evidence (from `packages/examples/svelte-app/dist/stats.html`, single 242 KB chunk)

- Tree-shaking mostly works: 19 unused components render at **0 B** (Accordion, AppBar, Card,
  BottomSheet, etc.). AppBar is NOT the culprit — it's shaken out.
- Tooltip renders at **12,109 B** purely because the internal dynamic `import()` force-includes
  it, and the residual static barrel edge prevents isolating it into an async chunk.

## Current state of the code

**Already applied** — `packages/blade-svelte/src/components/Input/BaseInput/BaseInputVisuals.svelte`:

- Removed static `import Tooltip from '../../Tooltip/Tooltip.svelte'`.
- Added lazy loader:
  ```svelte
  let Tooltip = $state<typeof import('../../Tooltip/Tooltip.svelte').default | null>(null);
  $effect(() => {
    if (showValidationTooltip && !Tooltip) {
      void import('../../Tooltip/Tooltip.svelte').then((m) => { Tooltip = m.default; });
    }
  });
  ```
- Guarded render: `{#if showValidationTooltip && Tooltip}`.
- `yarn svelte-check` passes (0 errors, no new warnings).

This change is correct but has **no bundle benefit** until the package-level items below are fixed.
It is safe to keep or revert on its own.

## The correct general model (for reference)

A single barrel `index.js` re-export IS compatible with lazy-loading. Three conditions must all hold:

1. **Preserved-modules build** so dynamic-import targets are real separate files.
   → blade-svelte already builds with this (`dist/lib/components/**/**.js`). ✅
2. **Accurate `sideEffects` metadata** so the consumer's bundler may drop the barrel's unused
   static re-export, leaving only the dynamic edge. → **missing.** ❌
3. **Lazy module has no genuine top-level side effects** so it's actually droppable/splittable.
   → violated by `void get*TemplateClasses()`. ❌

Notes:
- `sideEffects` does NOT shrink the library's own `dist/` — it's metadata the *consumer's*
  bundler reads. Absent field ⇒ bundlers assume every module may have side effects ⇒ over-include.
- Do NOT set `"sideEffects": false` blindly: components genuinely rely on CSS side effects, and a
  false claim would make consumers drop styles. Whitelist CSS instead.

## Action plan for the executing agent

Do these in order and measure after each with `cd packages/examples/svelte-app && yarn analyze:full`
(rebuilds blade-core + blade-svelte, then vite-builds the example and opens `dist/stats.html`).
Baseline: Tooltip = ~12,109 B in the single main chunk.

### Step 1 — Make CSS retention a tracked side effect (removes blocker #3)

- Find the `void get*TemplateClasses()` top-level calls in `blade-svelte/src/components/**` (grep:
  `grep -rn "TemplateClasses()" packages/blade-svelte/src`). They exist to stop CSS being
  tree-shaken (see `.claude/rules/svelte-migration.md`).
- Replace the JS-side-effect retention with an actual tracked stylesheet import so the module
  becomes genuinely pure, e.g. `import './tooltip.css';` (or whatever the blade-core styles entry
  exposes as a real CSS file). Confirm the CSS still lands in the consuming bundle for USED
  components after the change.
- Verify with `yarn svelte-check` and the example app's rendered styles.

### Step 2 — Add accurate `sideEffects` to `packages/blade-svelte/package.json` (removes blocker #2)

```json
"sideEffects": ["**/*.css", "**/*.module.css"]
```
- Rebuild deps and re-run `analyze:full`.
- **Expected:** Tooltip drops out of the main chunk into its own lazily-fetched chunk (a separate
  `assets/*.js` file), or disappears from the initial chunk entirely. `stats.html` should show
  Tooltip in a distinct chunk, not `index-*.js`.
- **Regression check:** used components (Button, TextInput/Input, Alert, Badge) must still render
  with correct styles in the example app. Diff `stats.html` component list vs. baseline to ensure
  nothing needed was dropped.

### Step 3 — (Optional, only to demonstrate/validate the split cleanly)

If you want a barrel-free proof, the example app currently imports from the barrel:
`packages/examples/svelte-app/src/App.svelte`
```js
import { Button, TextInput, Alert, Badge } from '@razorpay/blade-svelte/components';
```
The package `exports` map only exposes `./components` (barrel) and `./utils` — there is NO
per-component subpath. Deep imports would additionally require adding subpath exports:
```json
"./components/*": {
  "types": "./dist/types/components/*/index.d.ts",
  "svelte": "./dist/lib/components/*/index.js",
  "default": "./dist/lib/components/*/index.js"
}
```
This is a public-API decision — only do it if the team wants to sanction deep imports. Steps 1+2
should make the split work through the barrel without this.

## Acceptance criteria

- `packages/examples/svelte-app/dist/stats.html` shows Tooltip is NOT in the initial/main chunk
  (either its own async chunk or absent from initial load) when the example doesn't exercise
  `showHintsAsTooltip`.
- Used components keep correct styling in the running example app.
- `cd packages/blade-svelte && yarn svelte-check` passes with 0 errors.
- No CSS regressions for any component that ships CSS.

## Key files

- Component change (done): `packages/blade-svelte/src/components/Input/BaseInput/BaseInputVisuals.svelte`
- CSS side-effect calls to rework: `grep -rn "TemplateClasses()" packages/blade-svelte/src`
- Package metadata: `packages/blade-svelte/package.json` (`exports`, add `sideEffects`)
- Barrel: `packages/blade-svelte/src/components/index.ts`
- Measurement app: `packages/examples/svelte-app/` (`yarn analyze:full`, `dist/stats.html`)
- Migration CSS rule context: `.claude/rules/svelte-migration.md`
