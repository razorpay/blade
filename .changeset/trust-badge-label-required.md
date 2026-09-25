---
'@razorpay/blade-svelte': minor
'@razorpay/blade': minor
---

fix(blade, blade-svelte): make `TrustBadge` `label` a required prop

`TrustBadge` no longer ships the "Razorpay Trusted Business" copy as a default.
Consumers must pass `label` explicitly on both React and Svelte. `AppBarLeading`
now renders its trust badge only when both `trustBadgeVariant` and
`trustBadgeLabel` are provided.
