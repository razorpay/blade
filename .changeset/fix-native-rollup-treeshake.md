---
'@razorpay/blade': patch
---

fix(build): disable tree-shaking in native rollup config

The native build's `getNativeConfig` was tree-shaking aggressively, dropping bindings whose usage rollup couldn't see across the separately-bundled entries (components, tokens, utils). This silently broke multi-statement modules — for example `tokens/global/motion.ts` shipped with only the `easing` object literal as a discarded expression, with `delay`, `duration`, and the `motion` wrapper (and its export) stripped entirely. Same pattern affected `tokens/global/typography.ts`, `utils/logger/logger.ts`, and ~24 other native files. Result: `import { motion }` / `import { logger }` / etc. resolved to `undefined` at runtime in the published `@razorpay/blade@12.101.1` native bundle, which made every component depending on `theme.motion`, the BladeProvider, the Toast, and the React-Native splash flow crash.

Mirrors the existing `treeshake: false` setting (and rationale comment) on `getWebConfig`. Consumers (the React Native app's Metro bundler) tree-shake their own bundle, so disabling rollup-level tree-shaking on the published native artifact is the correct call.
