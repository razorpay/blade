---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): modals leave partner popups clickable; icon font without `wawoff2`; font files exported

- **Overlays**: the top-level `BladeProvider` wraps its content in a `display: contents` element, and an open Modal, BottomSheet or Drawer makes only that wrapper inert, not everything beside the overlay host. A partner SDK's popup added to `<body>` (Apple Pay's QR sheet in Chrome) stays clickable. The wrapper doesn't change layout, but CSS child combinators across the provider (`.shell > main`) no longer match.
- **Inputs**: fill, border and focus ring animate as Blade React's `baseInput` (over `xgentle`, `emphasized`, the ring growing out of the box), and the ring's colour no longer fades in from the text colour. TextInput's 4px edge padding moves from the box onto the part at each edge, so the control, and the browser's autofill tint, reaches the field's frame.
- **Icon font**: the vite/webpack plugin writes the WOFF2 with Node's own Brotli (and WOFF2's `glyf` transform) and drops `wawoff2`, whose bundled Brotli decoder has an out-of-bounds write advisory.
- **Fonts**: `@razorpay/blade-svelte/fonts/*` exports the font files `blade.css` loads (`inter-regular.woff2`, `inter-medium.woff2`, `inter-semibold.woff2`, `tasa.woff2`), for a page that registers the faces itself (with `FontFace`) instead of loading `blade.css`.
