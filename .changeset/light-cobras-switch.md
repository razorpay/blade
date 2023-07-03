---
"@razorpay/blade": patch
---

feat: add blue variant to Counter component & change intent to variant

## ⚠️ Changes for Counter component with backward compatibility
Changes the `intent` prop to `variant` since we support more than Feedback colors with the addition of `blue` color for Counter. We will continue to support `intent` prop for backward compatibility but it will be deprecated in an upcoming major release.

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
