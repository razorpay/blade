---
'@razorpay/blade': patch
---

fix(StepGroup): keep the last step closed after a re-render

StepGroup counted its items inside a cached memo, so any re-render that reused the same children saw a count of 0 and no step knew it was last. The last step, often inside a nested StepGroup, then drew its closing curve or line pointing at nothing. The count is now returned from the same memo. Applies to web and React Native.
