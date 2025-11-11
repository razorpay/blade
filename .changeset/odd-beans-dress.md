---
"@razorpay/blade": patch
---

### Removal of `padding` prop from `FilterChipGroup`

We have removed the `padding` prop from the `FilterChipGroup` component, which was introduced in the previous version. Padding is now handled internally as part of the global spacing update.

#### Impact

If your code was using the `padding` prop, you might notice spacing differences or snapshot changes in your tests. No functional changes are required otherwise.

#### How to Upgrade

Remove the `padding` prop usage from `FilterChipGroup`. The component will now automatically apply the correct spacing as per the new global layout rules.
