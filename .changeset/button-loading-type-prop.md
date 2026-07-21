---
'@razorpay/blade': minor
---

feat(Button): add loading variants and avatar group support

- Added `loadingType`, `loadingTimer`, and `onLoadingComplete` props to `Button` and `BaseButton`
- Replaced `BaseSpinner` with the 3-dot `ButtonDotLoader` for indefinite loading
- Added definite loading with a left-to-right progress overlay
- Added `avatars` support for large buttons
