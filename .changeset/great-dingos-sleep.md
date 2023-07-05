---
"@razorpay/blade": major
---

fix: make OTPInput fluid width

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

<img width="362" alt="Screenshot 2023-06-28 at 2 50 05 PM" src="https://github.com/razorpay/blade/assets/24487274/6d23c4a8-6c27-44f1-bb47-0d2b61025a06">

**After making OTPInput fluid width (OTPInput with fluid width):**

<img width="354" alt="Screenshot 2023-06-28 at 2 49 57 PM" src="https://github.com/razorpay/blade/assets/24487274/c3e40176-9f22-451e-a443-1274c4333aec">
