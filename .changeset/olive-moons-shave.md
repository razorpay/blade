---
'@razorpay/blade': patch
---

feat: declare `sideEffects` in `package.json` to enable consumer tree-shaking

Blade's build output is already per-module (`preserveModules`) and side-effect free apart from a
handful of known modules, but without a `sideEffects` field bundlers must assume every one of the
~2,400 emitted modules has import-time side effects. That prevents webpack/Turbopack from pruning
anything out of our `export *` barrels — importing a single component pulls in most of the library.

This declares an explicit allowlist of the modules that genuinely do have side effects
(the `dayjs.extend()` registrations, the native `@formatjs` polyfills, `fonts.css`, the CJS
`bladeCoverage` entry, and inlined third-party code), leaving the rest prunable.

Note: this must stay an allowlist. A bare `"sideEffects": false` would let bundlers delete
`import '@razorpay/blade/fonts.css'` and the dayjs plugin registrations, both of which fail silently.
