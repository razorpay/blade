---
"@razorpay/blade": minor
---

feat(Drawer): make contiguous gradient the default style for DrawerHeader

The `DrawerHeader` component now renders the gradient across the full drawer container (from the top, fading into the body) whenever a `color` prop is provided. This creates a seamless one-surface appearance without a visual break between header and body.

- The old header-only gradient is removed — no separate `variant` or `backgroundStyle` prop needed
- `showDivider` now defaults to `false`
- Pass `color` as before to get the improved full-drawer gradient
