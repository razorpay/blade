## Component Name

PhoneNumberInput

## Description

PhoneNumberInput is a phone number field with a country selector (flag button), a dial-code prefix and a clear button. Its `onChange` returns a rich payload with the typed number, the formatted number with dial code, the dial code and the ISO country code. Use it for customer contact numbers, merchant onboarding and support callbacks, domestic or international.

## Important Constraints

- `onChange` receives `{ name, value, phoneNumber, dialCode, country }`, not the `{ name, value }` shape of other inputs; `value` is the raw typed number and `phoneNumber` is the formatted number with dial code (or `undefined` when empty)
- `onChange` fires on every keystroke, when a country is selected and when the clear button is pressed
- Country control is decided once, on mount: pass `country` from the first render to control it, otherwise `defaultCountry` seeds the internal state
- `onFocus`, `onBlur` and `onClick` use the plain `{ name, value }` payload
- The component does not validate numbers; validate `value` or `phoneNumber` yourself and set `validationState`
- The placeholder defaults to a sample number formatted for the selected country
- The country list opens in a `BottomSheet` on every screen size; inside another `BottomSheet`, pass the same `portalTarget`
- Partial port of React: the anchored desktop Dropdown for the country list and `showHelpTextOnFocus` are not available

## TypeScript Types

These are the props the PhoneNumberInput component accepts.

```typescript
/** ISO 3166-1 alpha-2 country code from @razorpay/i18nify-js, e.g. 'IN', 'US', 'MY'. */
type CountryCodeType = string;

type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';
type BaseInputValidationState = 'none' | 'error' | 'success';
type LabelPosition = 'top' | 'left';
type NecessityIndicator = 'required' | 'optional' | 'none';
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

/** Payload shape for `onFocus` / `onBlur` / `onClick`. */
type FormInputOnEvent = (event: { name?: string; value?: string; rawValue?: string }) => void;

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. PhoneIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

/** Rich payload emitted by PhoneNumberInput's `onChange`. */
type PhoneNumberChangePayload = {
  /** Formatted phone number with dial code, e.g. `"+91 123456789"`. */
  phoneNumber?: string;
  /** Dial code of the selected country, e.g. `"+91"`. */
  dialCode: string;
  /** ISO country code of the selected country, e.g. `"IN"`. */
  country: CountryCodeType;
  /** Raw value typed by the user. */
  value: string;
  /** Name of the input. */
  name: string;
};

interface PhoneNumberInputProps extends StyledPropsBlade {
  /** Label of the input. */
  label?: string;
  /** Position of the label. @default 'top' */
  labelPosition?: LabelPosition;
  /** Suffix element rendered after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
  /** Name of the input, submitted with the form. */
  name?: string;
  /** Size of the input. @default 'medium' */
  size?: BaseInputSize;
  /** Validation state — drives border color and hint. @default 'none' */
  validationState?: BaseInputValidationState;
  /** Error text (shown with `validationState="error"`). */
  errorText?: string;
  /** Success text (shown with `validationState="success"`). */
  successText?: string;
  /** Help text rendered below the input. */
  helpText?: string;
  /** Necessity indicator rendered next to the label. */
  necessityIndicator?: NecessityIndicator;
  /** Marks the field required. */
  isRequired?: boolean;
  /** Disables the input and the country selector. */
  isDisabled?: boolean;
  /** Leading icon rendered before the value. */
  leadingIcon?: IconComponent;
  /** Trailing icon rendered after the value. */
  trailingIcon?: IconComponent;
  /** Accessibility label. @default 'Enter phone number' */
  accessibilityLabel?: string;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Test ID for the input. */
  testID?: string;
  /** Return-key type on virtual keyboards. @default 'done' */
  keyboardReturnKeyType?: KeyboardReturnKeyType;
  /** Autocomplete suggestion type. */
  autoCompleteSuggestionType?: AutoCompleteSuggestionType;
  /** Placeholder text. Defaults to a formatted sample number. */
  placeholder?: string;
  /** Default value of the input (uncontrolled). */
  defaultValue?: string;
  /** Value of the input (controlled). */
  value?: string;
  /**
   * Default country code (uncontrolled country state).
   * @default 'IN'
   */
  defaultCountry?: CountryCodeType;
  /** Controlled country code. */
  country?: CountryCodeType;
  /** Called when a country is selected. */
  onCountryChange?: (event: { country: CountryCodeType }) => void;
  /** Restricts the country selector to these countries. */
  allowedCountries?: CountryCodeType[];
  /** Called when the value of the input changes (rich payload). */
  onChange?: (event: PhoneNumberChangePayload) => void;
  /** Called on focus. */
  onFocus?: FormInputOnEvent;
  /** Called on blur. */
  onBlur?: FormInputOnEvent;
  /** Called on click. */
  onClick?: FormInputOnEvent;
  /** Shows the dial code prefix. @default true */
  showDialCode?: boolean;
  /** Shows the country selector. @default true */
  showCountrySelector?: boolean;
  /** Called when the clear button is clicked. */
  onClearButtonClick?: () => void;
  /** Optional stable HTML id for the underlying input. Auto-generated when omitted. */
  id?: string;
  /**
   * Portals the country-selector bottom sheet into this element. Pass the same
   * target used by a parent `BottomSheet` when the input lives inside one.
   */
  portalTarget?: HTMLElement | null;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}

/** Imperative handle exposed via `bind:this`. */
interface PhoneNumberInputInstance {
  /** Focus the phone number input. */
  focus: () => void;
  /** Get the underlying `<input>` element. */
  getInput: () => HTMLInputElement | null;
}
```

