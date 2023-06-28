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

**Before this change (OTPInput with fixed width):**
<img width="1889" alt="Screenshot 2023-06-27 at 2 56 31 PM" src="https://github.com/razorpay/blade/assets/24487274/98e8cc4f-a927-4f72-879a-81ea31be5b6e">

**After making OTPInput fluid width (OTPInput with fluid width):**
<img width="1888" alt="Screenshot 2023-06-27 at 2 57 29 PM" src="https://github.com/razorpay/blade/assets/24487274/655b9e0b-6b85-45fa-97ed-b8790ef2f92a">
