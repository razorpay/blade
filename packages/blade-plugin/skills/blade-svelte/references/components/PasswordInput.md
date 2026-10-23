## Component Name

PasswordInput

## Description

PasswordInput is the masked field for a password, a PIN or a CVV, with a reveal button that toggles the text between hidden and shown. It is TextInput's field underneath, with the same label, hint lines, validation and counter, never autocapitalized, and takes TextInput's `leading`, `prefix` and `suffix` and a trailing link (`trailing`, before the reveal button). It comes in `medium` and `large`, and takes `span` inside an InputGroup (a CVV beside an expiry).

## Important Constraints

- `label` is a plain string above the field; without one, name it with `accessibilityLabel`
- `onChange` receives `{ name, value }`; bind the value with `bind:value`
- `showRevealButton` is on by default; the button's names are "Show password" / "Hide password". A disabled field has no reveal button and stays masked
- `autoComplete` is `current-password` (sign in), `new-password` (set one) or `off`; unset, the browser guesses
- `necessityIndicator` is `required` or `none`: a password is never marked optional
- `trailing` is a snippet only (Figma's trailing link, such as "Forgot password?"), 8px before the reveal button; `leading` takes an icon or a snippet, as on TextInput
- `size` is `medium` (36px, default) or `large` (48px); there is no `small`

## Props

```typescript
type InputGroupSpan = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';

interface PasswordInputProps {
  /** Plain text above the field. */
  label?: string;
  /** Names the control when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Bindable. @default '' */
  value?: string | number | null | undefined;
  placeholder?: string;
  /** A user edit: `{ name, value }`. */
  onChange?: (change: { name: string | undefined; value: string | number | null | undefined }) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  /** Also hides the reveal button and keeps the text masked. @default false */
  isDisabled?: boolean;
  /** @default false */
  isRequired?: boolean;
  /** Omit inside the app's form to mirror its error. @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  /** The line under the field, and the stand-in for a missing error or success text. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The line while `validationState` is `success`. */
  successText?: string | Snippet;
  /** Caps the length and shows a counter. */
  maxCharacters?: number;
  /** @default false */
  autoFocus?: boolean;
  /** The return key's label on a virtual keyboard. */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /** The key the app's form submits it under. */
  name?: string;
  /** Inside an InputGroup: this field's share of its row. @default 'full' */
  span?: InputGroupSpan;
  /** Before the text: an icon (a glyph) or a snippet (a selector). */
  leading?: IconSource | Snippet;
  /** Text before the value. */
  prefix?: string;
  /** Text after the value. */
  suffix?: string;
  /** After the text, before the reveal button: a Link. */
  trailing?: Snippet;
  /** `*` after the label. @default 'none' */
  necessityIndicator?: 'required' | 'none';
  /** What the browser or a password manager offers. */
  autoComplete?: 'off' | 'current-password' | 'new-password';
  /** A button that shows and hides the text. @default true */
  showRevealButton?: boolean;
  /** Lands on the `<input>`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** A composition's attachment on the `<input>`. */
  attach?: (node: HTMLInputElement) => void | (() => void);
  /** 36 or 48px tall. @default 'medium' (or BladeProvider's `size`) */
  size?: 'medium' | 'large';
}
```

## Guidelines

- Set `autoComplete="current-password"` on a sign-in form and `"new-password"` when the user sets one, so password managers fill or suggest correctly.
- Put "Forgot password?" in the `trailing` snippet as a Link, not beside the label (labels are plain strings).
- Turn the reveal button off (`showRevealButton={false}`) for a short code such as a CVV inside a card InputGroup.
- Don't use TextInput `type="password"`: it has no reveal button.
- Don't validate strength by restyling; use `validationState` with `errorText` or `successText`.

## Examples

### Sign in with a forgot-password link

```svelte
<script lang="ts">
  import { Link, PasswordInput } from '@razorpay/blade-svelte/components';

  let password = $state<string | number | null | undefined>('');
</script>

<PasswordInput
  bind:value={password}
  label="Password"
  name="password"
  autoComplete="current-password"
  necessityIndicator="required"
>
  {#snippet trailing()}
    <Link href="/forgot-password" size="small">Forgot?</Link>
  {/snippet}
</PasswordInput>
```

### Setting a new password, with validation

```svelte
<script lang="ts">
  import { PasswordInput } from '@razorpay/blade-svelte/components';

  let password = $state<string | number | null | undefined>('');
  const tooShort = $derived(String(password ?? '').length > 0 && String(password ?? '').length < 8);
</script>

<PasswordInput
  bind:value={password}
  label="New password"
  autoComplete="new-password"
  size="large"
  validationState={tooShort ? 'error' : 'none'}
  helpText="At least 8 characters"
  errorText="Use 8 or more characters"
/>
```
