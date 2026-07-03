import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

type SliderInputBaseProps = Pick<
  BaseInputProps,
  'labelPosition' | 'name' | 'isDisabled' | 'testID' | keyof DataAnalyticsAttribute
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

/** Controlled: value + onChange are required together; defaultValue must not be provided. */
type ControlledSliderInputProps = SliderInputBaseProps & {
  value: number;
  onChange: (args: { name?: string; value: number }) => void;
  defaultValue?: never;
};

/** Uncontrolled: defaultValue is optional; value and onChange must not be provided. */
type UncontrolledSliderInputProps = SliderInputBaseProps & {
  defaultValue?: number;
  value?: never;
  onChange?: (args: { name?: string; value: number }) => void;
};

export type SliderInputProps = ControlledSliderInputProps | UncontrolledSliderInputProps;
