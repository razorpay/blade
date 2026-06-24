---
"@razorpay/blade": patch
---

fix(DatePicker): change onValidationStateChange callback to pass `{ validationState }` object instead of boolean, enabling consumers to distinguish between 'success', 'error', and 'none' states
