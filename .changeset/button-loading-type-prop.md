---
'@razorpay/blade': minor
---

feat(Button): add loadingType prop and replace spinner with dot loader

- Added `loadingType` prop to `Button` and `BaseButton` components (defaults to `'indefinite'`)
- Replaced `BaseSpinner` with `ButtonDotLoader` for the loading indicator
- `ButtonDotLoader` has platform-specific implementations (web uses CSS keyframes, native uses react-native-reanimated)
