---
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): prevent BottomSheet focus from scrolling host content

Use `focus({ preventScroll: true })` when moving focus into the sheet on open and when returning focus to the trigger on dismiss. Stops the browser from scrolling scrollable ancestors (e.g. Checkout modals) while preserving keyboard and screen-reader focus behavior.
