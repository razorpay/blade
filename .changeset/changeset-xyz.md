---
"@razorpay/blade": patch
---

fix: remove default `rel` values

> [!NOTE]
>
> While its non-ui-breaking change, you might want to add `rel="noopener noreferrer"` to your Button if that is what you're expecting. This PR removes the defaults in-order to not break analytics that relies on referrer.
