---
"@razorpay/blade": minor
"@razorpay/blade-core": minor
"@razorpay/blade-svelte": minor
---

feat(AppBar, TrustBadge): add AppBar and TrustBadge components

TrustBadge renders the "Razorpay Trusted Business" trust marker; its label is configurable
via a `label` prop (default: "Razorpay Trusted Business") so it can evolve (e.g. "Razorpay
Verified") without a breaking API change. AppBar surfaces it through the `trustBadgeVariant`
prop on `AppBarLeading`.
