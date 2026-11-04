---
'@razorpay/blade-svelte': minor
---

fix(blade-svelte): write the icon font's WOFF2 with Node's own Brotli (and WOFF2's `glyf` transform) and drop `wawoff2`, whose bundled Brotli decoder has an out-of-bounds write advisory
