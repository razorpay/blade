---
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): add PasswordInput component

Adds the Svelte PasswordInput (mask/reveal toggle, character counter, size/validation variants) built on the existing BaseInput. Also fixes BaseInput so `type="password"` reaches the DOM `<input>` for masking while keyboard/inputmode/autocomplete props stay on the coerced `text` type, and adds the `EyeIcon`/`EyeOffIcon` icons.
