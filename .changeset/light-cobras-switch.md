---
"@razorpay/blade": major
---

feat: add blue variant to Counter component & change intent to variant

## ⚠️ Breaking change for Counter component
Changes the `intent` prop to `variant` since we support more than Feedback colors with the addition of `blue` color for Counter.

### Migration guide
1. Replace all instances of Counter's `intent` prop with `variant
   > The change is only in the naming of the prop, the value will remain unchanged.
```diff
 <Counter
-  intent='positive'
+  variant='positive'
   value={42}
 />
```
