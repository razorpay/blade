import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

type SliderInputCommonProps = Pick<
  BaseInputProps,
  'labelPosition' | 'name' | 'isDisabled' | 'testID' | keyof DataAnalyticsAttribute
> & {
  /**
   * Accessibility label for the input (optional override)
   */
  accessibilityLabel?: string;

  /**
   * Label describing the value being controlled
   */
  label?: string;

  /**
   * Current value of the slider input (controlled mode)
   */
  value?: number;

  /**
   * Default value when component is uncontrolled
   */
  defaultValue?: number;

  /**
   * Minimum allowed value
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value
   * @default 100
   */
  max?: number;

  /**
   * Step increment. When defined, the slider snaps to discrete values.
   * @default 1
   */
  step?: number;

  /**
   * Unit suffix displayed inside the input field (e.g. "px", "%", "rem")
   */
  suffix?: string;

  /**
   * Size of the component
   * @default 'medium'
   */
  size?: 'medium' | 'large';

  /**
   * Marks the field as required
   * @default false
   */
  isRequired?: boolean;

  /**
   * Renders a necessity indicator after the label
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * State indicating validation status
   * @default 'none'
   */
  validationState?: 'none' | 'error';

  /**
   * Text shown below the component providing guidance
   */
  helpText?: string;

  /**
   * Text shown below the component when validationState is 'error'
   */
  errorText?: string;

  /**
   * Event handler called when the value changes
   */
  onChange?: (args: { name?: string; value: number }) => void;

  /**
   * Event handler called when interaction begins (mousedown/touchstart)
   */
  onChangeStart?: (args: { name?: string; value: number }) => void;

  /**
   * Event handler called when interaction ends (mouseup/touchend)
   */
  onChangeEnd?: (args: { name?: string; value: number }) => void;
} & StyledPropsBlade;

export type SliderInputProps = SliderInputCommonProps;
