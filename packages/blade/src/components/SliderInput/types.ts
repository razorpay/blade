import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

type SliderInputBaseProps = Pick<
  BaseInputProps,
  'labelPosition' | 'name' | 'isDisabled' | 'isRequired' | 'testID' | keyof DataAnalyticsAttribute
> & {
  onFocus?: (args: { name?: string; value: number }) => void;
  onBlur?: (args: { name?: string; value: number }) => void;
  /**
   * The numerical value of the slider. Passing `value` puts the component in controlled mode.
   */
  value?: number;
  /**
   * The default numerical value when the component is uncontrolled.
   */
  defaultValue?: number;
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
  onChangeStart?: (args: { value: number }) => void;
  onChangeEnd?: (args: { value: number }) => void;
  /**
   * onChange fires on every value change, including continuously during drag.
   *
   * Note: Unlike most Blade inputs where `onChange` fires only on committed values,
   * this `onChange` fires in real-time as the slider moves. Use `onChangeEnd` for
   * performance-critical scenarios where you only need the final committed value.
   */
  onChange?: (args: { value: number }) => void;
} & StyledPropsBlade;

type SliderInputPropsWithLabel = {
  /**
   * Label describing the value being controlled.
   * When provided, this is used for both the visible label and the accessible name.
   */
  label: string;
  /**
   * Accessible name for the slider — optional override when `label` is provided.
   */
  accessibilityLabel?: string;
};

type SliderInputPropsWithA11yLabel = {
  /**
   * Label describing the value being controlled — absent when using `accessibilityLabel`.
   */
  label?: undefined;
  /**
   * Accessible name for the slider — required when `label` is not provided.
   */
  accessibilityLabel: string;
};

export type SliderInputProps = (
  | SliderInputPropsWithLabel
  | SliderInputPropsWithA11yLabel
) &
  SliderInputBaseProps;
