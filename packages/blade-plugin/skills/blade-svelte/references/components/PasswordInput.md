## Component Name

PasswordInput

## Description

PasswordInput is a masked text field for passwords, API secrets and other credentials. A trailing eye button (on by default) lets the user reveal and hide the value. It supports a label or accessibility label, help, error and success text, a character counter, required state and autofill hints for password managers.

## Important Constraints

- Either `label` or `accessibilityLabel` is required; without a visible `label`, `accessibilityLabel` names the field
- `onChange` fires on the native `change` event, when the user commits the edit (usually on blur), not on every keystroke; its payload is `{ name, value }`
- `necessityIndicator` accepts only `'required'` or `'none'`
- When `isDisabled` is true the reveal button is hidden and the value stays masked
- `autoCapitalize` is always `none`; there are no prefix, suffix, icon or leading/trailing props
- Partial port of React: `onSubmit` and `showHelpTextOnFocus` are not available

## TypeScript Types

These are the props the PasswordInput component accepts.

```typescript
type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';
type BaseInputValidationState = 'none' | 'error' | 'success';
type LabelPosition = 'top' | 'left';
type KeyboardReturnKeyType = 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';

/**
 * Payload shape for input value events (`onChange`/`onFocus`/`onBlur`).
 * `value` is extracted from the DOM event internally.
 */
type FormInputOnEvent = (event: { name?: string; value?: string; rawValue?: string }) => void;

type PasswordInputPropsWithLabel = {
  /** Label shown for the input. */
  label: string;
  /** Accessibility label (optional when `label` is provided). */
  accessibilityLabel?: string;
};

type PasswordInputPropsWithA11yLabel = {
  /** Label shown for the input. */
  label?: undefined;
  /** Accessibility label (required when `label` is absent). */
  accessibilityLabel: string;
};

interface PasswordInputCommonProps extends StyledPropsBlade {
  /** Label position. @default 'top' */
  labelPosition?: LabelPosition;
  /** Suffix element rendered after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
  /**
   * Shows a reveal button to toggle password visibility.
   * @default true
   */
  showRevealButton?: boolean;
  /**
   * Displays an asterisk (`*`) after the label when `isRequired` is enabled.
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'none';
  /**
   * Autocomplete suggestion type. `password` maps to `current-password` and
   * `newPassword` maps to `new-password`, informing browser autofill and
   * password managers.
   */
  autoCompleteSuggestionType?: 'none' | 'password' | 'newPassword';
  /** Character counter limit. */
  maxCharacters?: number;
  /** Validation state. @default 'none' */
  validationState?: BaseInputValidationState;
  /** Error text (with `validationState="error"`). */
  errorText?: string;
  /** Success text (with `validationState="success"`). */
  successText?: string;
  /** Help text below the input. */
  helpText?: string;
  /**
   * Disables the input (masked, no reveal button).
   * @default false
   */
  isDisabled?: boolean;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Placeholder text. */
  placeholder?: string;
  /**
   * Marks the input required.
   * @default false
   */
  isRequired?: boolean;
  /** Controlled value. */
  value?: string;
  /** Change callback (`{ name, value }`). */
  onChange?: FormInputOnEvent;
  /** Focus callback. */
  onFocus?: FormInputOnEvent;
  /** Blur callback. */
  onBlur?: FormInputOnEvent;
  /** Name of the input. */
  name?: string;
  /**
   * Focus the input on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Return-key type on virtual keyboards.
   * @default 'done'
   */
  keyboardReturnKeyType?: KeyboardReturnKeyType;
  /** Input size. @default 'medium' */
  size?: BaseInputSize;
  /** Test ID for the element. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type PasswordInputProps = (PasswordInputPropsWithLabel | PasswordInputPropsWithA11yLabel) &
  PasswordInputCommonProps;
```

## Usage Guidelines

**Do**

- Use `PasswordInput` for every credential field: dashboard login, password change and API key secrets.
- Use `autoCompleteSuggestionType="password"` on login and `"newPassword"` on sign-up and password change, so password managers fill or generate correctly.
- Keep `showRevealButton` on so users can check what they typed.
- Use `helpText` for the password rules and switch to `errorText` with `validationState="error"` when a rule fails.
- Use `necessityIndicator="required"` with `isRequired` on mandatory fields.
- Use `maxCharacters` when the backend enforces a maximum length.

**Don't**

- Don't use `TextInput` for passwords; `TextInput` has no masking or reveal button.
- Don't use `PasswordInput` for OTPs or PINs; use `OTPInput`.
- Don't use `necessityIndicator="optional"`; a password field is either required or has no indicator.
- Don't validate on every keystroke through `onChange`; it fires when the edit is committed, so validate there or on form submit.
- Don't use `bind:value`; use `value` with `onChange`.

## Examples

### Dashboard login

Email and password for the merchant dashboard login, with autofill hints and an error from the server.

```svelte
<script lang="ts">
  import { PasswordInput, TextInput, Button, Box } from '@razorpay/blade-svelte/components';

  let email = $state('');
  let password = $state('');
  let loginError = $state('');

  const login = (): void => {
    loginError = password.length === 0 ? 'Enter your password' : '';
  };
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <TextInput
    label="Email"
    type="email"
    name="email"
    autoCompleteSuggestionType="email"
    value={email}
    onChange={({ value }) => (email = value ?? '')}
  />
  <PasswordInput
    label="Password"
    name="password"
    autoCompleteSuggestionType="password"
    necessityIndicator="required"
    isRequired
    value={password}
    onChange={({ value }) => (password = value ?? '')}
    validationState={loginError ? 'error' : 'none'}
    errorText={loginError}
    data-analytics-field="login-password"
  />
  <Button variant="primary" onClick={login}>Log in</Button>
</Box>
```

### Set a new password

A new-password field with strength rules as help text, a character limit and a success state once the rules pass.

```svelte
<script lang="ts">
  import { PasswordInput, Link } from '@razorpay/blade-svelte/components';

  let newPassword = $state('');

  const meetsRules = $derived(newPassword.length >= 8 && /\d/.test(newPassword));
</script>

<PasswordInput
  label="New password"
  name="newPassword"
  autoCompleteSuggestionType="newPassword"
  maxCharacters={64}
  helpText="Use at least 8 characters, including a number"
  validationState={newPassword && meetsRules ? 'success' : 'none'}
  successText="Strong password"
  value={newPassword}
  onChange={({ value }) => (newPassword = value ?? '')}
>
  {#snippet labelTrailing()}
    <Link size="small" onClick={() => (newPassword = '')}>Reset</Link>
  {/snippet}
</PasswordInput>
```
