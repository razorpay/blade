import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

type SliderInputCommonProps = Pick<
  BaseInputProps,
  'labelPosition' | 'name' | 'isDisabled' | 'testID' | keyof DataAnalyticsAttribute
> & {
  accessibilityLabel?: string;
  label?: string;
  value?: number;
  defaultValue?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  suffix?: string;
  /** @default 'medium' */
  size?: 'medium' | 'large';
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
  successText?: string;
  onChange?: (args: { name?: string; value: number }) => void;
  onChangeStart?: (args: { name?: string; value: number }) => void;
  onChangeEnd?: (args: { name?: string; value: number }) => void;
} & StyledPropsBlade;

export type SliderInputProps = SliderInputCommonProps;
