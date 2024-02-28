---
"@razorpay/blade": minor
---

feat: Redesign all `Input` components 

> Note: No breaking changes to the existing API. The Input components will continue to work as before but with an updated design.

## Changes
### TextInput
- Redesigned UI
- Add `leadingIcon` prop
- ⚠️ Deprecate `icon` prop in favour of `leadingIcon` which will be removed in the next major version
- Add `trailingIcon` prop
- Add `trailingLinkButton` prop
- Add `size` prop

### TextArea
- Redesigned UI
- Add `size` prop

### PasswordInput (https://github.com/razorpay/blade/pull/2050)
- Redesigned UI
- Adds `size` prop
