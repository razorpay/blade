---
"@razorpay/blade": patch
---

fix(SankeyChart): reduce last-column label max-width to minimize right-side whitespace

Right margin is now computed from last-column nodes only (120px cap) instead of the widest chip across all columns (160px), so the chart flow area fills the container more evenly.
