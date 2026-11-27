---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(blade): RazorSense 2.0's big piece and success moment. `RazorSenseBackground` is the login page's big RazorSense as a page background: it fills its box, draws only the part of the piece inside it, and plays its loop, drift and colour loop on one canvas. `RazorSenseSuccess` is the success orb rising into place, then turning into Blade's success badge with its check; it plays once when it mounts and calls `onComplete`. Both follow Blade's color scheme, each with its own light and dark tuning.
