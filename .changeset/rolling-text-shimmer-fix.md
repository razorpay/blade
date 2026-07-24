---
"@razorpay/blade": patch
---

Fix RollingText loading shimmer washing out dark backgrounds by clipping the highlight to text glyphs using `background-clip: text` instead of a white overlay.
