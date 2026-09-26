# OTP input

The component is `packages/blade/components/otp-input/OTPInput.svelte` over
the `createCompositeInput` and `createField` models. It has no style axes yet
(`components/otp-input/index.ts`): the cells share the row
up to a fixed width, so any code length fits.

## Behaviour props

| Prop | Notes |
| --- | --- |
| `value` | Bindable; an outside change spreads over the cells without firing `onChange` or stealing focus |
| `otpLength` | Number of cells, fixed at mount |
| `onChange` | A user edit changed the value |
| `onFilled` | Every cell holds a character, by typing, paste, autofill or `value` |
| `accept` | Per-character sanitizer; the default accepts a single digit |
| `isMasked`, `keyboardType`, `autoComplete` | Cell input type, `inputmode` and the one-time-code hint |
| `name`, `isRequired` | Registers with the enclosing Form; a partial code fails the pattern constraint |
| `validationState`, `helpText`, `errorText`, `successText` | Omit `validationState` inside a Form to mirror its error once focus left the group or a submit was attempted (the message replaces `hint` while it lasts) |
| `accessibilityLabel`, `cellAccessibilityLabel` | Name the group and each cell; the library ships no copy |
| `testID` | Each cell carries the id with its index appended |

## Keyboard

Backspace on an empty cell clears the previous one and retreats. Arrow keys
move between cells. Enter flows through to submit the form. Tab at either
end leaves the group instead of trapping focus.

## Analytics

How a multi-cell fill arrived (`paste` or `autofill`) is reported as
`adapters.track('otp_fill', { name, method })`, like every other library event —
there is no prop for it.
