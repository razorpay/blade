---
'@razorpay/blade-svelte': minor
---

fix(blade-svelte): make `TrustBadge` `label` a required prop

`TrustBadge` no longer ships the "Razorpay Trusted Business" copy as a default.
Consumers must pass `label` explicitly. `AppBarLeading` now renders its trust
badge only when both `trustBadgeVariant` and `trustBadgeLabel` are provided.
