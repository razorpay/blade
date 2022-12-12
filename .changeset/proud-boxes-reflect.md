---
"@razorpay/blade": minor
---

feat(Alert): update `isFullWidth` to make inline borderless alerts on desktop

> **Warning**
>
> `isBorderless` prop is removed and its usage is now replaced by `isFullWidth`. The layout is updated to match the designs and is now centered on desktop resolutions.

### Steps for migration:

```diff
<Alert
- isBorderless
+ isFullWidth
/>
```
