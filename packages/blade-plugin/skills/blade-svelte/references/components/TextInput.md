## Component Name

TextInput

## Description

TextInput is a single-line text field for names, emails, URLs, numbers, UPI IDs and other short values. It supports a label or accessibility label, help, error and success text, prefix and suffix text, leading and trailing icons, leading and trailing snippets (for example a `Badge`), a trailing `Link` button, a clear button, a loading spinner, a character counter and `#`-pattern formatting for card numbers and dates.

## Important Constraints

- Either `label` or `accessibilityLabel` is required; without a visible `label`, `accessibilityLabel` names the field
- `onChange` fires on every keystroke with `{ name, value }`; when `format` is set it also carries `rawValue` (the value without delimiters)
- `format` accepts only `#` and special characters; letters and digits in the pattern are treated as delimiters and break formatting
- When `format` is set, `maxCharacters` is ignored (the pattern length is the limit) and no character counter is shown
- The clear button only resets the DOM field and calls `onClearButtonClick`; it does not call `onChange`, so a controlled parent must reset its `value` in `onClearButtonClick`
- Icons go in `leadingIcon` / `trailingIcon`; `leading` / `trailing` take snippets only (a component passed there is not rendered as an icon)
- Inside an `InputGroup`, the input's own label and hint text are not rendered and the group's `size` and `isDisabled` override the input's
- Partial port of React: tagged input (`isTaggedInput`, `tags`, `onTagChange`), `onSubmit`, `showHelpTextOnFocus` and Dropdown in `leading` / `trailing` are not available

## TypeScript Types

These are the props the TextInput component accepts.

