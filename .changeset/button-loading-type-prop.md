---
'@razorpay/blade': major
---

feat(Button): add loading variants

- Added `loadingType`, `loadingTimer`, and `onLoadingComplete` props to `Button` and `BaseButton`
- **Breaking**: Replaced `BaseSpinner` with the 3-dot `ButtonDotLoader` for indefinite loading — all existing `<Button isLoading>` consumers will see the new dot loader instead of the spinner
- **Breaking**: `isLoading` is now ignored when `loadingType='definite'` is set without a valid `loadingTimer`
- Added definite loading with a left-to-right progress overlay
- `aria-disabled` and `aria-busy` attributes are now emitted on disabled/loading buttons
