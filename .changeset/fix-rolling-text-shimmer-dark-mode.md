---
"@razorpay/blade": patch
---

fix(RollingText): fix shimmer overlay appearing as bright white in dark mode

In dark mode, the shimmer overlay on `RollingText` (used by `ChatMessage` rolling loading state) was using `staticWhite.muted` (48% opaque white), which appeared as a jarring white band against dark backgrounds. Now uses `staticWhite.disabled` (9% opacity) in dark mode for a subtle, theme-appropriate shimmer effect.
