---
"@razorpay/blade": patch
---

chore(OTPInput): add `autoCompleteSuggestionType` prop and disable password manager with `isMasked`

We wanted to disable the password managers for OTPInput when isMasked is set. The straightforward way to do this is set autocomplete='off' (i.e autoCompleteSuggestionType='none'). The issue with autocomplete is that its not an enforcement but a suggestion to the browser to follow. Safari mostly adheres to it but Chrome and Firefox ignores it and shows the password managers anyway. We decided on a workaround to unset `type` on first render and set it to `password` once a value is entered. This way the password managers won't make any suggestions when the user is on an empty OTP input field.