## Usage Guidelines

**Do**

- Use `PhoneNumberInput` whenever you collect a phone number, so the country and dial code travel with it.
- Store `value` for the controlled field and send `phoneNumber` (or `dialCode` + `value`) to the backend.
- Use `allowedCountries` to limit the list to countries you operate in, for example `['IN', 'MY', 'SG']`.
- Use `showCountrySelector={false}` for India-only flows; keep `showDialCode` so users see `+91`.
- Use `onCountryChange` to adjust your validation rules when the country changes.
- Use `autoCompleteSuggestionType="telephone"` so browsers can fill the number.

**Don't**

- Don't use `TextInput` with `format` for phone numbers; `PhoneNumberInput` handles dial codes and country formats.
- Don't use `PhoneNumberInput` for other numeric values; use `TextInput` with `type="number"` or `CounterInput`.
- Don't treat `phoneNumber` as validated; check the number yourself and set `validationState="error"` with `errorText`.
- Don't destructure `onChange` as `{ value }` alone when you need the country; read `country` and `dialCode` from the same payload.

## Examples

### Customer contact number with validation

A controlled number and country for a payment link form, limited to three countries and validated on blur.

```svelte
<script lang="ts">
  import { PhoneNumberInput } from '@razorpay/blade-svelte/components';

  let phone = $state('');
  let selectedCountry = $state('IN');
  let formattedNumber = $state('');
  let hasError = $state(false);

  const minDigits = $derived(selectedCountry === 'IN' ? 10 : 8);
</script>

<PhoneNumberInput
  label="Customer phone number"
  name="customerPhone"
  necessityIndicator="required"
  isRequired
  allowedCountries={['IN', 'MY', 'SG']}
  country={selectedCountry}
  onCountryChange={({ country }) => (selectedCountry = country)}
  value={phone}
  onChange={({ value, phoneNumber }) => {
    phone = value;
    formattedNumber = phoneNumber ?? '';
    hasError = false;
  }}
  onBlur={() => (hasError = phone.replace(/\D/g, '').length < minDigits)}
  autoCompleteSuggestionType="telephone"
  validationState={hasError ? 'error' : 'none'}
  errorText="Enter a valid phone number"
  helpText={formattedNumber ? `Payment link will be sent to ${formattedNumber}` : 'We send the payment link by SMS'}
  data-analytics-field="customer-phone"
/>
```

### India-only support callback number

No country selector, a leading phone icon and an uncontrolled default value.

```svelte
<script lang="ts">
  import { PhoneNumberInput, PhoneIcon } from '@razorpay/blade-svelte/components';

  let callbackNumber = $state('');
</script>

<PhoneNumberInput
  label="Callback number"
  name="callbackNumber"
  defaultCountry="IN"
  showCountrySelector={false}
  leadingIcon={PhoneIcon}
  defaultValue="9876543210"
  size="large"
  onChange={({ dialCode, value }) => (callbackNumber = `${dialCode}${value}`)}
  helpText="Our support team calls this number within 2 hours"
/>
```
