---
'@razorpay/blade-svelte': patch
'@razorpay/blade-core': patch
---

fix(blade-svelte): stabilize PhoneNumberInput country selector BottomSheet

Pin the country selector BottomSheet to fixed snap points so filtering the country list no longer resizes the sheet mid-search. Hide the country search field when only one country is available. Use desktop ActionList item padding (`spacing.3`) on all breakpoints for consistent list density.
