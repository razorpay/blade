---
"@razorpay/blade": major
---

chore: make OTPInput fluid width (#104)

## ⚠️ Breaking change for OTPInput component
Changes the OTPInput to have a fluid width compared to a fixed width of 36px per field earlier

### Migration guide

**It is recommended to let the OTPInput take the entire width of the parent form in order to ensure consistency with the rest of the Input elements.**

If you still want to keep the UI for OTPInput on your existing screens the same, you can do the following:
1. Wrap `OTPInput` with a `Box` component and assign a `maxWidth` of `168px` (for `otpLength` of 4) or `256px` (for `otpLength` of 6)
```diff
+ <Box maxWidth='256px' />
  <OTPInput label='Enter OTP' otpLength={6} />
+ </Box>
```
