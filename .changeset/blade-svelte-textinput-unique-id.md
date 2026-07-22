---
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): give each TextInput instance a unique id via useFormId

TextInput hardcoded `id="textinput"`, so multiple instances emitted duplicate DOM ids and broke label / aria-labelledby / aria-describedby associations. It now uses `useFormId('textinput', id)` (matching SearchInput/OTPInput/PhoneNumberInput) and accepts an optional `id` prop.
