---
"@razorpay/blade": minor
"@razorpay/blade-core": minor
"@razorpay/blade-svelte": minor
---

feat(AppBar, TrustedMarker): add AppBar and TrustedMarker components

Renamed RTBBadge → TrustedMarker to make the component generic and future-proof.
The trust label is now configurable via a `label` prop (default: "Razorpay Trusted Business")
so it can evolve (e.g. "Razorpay Verified") without a breaking API change.
