---
'@razorpay/blade': patch
'@razorpay/blade-core': patch
'@razorpay/blade-svelte': patch
---

fix: synchronize BottomSheet body and footer transition animations

Cascades the `--bs-transition-duration` CSS custom property from the BottomSheet surface to its body and footer so all three animate in sync. Also measures footer height synchronously (matching body timing) to prevent out-of-sync animations when the sheet opens/closes.
