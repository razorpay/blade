---
'@razorpay/blade': patch
---

fix(BaseInput): pass Android autofill hint via `autoComplete` instead of the removed `autoCompleteType` prop

React Native renamed `autoCompleteType` to `autoComplete` in 0.66, so the Android autofill hint (e.g. `sms-otp` for `OTPInput`'s `autoCompleteSuggestionType="oneTimeCode"`) was silently dropped and never reached the native `EditText`. OTP keyboard suggestions and other autofill hints now work on Android.
