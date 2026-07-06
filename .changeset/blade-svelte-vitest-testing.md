---
'@razorpay/blade-svelte': patch
---

Add unit/component testing setup for blade-svelte using Vitest + @testing-library/svelte (jsdom), mirroring the React package's CSR/SSR split. Adds `test`, `test:watch`, and `test:coverage` scripts, a two-project (`client` + `ssr`) Vitest config, and example Button tests. This is internal tooling only — no runtime or public API changes.
