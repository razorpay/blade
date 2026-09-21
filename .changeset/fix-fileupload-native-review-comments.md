---
"@razorpay/blade": patch
---

fix(FileUpload): resolve native review comments from PR #3676

- Fix `minHeight` type mismatch: moved from BaseBox prop (which expected `SpacingValueType`) to the `style` object as a raw numeric value, resolving TypeScript compilation errors on native.
- Add `__DEV__` warning for `onChange` on React Native, matching the pattern used for other unsupported props.
