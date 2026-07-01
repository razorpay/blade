import type { Snippet } from 'svelte';
import type { CountryCodeType } from '@razorpay/i18nify-js';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../../Icons/iconMap';
import type {
  BaseInputSize,
  BaseInputValidationState,
  LabelPosition,
  KeyboardReturnKeyType,
  AutoCompleteSuggestionType,
  FormInputOnEvent,
} from '../BaseInput/types';
import type { NecessityIndicator } from '../_Form/types';

/** Rich payload emitted by PhoneNumberInput's `onChange`. */
export type PhoneNumberChangePayload = {
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

export interface PhoneNumberInputProps extends StyledPropsBlade, DataAnalyticsAttribute {
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
}

/** Imperative handle exposed via `bind:this`. */
export interface PhoneNumberInputInstance {
  /** Focus the phone number input. */
  focus: () => void;
  /** Get the underlying `<input>` element. */
  getInput: () => HTMLInputElement | null;
}

/** Props for the internal `CountrySelector`. */
export type CountrySelectorProps = {
  /** Currently selected country. */
  selectedCountry: CountryCodeType;
  /** Countries to render in the list. */
  countryData: { code: CountryCodeType; name: string }[];
  /** Flag map from i18nify (`getFlagsForAllCountries`). */
  flags: Record<string, { '4X3': string }>;
  /** Called when a country row is activated. */
  onItemClick: (props: { name: string }) => void;
  /** Disables the trigger button. */
  isDisabled?: boolean;
  /** Size of the trigger (drives flag size). */
  size: BaseInputSize;
};
