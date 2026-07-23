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
  | 'isRequired'
  | 'testID'
  | keyof DataAnalyticsAttribute
> & {
  /**
   * Accessible name for the slider when no visible `label` is rendered.
   *
   * @note Ignored when `label` is provided — `label` always takes precedence for both the
   * visible text and the accessible name.
   */
  accessibilityLabel?: string;
  label?: string;
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
  onChangeStart?: (args: { name?: string; value: number }) => void;
  onChangeEnd?: (args: { name?: string; value: number }) => void;
  /**
   * onChange fires on every value change, including continuously during drag.
   *
   * Note: Unlike most Blade inputs where `onChange` fires only on committed values,
   * this `onChange` fires in real-time as the slider moves. Use `onChangeEnd` for
   * performance-critical scenarios where you only need the final committed value.
   */
  onChange?: (args: { name?: string; value: number }) => void;
} & StyledPropsBlade;

export type SliderInputProps = SliderInputBaseProps;
