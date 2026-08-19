---
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): export Link and CardHeaderLink prop types from components barrel

Export `LinkProps`, `BaseLinkProps`, and `CardHeaderLinkProps` from `@razorpay/blade-svelte/components` so consumers can import them without deep paths.
