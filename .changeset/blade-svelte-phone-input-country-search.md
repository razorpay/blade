---
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): add country search to PhoneNumberInput selector

Adds a `SearchInput` inside `CountrySelector`'s `BottomSheetHeader` for `PhoneNumberInput`. Filters the country list by name or dial code (case-insensitive substring match) and shows a "No countries found" empty state when the filter matches nothing.
