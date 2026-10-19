# OTP input

The component is `src/components/otp-input/OTPInput.svelte` over
`createOTP` (the `createCompositeInput` model, on the field shell every
field shares). It has no style axes yet
(`components/otp-input/index.ts`): the cells share the row
up to a fixed width, so any code length fits.

## Behaviour props

| Prop | Notes |
| --- | --- |
| `value` | Bindable; an outside change spreads over the cells without firing `onChange` or stealing focus |
| `otpLength` | Number of cells, fixed at mount |
| `onChange` | A user edit, or a code from `adapters.readOTP`, changed the value: `{ name, value, method }` (`OTPInputChange`, as `onOTPFilled`) |
| `onOTPFilled` | `{ name, value, method }` once every cell holds a character, by typing, paste, autofill, `readOTP` or `value` |
| `accept` | Per-character sanitizer; the default accepts a single digit |
| `isMasked`, `inputMode`, `autoComplete` | Cell input type, `inputmode` and the one-time-code hint |
| `name`, `isRequired` | Registers with the app's form (`adapters.form`); a partial code fails the pattern constraint |
| `validationState`, `helpText`, `errorText`, `successText` | Omit `validationState` inside a Form to mirror its error once focus left the group or a submit was attempted (the message replaces `hint` while it lasts) |
| `accessibilityLabel`, `cellAccessibilityLabel` | Name the group and each cell; the library ships no copy |
| `testID` | Each cell carries the id with its index appended |

`method` (`OTPInputMethod`) says how the change arrived: `typed` (a
keystroke or delete in a cell, a cut too), `paste`, `autofill` (the
platform's multi-character commit, a keyboard suggestion included),
`adapter` (a code from `adapters.readOTP`). `onOTPFilled` also reports
`value` when the owner's own write completes the code; `onChange` never
does, since an outside `value` change does not fire it. Blade React passes
`{ name, value }` only.

## Keyboard

Backspace on an empty cell clears the previous one and retreats. Arrow keys
move between cells. Enter flows through to submit the form. Tab at either
end leaves the group instead of trapping focus.

## Reading the code

`autoComplete="one-time-code"` lets the browser offer a code. An app that
can read one itself (Android's SMS Retriever, iOS, the WebOTP API) passes
`adapters.readOTP({ length, cancelled })`. The field asks it once mounted and
enabled (not read-only), and a resolved code fills the cells as a paste
does: sanitized to `otpLength`, `onChange` and `onOTPFilled`, the form
told, no focus moved. `undefined` is no code. `cancelled` (a `Promise<void>`)
resolves when the field
unmounts or is disabled (enabling it asks again), and on the user's first
edit: their entry is the code then, and a late one must not overwrite it
mid-entry. A result after the cancel is ignored, a rejection too; otherwise
a rejection goes to `adapters.reportError`. A native host forwards the
cancel: `request.cancelled.then(() => bridge.send('otp.dismiss'))`.

Once a request settles or the user took over, the field does not ask again
on its own. The owner resetting `value` to `''` (a resend) asks afresh,
once the field is enabled and not read-only, so the resent code fills the
cells too. A user clearing the cells by hand is an edit, not a reset, and
does not ask. A request still pending at the reset is kept rather than
cancelled and asked again: it is already waiting for the next code, and a
restart could drop one arriving in between. Setting `''` when the value is
already `''` changes nothing, so it is no reset either: an owner whose
read settled on an empty field remounts the field to ask again.

## Analytics

How a multi-cell fill arrived (`paste`, `autofill` or `adapter`) is reported as
`adapters.track('otp_fill', { name, method })`, like every other library event —
there is no prop for it.
