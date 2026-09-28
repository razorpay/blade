---
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add all Blade icons

blade-svelte now ships the full Blade icon set (452 icons), generated from the same source as the React package. `iconMap` and the `Icons` export list are generated too, so new icons land in both packages from a single `yarn generate-icons` run. Adds the `G`, `Rect`, `Circle`, `Defs` and `ClipPath` SVG primitives needed by a handful of icons.

**Breaking change to `iconMap`:** `RazorpayTrustIcon` is no longer a key in the exported `iconMap` (it is excluded via `ICON_MAP_EXCLUDES` in the generator, matching the React package's behaviour). The component itself is still exported from `index.ts`; only the `iconMap` entry is removed. Consumers accessing `iconMap.RazorpayTrustIcon` will now get `undefined` — use the direct import instead.
