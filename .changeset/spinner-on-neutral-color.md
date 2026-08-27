---
'@razorpay/blade': minor
'@razorpay/blade-mcp': minor
---

feat(Spinner): add an `onNeutral` color for spinners on a filled neutral surface

`<Spinner color="onNeutral" />` reads `interactive.icon.onNeutral.normal`, which inverts with the theme. Every other spinner color is either static (`white`) or tracks the page surface (`neutral`, the feedback colors), so none of them stayed visible on a filled `neutral` surface, which is black on light and white on dark.

A loading `Button color="neutral" variant="primary"` and `FloatingActionButton color="neutral"` now use it. Both previously hardcoded a static white spinner, which disappeared against the white surface in dark mode. Fixes #3915 for the `neutral` surface.
