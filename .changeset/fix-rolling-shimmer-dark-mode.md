---
"@razorpay/blade": patch
---

Fixed RollingText shimmer overlay using an opaque white color in dark mode. Now uses a low-opacity white (staticWhite.disabled) in dark mode for a subtle shimmer sweep instead of a harsh flash.
