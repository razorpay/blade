## Component Name

OTPInput

## Description

OTPInput is the one-time-code field: a row of single-character cells (6 by default) that take a typed, pasted or autofilled code and report `onOTPFilled` once it is complete. The cells advance as the user types. It hints `autocomplete="one-time-code"` and the numeric keypad, can mask the cells, has the inputs' label and hint lines, and can fill itself from an app's SMS reader through `adapters.readOTP`.

## Important Constraints

- `otpLength` is fixed at mount: wrap the field in `{#key}` to change it
- `onChange` and `onOTPFilled` receive `{ name, value, method }` (`OTPInputChange`). `method` is `typed`, `paste`, `autofill` or `adapter` (a code from `adapters.readOTP`); `onOTPFilled` also reports `value` when the owner's own write completed the code
- An outside change to `value` spreads over the cells without firing `onChange` or moving focus; it does fire `onOTPFilled` when it completes the code. Setting `value` to `''` (a resend) asks `adapters.readOTP` again
- `accept` sanitizes each character (return `''` to reject); the default accepts a single digit, so pass `accept` and `inputMode="text"` for an alphanumeric code
- Keyboard: Backspace on an empty cell clears the previous one and moves back; arrow keys move between cells; Enter submits the form; Tab leaves the group
- `onFocus` and `onBlur` receive the DOM event and the cell's index
- `cellAccessibilityLabel` names each cell (the library ships no copy); default: the group's name and the cell's position. `testID` lands on each cell as `${testID}-${index}`
- `size` is `medium` (36px cells, default) or `large` (48px)

## Props

```typescript
type OTPInputMethod = 'typed' | 'paste' | 'autofill' | 'adapter' | 'value';

interface OTPInputChange {
  name: string | undefined;
  value: string;
  method: OTPInputMethod;
}

interface OTPInputProps {
  /** Plain text above the cells. */
  label?: string;
  /** Bindable. @default '' */
  value?: string;
  /** Number of cells; fixed at mount. @default 6 */
  otpLength?: number;
  /** A user edit or a `readOTP` code changed the value; outside `value` changes don't fire it. */
  onChange?: (change: OTPInputChange) => void;
  /** Every cell holds a character, by any method, `value` included. */
  onOTPFilled?: (change: OTPInputChange) => void;
  /** A cell was clicked (e.g. to take over from an auto-read). */
  onClick?: (event: MouseEvent) => void;
  /** Per-character sanitizer: return '' to reject. @default a single digit */
  accept?: (char: string) => string;
  /** The virtual keyboard. @default 'numeric' */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  /** The return key's label on a virtual keyboard. */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /** One character: each cell's placeholder. */
  placeholder?: string;
  /** A cell took focus. */
  onFocus?: (event: FocusEvent, index: number) => void;
  /** A cell lost focus. */
  onBlur?: (event: FocusEvent, index: number) => void;
  /** Masks the cells like a password. @default false */
  isMasked?: boolean;
  /** @default false */
  isDisabled?: boolean;
  /** A partial code then fails the app's form. @default false */
  isRequired?: boolean;
  /** @default false */
  isReadOnly?: boolean;
  /** Omit inside the app's form to mirror its error. @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  /** The line under the cells, and the stand-in for a missing error or success text. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The line while `validationState` is `success`. */
  successText?: string | Snippet;
  /** @default false */
  autoFocus?: boolean;
  /** An HTML autofill token. @default 'one-time-code' */
  autoComplete?: string;
  /** The key the app's form submits the code under. */
  name?: string;
  /** Names the group when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Names one cell: `(index, total) => string`. @default the group's name and the cell's position */
  cellAccessibilityLabel?: (index: number, total: number) => string;
  /** Each cell gets `${testID}-${index}`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** @default 'medium' (or BladeProvider's `size`) */
  size?: 'medium' | 'large';
}
```

## Guidelines

- Submit or verify in `onOTPFilled`; check `method` if you auto-submit only codes that were read for the user (`autofill`, `adapter`).
- Show a wrong code with `validationState="error"` and `errorText`, and clear it by setting `value` to `''`.
- Reset `value` to `''` on "Resend OTP" so the cells empty and `adapters.readOTP` is asked again.
- Pass `cellAccessibilityLabel` for localized cell names ("Digit 1 of 6").
- Don't build a code field from several TextInputs; OTPInput handles paste, autofill and focus movement.

## Examples

### Verify when the code is complete

```svelte
<script lang="ts">
  import { OTPInput, type OTPInputChange } from '@razorpay/blade-svelte/components';

  let code = $state('');
  let isWrong = $state(false);

  async function verify({ value }: OTPInputChange): Promise<void> {
    const response = await fetch('/api/verify-otp', { method: 'POST', body: value });
    isWrong = !response.ok;
  }
</script>

<OTPInput
  bind:value={code}
  label="Enter the OTP sent to +91 98765 43210"
  name="otp"
  onOTPFilled={verify}
  onChange={() => (isWrong = false)}
  validationState={isWrong ? 'error' : 'none'}
  errorText="That code is incorrect"
/>
```

### Four masked cells, cleared from outside

```svelte
<script lang="ts">
  import { Link, OTPInput } from '@razorpay/blade-svelte/components';

  let pin = $state('');
</script>

<div class="flex flex-col gap-blade-3">
  <OTPInput
    bind:value={pin}
    otpLength={4}
    isMasked
    size="large"
    label="Card PIN"
    cellAccessibilityLabel={(index, total) => `Digit ${index + 1} of ${total}`}
  />
  <Link variant="button" size="small" onClick={() => (pin = '')}>Clear</Link>
</div>
```

### An alphanumeric code

```svelte
<script lang="ts">
  import { OTPInput } from '@razorpay/blade-svelte/components';

  let code = $state('');
</script>

<OTPInput
  bind:value={code}
  otpLength={6}
  label="Verification code"
  inputMode="text"
  accept={(char) => (/^[a-z0-9]$/i.test(char) ? char.toUpperCase() : '')}
  helpText="Letters and digits from the email we sent"
/>
```
