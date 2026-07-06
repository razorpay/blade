---
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): close gap between Tooltip arrow and bubble on left/right placements

The arrow SVG was rendered non-square (14×8). Left/right placements rotate the arrow ±90° about its center, which shifted the flat base off the bubble edge by `(width - height) / 2` (3px), leaving a visible gap. The SVG box is now square (14×14), mirroring `@floating-ui/react`'s `FloatingArrow`, so the base stays flush on every side.
