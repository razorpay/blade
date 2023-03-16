---
"@razorpay/blade": minor
---

feat(Layout Primitives): Add `Box` Component and Styled Props to Blade Components

Documentation: https://blade.razorpay.com/?path=/docs/components-layout-primitives-box-layout-primitives-tutorial--page

**Breakpoint Token Changes**

`max` breakpoint is removed as it wasn't used and had same value as `xl`. 
Through our audit, we didn't find any usage of this token. If you happen to use this somewhere, you can rename `breakpoints.max` to `breakpoints.xl`
