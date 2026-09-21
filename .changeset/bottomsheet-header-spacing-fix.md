---
"@razorpay/blade-core": patch
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): BottomSheet header spacing and IconButton focus ring

Fixed BottomSheet header spacing so empty headers stay consistent whether or not the drag handle is shown, and replaced the native close button with `IconButton`. Restores the `IconButton` focus-visible ring in blade-core after a CSS nesting regression dropped the 4px ring back to the browser default outline.
