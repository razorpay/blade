import type { Snippet } from 'svelte';
import type { CountryCodeType } from '@razorpay/i18nify-js/types';
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

export type { CountryCodeType };

/**
 * Country code accepted by PhoneNumberInput. Autocompletes i18nify's ISO codes but
 * also accepts any string so consumers can pass codes i18nify does not model
 * (e.g. `'XK'` Kosovo) alongside a custom `countries` list.
 */
export type PhoneCountryCode = CountryCodeType | (string & Record<never, never>);

/** One entry of the consumer-supplied `countries` list. */
export type PhoneCountryInfo = {
  /** ISO-3166-1 alpha-2 (or consumer-defined) code, e.g. `'IN'`, `'XK'`. */
  code: string;
  /** Dial code with or without leading `+`, e.g. `'91'` or `'+91'`. */
  dialCode: string;
  /** Display name. Falls back to `Intl.DisplayNames` when omitted. */
  name?: string;
  /** Flag image URL. Falls back to the i18nify flag lookup when omitted. */
  flag?: string;
};

/**
 * Country entry after normalisation — what `CountrySelector` renders and what the
 * dial-code prefix / `onChange` payload read from. `dialCode` always carries a
 * leading `+`; `flag` is `undefined` when no image is known for the code.
 */
export type ResolvedPhoneCountry = {
  code: string;
  name: string;
  dialCode: string;
  flag?: string;
};

/** Rich payload emitted by PhoneNumberInput's `onChange`. */
export type PhoneNumberChangePayload = {
  /** Formatted phone number with dial code, e.g. `"+91 123456789"`. */
  phoneNumber?: string;
  /** Dial code of the selected country, e.g. `"+91"`. */
  dialCode: string;
  /** ISO country code of the selected country, e.g. `"IN"`. */
  country: PhoneCountryCode;
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
  defaultCountry?: PhoneCountryCode;
  /** Controlled country code. */
  country?: PhoneCountryCode;
  /** Called when a country is selected. */
  onCountryChange?: (event: { country: PhoneCountryCode }) => void;
  /**
   * Restricts the country selector to these countries. Filters whichever list is
   * active (`countries` when provided, otherwise i18nify's list).
   */
  allowedCountries?: PhoneCountryCode[];
  /**
   * Custom country list. When provided it is the single source for the selector
   * list (rendered in the given order), the dial-code prefix, the `dialCode` in the
   * `onChange` payload, search and flags. Omit to use i18nify's country data.
   * @default undefined
   */
  countries?: PhoneCountryInfo[];
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
  /** Currently selected country (already resolved: name, dial code, flag). */
  selectedCountry: ResolvedPhoneCountry;
  /** Countries to render in the list. */
  countryData: ResolvedPhoneCountry[];
  /** Called when a country row is activated. */
  onItemClick: (props: { name: string }) => void;
  /** Disables the trigger button. */
  isDisabled?: boolean;
  /** Size of the trigger (drives flag size). */
  size: BaseInputSize;
  /** Portals the country list bottom sheet into this element. */
  portalTarget?: HTMLElement | null;
};
