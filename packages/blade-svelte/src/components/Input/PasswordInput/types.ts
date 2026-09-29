import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type {
  BaseInputSize,
  BaseInputValidationState,
  LabelPosition,
  FormInputOnEvent,
  KeyboardReturnKeyType,
  AutoCompleteSuggestionType,
} from '../BaseInput/types';
import type { NecessityIndicator } from '../_Form/types';

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

interface PasswordInputCommonProps extends StyledPropsBlade, DataAnalyticsAttribute {
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
  necessityIndicator?: Exclude<NecessityIndicator, 'optional'>;
  /**
   * Autocomplete suggestion type. `password` maps to `current-password` and
   * `newPassword` maps to `new-password`, informing browser autofill and
   * password managers.
   */
  autoCompleteSuggestionType?: Extract<
    AutoCompleteSuggestionType,
    'none' | 'password' | 'newPassword'
  >;
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
}

export type PasswordInputProps = (PasswordInputPropsWithLabel | PasswordInputPropsWithA11yLabel) &
  PasswordInputCommonProps;