```typescript
/** Input type. `password` is intentionally excluded — use a PasswordInput instead. */
type TextInputType = 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search';

type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';
type BaseInputValidationState = 'none' | 'error' | 'success';
type LabelPosition = 'top' | 'left';
type ValidationTextPlacement = 'outside' | 'inside';
type NecessityIndicator = 'required' | 'optional' | 'none';

type KeyboardType = 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal' | 'numeric';
type KeyboardReturnKeyType = 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';
type AutoCompleteSuggestionType =
  | 'none'
  | 'on'
  | 'name'
  | 'email'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | 'telephone'
  | 'postalCode'
  | 'countryName'
  | 'creditCardNumber'
  | 'creditCardCSC'
  | 'creditCardExpiry'
  | 'creditCardExpiryMonth'
  | 'creditCardExpiryYear';
type AutoCapitalize = 'none' | 'sentences' | 'words' | 'characters';

/**
 * Payload shape for input value events (`onChange`/`onFocus`/`onBlur`/`onInput`/
 * `onClick`). `value` is extracted from the DOM event internally; `rawValue` is
 * emitted by formatted inputs.
 */
type FormInputOnEvent = (event: { name?: string; value?: string; rawValue?: string }) => void;

/** Payload shape for `onKeyDown` (web-only). */
type FormInputOnKeyDownEvent = (event: {
  name?: string;
  key?: string;
  code?: string;
  event: KeyboardEvent;
}) => void;

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. SearchIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type TextInputPropsWithLabel = {
  /** Label shown for the input. */
  label: string;
  /** Accessibility label (optional when `label` is provided). */
  accessibilityLabel?: string;
};

type TextInputPropsWithA11yLabel = {
  /** Label shown for the input. */
  label?: undefined;
  /** Accessibility label (required when `label` is absent). */
  accessibilityLabel: string;
};

interface TextInputCommonProps extends StyledPropsBlade {
  /** Label position. @default 'top' */
  labelPosition?: LabelPosition;
  /** Suffix element rendered after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
  /** Necessity indicator shown after the label text. */
  necessityIndicator?: NecessityIndicator;
  /** Placeholder text. */
  placeholder?: string;
  /** Input type. @default 'text' */
  type?: TextInputType;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  /** Name of the input. */
  name?: string;
  /** Change callback (`{ name, value, rawValue }`). */
  onChange?: FormInputOnEvent;
  /** Focus callback. */
  onFocus?: FormInputOnEvent;
  /** Blur callback. */
  onBlur?: FormInputOnEvent;
  /** Click callback. */
  onClick?: FormInputOnEvent;
  /** KeyDown callback (web-only). */
  onKeyDown?: FormInputOnKeyDownEvent;
  /** Disables the input. */
  isDisabled?: boolean;
  /** Makes the input read-only (keeps it focusable, disables editing). */
  isReadOnly?: boolean;
  /** Controls the browser spellcheck on the input. */
  spellCheck?: boolean;
  /** Marks the input required. */
  isRequired?: boolean;
  /** Prefix text rendered at the start. */
  prefix?: string;
  /** Suffix text rendered at the end. */
  suffix?: string;
  /** Character counter limit. */
  maxCharacters?: number;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Return-key type on virtual keyboards. */
  keyboardReturnKeyType?: KeyboardReturnKeyType;
  /**
   * Overrides the virtual keyboard hint derived from `type` (maps to `inputMode`).
   * Use `'numeric'` for digit-only entry (card number, CVV) where `type="number"`'s
   * default `decimal` inputmode would show an unwanted decimal-point key.
   */
  keyboardType?: KeyboardType;
  /** Autocomplete suggestion type. */
  autoCompleteSuggestionType?: AutoCompleteSuggestionType;
  /** Autocapitalize behaviour. */
  autoCapitalize?: AutoCapitalize;
  /** Validation state. @default 'none' */
  validationState?: BaseInputValidationState;
  /** Placement of the validation text. @default 'outside' */
  validationTextPlacement?: ValidationTextPlacement;
  /** Help text below the input. */
  helpText?: string;
  /** Error text (with `validationState="error"`). */
  errorText?: string;
  /** Success text (with `validationState="success"`). */
  successText?: string;
  /** Input size. @default 'medium' */
  size?: BaseInputSize;
  /** Text alignment of the value. */
  textAlign?: 'left' | 'center' | 'right';
  /** Renders a clear (×) icon button while there is a value. */
  showClearButton?: boolean;
  /** Click handler for the clear button. */
  onClearButtonClick?: () => void;
  /** Shows a loading spinner in the trailing slot. */
  isLoading?: boolean;
  /** Leading icon component. */
  leadingIcon?: IconComponent;
  /** Trailing icon component. */
  trailingIcon?: IconComponent;
  /** Trailing `Link`-style button (snippet). */
  trailingButton?: Snippet;
  /**
   * Leading element rendered at the start of the input (e.g. a `Badge`).
   *
   * Deviation from React: React's `leading` accepts an icon component OR an
   * element. In Svelte a component and a snippet are both functions and can't
   * be told apart reliably, so pass icons via `leadingIcon` and elements via
   * this snippet.
   */
  leading?: Snippet;
  /**
   * Trailing element rendered at the end of the input (e.g. a `Badge`).
   * See `leading` for the icon-vs-element deviation.
   */
  trailing?: Snippet;
  /**
   * Format pattern where `#` represents input characters and other symbols act
   * as delimiters. When set, input is auto-formatted and `onChange` includes
   * `rawValue`. Only `#` + special characters are allowed (no letters/numbers).
   *
   * @example "#### #### #### ####" for card numbers
   * @example "##/##" for expiry dates
   */
  format?: string;
  /** Component name for the `data-blade-component` attribute. */
  componentName?: string;
  /** Test ID for the element. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

type TextInputProps = (TextInputPropsWithLabel | TextInputPropsWithA11yLabel) &
  TextInputCommonProps;
```

## Usage Guidelines

**Do**

- Use `TextInput` for single-line values such as business name, GSTIN, email, website URL or UPI ID.
- Keep controlled inputs as `value` plus `onChange={({ value }) => (field = value ?? '')}`.
- Use `format` with `#` patterns for structured values (card number `#### #### #### ####`, expiry `##/##`) and store `rawValue` from `onChange`.
- Set `type` for the right mobile keyboard (`email`, `url`, `telephone`, `number`) and `keyboardType="numeric"` for digit-only fields like CVV.
- Use `prefix` / `suffix` for fixed units such as `₹` or `.razorpay.com`, and `leading` / `trailing` snippets for a `Badge`.
- Use `maxCharacters` when there is a hard limit, so the counter shows remaining space.
- Pair `validationState="error"` with `errorText` that says how to fix the value.
- Use `labelSuffix` for an info `Tooltip` and `labelTrailing` for a small `Link` next to the label.

**Don't**

- Don't use `TextInput` for passwords; use `PasswordInput`.
- Don't use `TextInput` for search bars; use `SearchInput`, which adds the search icon and clear behaviour.
- Don't use `TextInput` for phone numbers with a country code; use `PhoneNumberInput`.
- Don't use `TextInput` for multi-line text; use `TextArea`.
- Don't pass an icon component to `leading` / `trailing`; use `leadingIcon` / `trailingIcon`.
- Don't hide the label without setting `accessibilityLabel`; screen readers need a name for the field.
- Don't use `bind:value`; use `value` with `onChange`.

## Examples

### Merchant profile fields with validation

Controlled fields for a merchant settings form, combining validation states, prefix and suffix, necessity indicators and analytics attributes.

```svelte
<script lang="ts">
  import { TextInput, Box } from '@razorpay/blade-svelte/components';

  let businessName = $state('Acme Payments');
  let email = $state('');
  let subdomain = $state('acme');

  const isEmailValid = $derived(email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
</script>

<Box className="display-flex flex-col gap-spacing-5">
  <TextInput
    label="Business name"
    name="businessName"
    necessityIndicator="required"
    isRequired
    maxCharacters={50}
    value={businessName}
    onChange={({ value }) => (businessName = value ?? '')}
    data-analytics-field="business-name"
  />
  <TextInput
    label="Support email"
    name="supportEmail"
    type="email"
    placeholder="support@acme.com"
    autoCompleteSuggestionType="email"
    value={email}
    onChange={({ value }) => (email = value ?? '')}
    validationState={isEmailValid ? 'none' : 'error'}
    errorText="Enter a valid email address"
    helpText="Customers see this on payment receipts"
  />
  <TextInput
    label="Payment page URL"
    name="subdomain"
    prefix="https://"
    suffix=".razorpay.me"
    value={subdomain}
    onChange={({ value }) => (subdomain = value ?? '')}
    validationState={subdomain.length >= 3 ? 'success' : 'none'}
    successText="This URL is available"
  />
</Box>
```

### Formatted card fields

Card number and expiry use `format` and store the `rawValue`; CVV uses `maxCharacters` with a numeric keyboard.

```svelte
<script lang="ts">
  import { TextInput, Box, Button, CreditCardIcon } from '@razorpay/blade-svelte/components';

  let cardNumber = $state('');
  let expiry = $state('');
  let cvv = $state('');

  const digits = (input: string): string => input.replace(/\D/g, '');

  const resetCard = (): void => {
    cardNumber = '';
    expiry = '';
    cvv = '';
  };
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <TextInput
    label="Card number"
    placeholder="1234 5678 9012 3456"
    type="telephone"
    format="#### #### #### ####"
    leadingIcon={CreditCardIcon}
    autoCompleteSuggestionType="creditCardNumber"
    value={cardNumber}
    onChange={({ rawValue }) => (cardNumber = digits(rawValue ?? ''))}
  />
  <Box className="display-flex flex-row gap-spacing-4">
    <TextInput
      label="Expiry"
      placeholder="MM/YY"
      type="telephone"
      format="##/##"
      autoCompleteSuggestionType="creditCardExpiry"
      value={expiry}
      onChange={({ rawValue }) => (expiry = digits(rawValue ?? ''))}
    />
    <TextInput
      label="CVV"
      placeholder="123"
      keyboardType="numeric"
      maxCharacters={3}
      autoCompleteSuggestionType="creditCardCSC"
      value={cvv}
      onChange={({ value }) => (cvv = digits(value ?? ''))}
    />
  </Box>
  <Button variant="tertiary" onClick={resetCard}>Clear card details</Button>
</Box>
```

### UPI ID with trailing badge, clear button and apply link

Snippets for the label suffix, trailing badge and trailing button, plus a clear button that resets the controlled value.

```svelte
<script lang="ts">
  import { TextInput, Badge, Link, Tooltip, InfoIcon } from '@razorpay/blade-svelte/components';

  let upiHandle = $state('');
  let isVerifying = $state(false);

  const verifyUpi = (): void => {
    isVerifying = true;
    setTimeout(() => (isVerifying = false), 1500);
  };
</script>

<TextInput
  label="UPI ID"
  name="upiId"
  placeholder="yourname"
  showClearButton
  isLoading={isVerifying}
  value={upiHandle}
  onChange={({ value }) => (upiHandle = value ?? '')}
  onClearButtonClick={() => (upiHandle = '')}
  helpText="Refunds for this customer are sent to this UPI ID"
>
  {#snippet labelSuffix()}
    <Tooltip content="Your UPI ID is shown in your UPI app" placement="right">
      <InfoIcon size="small" color="surface.icon.gray.muted" />
    </Tooltip>
  {/snippet}
  {#snippet trailing()}
    <Badge color="neutral" size="small">@oksbi</Badge>
  {/snippet}
  {#snippet trailingButton()}
    <Link onClick={verifyUpi}>Verify</Link>
  {/snippet}
</TextInput>
```
