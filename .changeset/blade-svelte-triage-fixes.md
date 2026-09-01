---
"@razorpay/blade-svelte": patch
---

- **TextInput**: `format` is now reactive — pattern changes reformat the current value instead of freezing at mount.
- **TextInput**: added `keyboardType` prop + `'numeric'` to `KeyboardType` for digit-only virtual keyboards.
- **OTPInput**: `otpLength` widened to `4 | 6 | 8` for 8-digit bank OTPs.
- **OTPInput**: `onOTPFilled` now latches the last-fired value, firing once per completed OTP instead of re-firing on every reactive update.
- **Accordion**: added `allowMultiple` + `expandedIndices`/`defaultExpandedIndices` for multi-expand support. Existing single-expand API unchanged.
