import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type {
  BaseInputSize,
  BaseInputValidationState,
  LabelPosition,
  KeyboardType,
  KeyboardReturnKeyType,
  FormInputOnEvent,
} from '../BaseInput/types';

/** Event payload for OTP focus/blur, including the field index. */
export type OTPInputOnEventWithIndex = (event: {
  name?: string;
  value?: string;
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

interface OTPInputCommonProps extends StyledPropsBlade, DataAnalyticsAttribute {
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
  otpLength?: 4 | 6;
  /** Masks the entered characters (renders `password` after entry). */
  isMasked?: boolean;
  /** Autocomplete suggestion type. @default 'oneTimeCode' */
  autoCompleteSuggestionType?: 'none' | 'oneTimeCode';
  /** Input size. @default 'medium' */
  size?: BaseInputSize;
  /** Test ID for the outer wrapper. */
  testID?: string;
}

export type OTPInputProps = (OTPInputPropsWithLabel | OTPInputPropsWithA11yLabel) &
  OTPInputCommonProps;

/** Imperative handle exposed via `bind:this`. */
export interface OTPInputInstance {
  /** Focus a specific OTP field by index. */
  focus: (index?: number) => void;
}
