import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

type SliderInputBaseProps = Pick<
  BaseInputProps,
  | 'labelPosition'
  | 'name'
  | 'onFocus'
  | 'onBlur'
  | 'isDisabled'
  | 'testID'
  | keyof DataAnalyticsAttribute
> & {
  accessibilityLabel?: string;
  label?: string;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /**
   * Unit label displayed after the numeric input (e.g. 'px', '%', 'rem').
   * @note v1 only supports a trailing suffix. A leading prefix (e.g. '$') is a known
   * omission and may be added in a future release.
   */
  suffix?: string;
  /** @default 'medium' */
  size?: 'medium' | 'large';
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
  successText?: string;
  onChangeStart?: (args: { name?: string; value: number }) => void;
  onChangeEnd?: (args: { name?: string; value: number }) => void;
} & StyledPropsBlade;

/**
 * onChange fires on every value change, including continuously during drag.
 *
 * Note: Unlike most Blade inputs where `onChange` fires only on committed values,
 * this `onChange` fires in real-time as the slider moves. Use `onChangeEnd` for
 * performance-critical scenarios where you only need the final committed value.
 */
type OnChangeProp = {
  onChange: (args: { name?: string; value: number }) => void;
};

/** Controlled: value + onChange are required together; defaultValue must not be provided. */
type ControlledSliderInputProps = SliderInputBaseProps &
  OnChangeProp & {
    value: number;
    defaultValue?: never;
  };

/** Uncontrolled: defaultValue is optional; value and onChange must not be provided. */
type UncontrolledSliderInputProps = SliderInputBaseProps & {
  defaultValue?: number;
  value?: never;
  onChange?: OnChangeProp['onChange'];
};

export type SliderInputProps = ControlledSliderInputProps | UncontrolledSliderInputProps;
