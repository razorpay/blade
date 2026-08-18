import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../../Icons/iconMap';
import type {
  BaseInputSize,
  BaseInputValidationState,
  LabelPosition,
  ValidationTextPlacement,
  FormInputOnEvent,
  FormInputOnKeyDownEvent,
  KeyboardReturnKeyType,
  AutoCompleteSuggestionType,
  AutoCapitalize,
} from '../BaseInput/types';
import type { NecessityIndicator } from '../_Form/types';

/** Input type. `password` is intentionally excluded — use a PasswordInput instead. */
export type TextInputType = 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search';

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

interface TextInputCommonProps extends StyledPropsBlade, DataAnalyticsAttribute {
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
  /** Optional stable HTML id for the underlying input. Auto-generated when omitted. */
  id?: string;
}

export type TextInputProps = (TextInputPropsWithLabel | TextInputPropsWithA11yLabel) &
  TextInputCommonProps;
