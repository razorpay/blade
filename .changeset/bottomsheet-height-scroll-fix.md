---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): budget grab handle and empty header in BottomSheet height

Measure empty `BottomSheetHeader` height instead of skipping it, and always budget grab-handle height in snap/scroll math. Zero both only when the header floats (zero body padding). Fixes spurious body scroll (~28px) on short sheets with an empty header and drag handle.
