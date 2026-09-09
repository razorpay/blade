# svelte-app example

A minimal Vite + Svelte 5 app that consumes `@razorpay/blade-svelte` (via the built `dist`,
same as a real consumer would), with a bundle size analyzer wired into the build.

## Usage

Build `blade-svelte` first so this app can resolve it:

```sh
yarn workspace @razorpay/blade-svelte build
```

Then build this app and open the report:

```sh
yarn workspace svelte-app analyze
```

Or step by step:

```sh
yarn workspace svelte-app build   # writes dist/ + dist/stats.html
open packages/examples/svelte-app/dist/stats.html
```

`dist/stats.html` is an interactive treemap (via `rollup-plugin-visualizer`) showing gzip/brotli
size per module — Blade components, Svelte runtime, blade-core utils, etc.

For a dev server instead:

```sh
yarn workspace svelte-app dev
```
