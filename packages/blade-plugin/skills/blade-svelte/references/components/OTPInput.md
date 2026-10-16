## Component Name

OTPInput

## Description

OTPInput is a row of single-character fields (4, 6 or 8) for one-time passwords, verification codes and PINs. It moves focus between fields as the user types, handles Backspace, Delete and arrow keys, spreads a pasted code across the fields, can mask entered characters, and submits the joined code through a hidden input named `name`.

## Important Constraints

- Either `label` or `accessibilityLabel` is required; each field is announced as "<label> character N"
- Controlled mode is decided once, on mount: pass `value` from the first render (use `''` for empty) to control it; a `value` that appears later is ignored. There is no `defaultValue`
- `onChange` fires on every keystroke, paste and delete with `{ name, value }`, where `value` is the joined code
- `onOTPFilled` fires once each time the code becomes complete with a new value, with `{ name, value }`
- `onFocus`, `onBlur` and `onKeyDown` payloads include `inputIndex`, the index of the field
- Spaces are ignored; a paste always fills from the first field regardless of which field is focused
- Calling `event.preventDefault()` in `onKeyDown` turns off the built-in Backspace, Delete and arrow-key navigation for that key press
- `placeholder` is split into characters, one per field
- To focus a field from code, bind the component instance and call `focus(index)`

## TypeScript Types

These are the props the OTPInput component accepts.

```typescript
type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';
type BaseInputValidationState = 'none' | 'error' | 'success';
type LabelPosition = 'top' | 'left';
type KeyboardType = 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal' | 'numeric';
type KeyboardReturnKeyType = 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';

/** Payload shape for `onChange` / `onOTPFilled`; `value` is the joined OTP. */
type FormInputOnEvent = (event: { name?: string; value?: string; rawValue?: string }) => void;

/** Event payload for OTP focus/blur, including the field index. */
type OTPInputOnEventWithIndex = (event: {
  name?: string;
  value?: string;
  inputIndex: number;
}) => void;

/** Event payload for OTP `onKeyDown`, including the field index. */
type OTPInputOnKeyDownEvent = (event: {
  name?: string;
  key?: string;
  code?: string;
  event: KeyboardEvent;
  inputIndex: number;
}) => void;

type OTPInputPropsWithLabel = {
  /** Label shown above/beside the OTP fields. */
  label: string;
  /** Accessibility label (optional when `label` is provided). */
  accessibilityLabel?: string;
};

type OTPInputPropsWithA11yLabel = {
  /** Label shown above/beside the OTP fields. */
  label?: undefined;
  /** Accessibility label (required when `label` is absent). */
  accessibilityLabel: string;
};

interface OTPInputCommonProps extends StyledPropsBlade {
  /** Label position. @default 'top' */
  labelPosition?: LabelPosition;
  /** Suffix element rendered after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
  /** Validation state. @default 'none' */
  validationState?: BaseInputValidationState;
  /** Help text below the fields. */
  helpText?: string;
  /** Error text (with `validationState="error"`). */
  errorText?: string;
  /** Success text (with `validationState="success"`). */
  successText?: string;
  /** Name of the aggregate hidden input. */
  name?: string;
  /** Change callback with the joined OTP value. */
  onChange?: FormInputOnEvent;
  /** Focus callback (includes the focused field index). */
  onFocus?: OTPInputOnEventWithIndex;
  /** Blur callback (includes the blurred field index). */
  onBlur?: OTPInputOnEventWithIndex;
  /** Called when all fields are filled. */
  onOTPFilled?: FormInputOnEvent;
  /** Controlled value. */
  value?: string;
  /** Disables all fields. */
  isDisabled?: boolean;
  /** Focus the first field on mount. */
  autoFocus?: boolean;
  /** Return-key type on virtual keyboards. */
  keyboardReturnKeyType?: KeyboardReturnKeyType;
  /** Virtual keyboard type. @default 'decimal' */
  keyboardType?: KeyboardType;
  /** Placeholder — one character per field. */
  placeholder?: string;
  /** Number of OTP fields. @default 6 */
  otpLength?: 4 | 6 | 8;
  /** Masks the entered characters (renders `password` after entry). */
  isMasked?: boolean;
  /** Autocomplete suggestion type. @default 'oneTimeCode' */
  autoCompleteSuggestionType?: 'none' | 'oneTimeCode';
  /** KeyDown callback for custom keyboard navigation between fields. */
  onKeyDown?: OTPInputOnKeyDownEvent;
  /** Input size. @default 'medium' */
  size?: BaseInputSize;
  /** Test ID for the outer wrapper. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type OTPInputProps = (OTPInputPropsWithLabel | OTPInputPropsWithA11yLabel) & OTPInputCommonProps;

/** Imperative handle exposed via `bind:this`. */
interface OTPInputInstance {
  /** Focus a specific OTP field by index. */
  focus: (index?: number) => void;
}
```

