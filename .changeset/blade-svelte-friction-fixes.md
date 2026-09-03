---
"@razorpay/blade-svelte": minor
---

fix(blade-svelte): friction fixes for TextInput, OTPInput & BottomSheet

- `TextInput`/`BaseInput`: added `isReadOnly` and `spellCheck` props
- `OTPInput`: added `onKeyDown` callback (with field `inputIndex`) for custom keyboard navigation; consumers can call `event.preventDefault()` to opt out of internal Backspace/Arrow navigation
- `BottomSheet`: made `isOpen` `$bindable`
