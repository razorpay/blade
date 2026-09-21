---
"@razorpay/blade": patch
---

fix(DonutChart): wrap motionEasing with castNativeType and fix tooltip press test

- Wrap `motionEasing` with `castNativeType` to match the pattern used for `motionDuration`
- Add `testID` to interactive donut slices for reliable press testing
- Fix tooltip display test to use `getByTestId` + `fireEvent.press` instead of `UNSAFE_getAllByProps`