## Usage Guidelines

**Do**

- Use `OTPInput` for SMS and email verification codes, 2FA codes and transaction PINs.
- Verify the code in `onOTPFilled` instead of asking the user to press a button.
- Use `otpLength={4}` for short PINs and the default `6` for verification codes; match the length your backend sends.
- Use `isMasked` for PINs that should not be visible on screen.
- Keep `autoCompleteSuggestionType="oneTimeCode"` (the default) so browsers can autofill SMS codes.
- On a wrong code, set `validationState="error"` with `errorText`, clear `value` and call `focus(0)`.

**Don't**

- Don't build an OTP field from several `TextInput`s; use `OTPInput`, which handles focus, paste and deletion.
- Don't use `OTPInput` for card numbers, phone numbers or other long sequences; use `TextInput` with `format` or `PhoneNumberInput`.
- Don't use `OTPInput` for passwords; use `PasswordInput`.
- Don't switch between controlled and uncontrolled after mount; pass `value=''` from the start if you need to reset the code.

## Examples

### Verify a payment with an SMS OTP

A controlled six-digit OTP that verifies on completion, shows an error for a wrong code and refocuses the first field.

```svelte
<script lang="ts">
  import { OTPInput, Box, Link } from '@razorpay/blade-svelte/components';

  let otp = $state('');
  let hasError = $state(false);
  let otpField: { focus: (index?: number) => void } | undefined = $state();

  const verifyOtp = (code: string): void => {
    if (code !== '123456') {
      hasError = true;
      otp = '';
      otpField?.focus(0);
    }
  };
</script>

<Box className="display-flex flex-col gap-spacing-3">
  <OTPInput
    bind:this={otpField}
    label="Enter the OTP sent to +91 98XXX XX210"
    name="paymentOtp"
    autoFocus
    value={otp}
    onChange={({ value }) => {
      otp = value ?? '';
      hasError = false;
    }}
    onOTPFilled={({ value }) => verifyOtp(value ?? '')}
    validationState={hasError ? 'error' : 'none'}
    errorText="Incorrect OTP. Try again."
    helpText="The OTP is valid for 10 minutes"
    data-analytics-section="payment-otp"
  >
    {#snippet labelTrailing()}
      <Link size="small" onClick={() => (otp = '')}>Resend OTP</Link>
    {/snippet}
  </OTPInput>
</Box>
```

### Masked 4-digit PIN

An uncontrolled, masked PIN with the label on the left, used to confirm a payout.

```svelte
<script lang="ts">
  import { OTPInput } from '@razorpay/blade-svelte/components';

  let pin = $state('');
  let focusedField = $state(0);
</script>

<OTPInput
  label="Payout PIN"
  labelPosition="left"
  name="payoutPin"
  otpLength={4}
  isMasked
  keyboardType="numeric"
  autoCompleteSuggestionType="none"
  onChange={({ value }) => (pin = value ?? '')}
  onFocus={({ inputIndex }) => (focusedField = inputIndex)}
  helpText={pin.length === 4 ? 'PIN entered' : `Enter digit ${focusedField + 1} of 4`}
/>
```
