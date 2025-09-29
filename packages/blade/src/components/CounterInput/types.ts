import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';
import type { MotionMetaProp } from '~components/BaseMotion';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type CounterInputCommonProps = Pick<
  BaseInputProps,
  | 'accessibilityLabel'
  | 'labelPosition'
  | 'name'
  | 'onFocus'
  | 'onBlur'
  | 'isDisabled'
  | 'testID'
  | keyof DataAnalyticsAttribute
> & {
  /**
   * Label to be shown for the counter input
   */
  label?: string;

  /**
   * The numerical value of the counter input
   */
  value?: number;

  /**
   * The default numerical value when component is uncontrolled
   */
  defaultValue?: number;

  /**
   * Minimum allowed value. When reached, the decrement button will be disabled
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value. When reached, the increment button will be disabled
   * If not provided, the increment button will not be disabled
   */
  max?: number;

  /**
   * Visual emphasis of the counter input
   * @default 'subtle'
   */
  emphasis?: 'subtle' | 'intense';

  /**
   * Size of the counter input
   * @default 'medium'
   */
  size?: 'xsmall' | 'medium' | 'large';

  /**
   * Decides whether to show a loading spinner and disable interaction
   * @default false
   */
  isLoading?: boolean;

  /**
   * Event handler called when the value changes via increment, decrement, or manual input
   */
  onChange?: (args: { value: number }) => void;
} & StyledPropsBlade &
  MotionMetaProp;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type CounterInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type CounterInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

export type CounterInputProps = (CounterInputPropsWithA11yLabel | CounterInputPropsWithLabel) &
  CounterInputCommonProps;

type CounterInputContextType = {
  /**
   * Size of the counter input
   */
  size?: CounterInputProps['size'];
  /**
   * Visual emphasis of the counter input
   */
  emphasis?: CounterInputProps['emphasis'];
  /**
   * Whether the counter input is disabled
   */
  isDisabled?: boolean;
  /**
   * Whether the counter input is in loading state
   */
  isLoading?: boolean;
  /**
   * Color of the counter input
   */
  color?: BaseTextProps['color'];
  /**
   * Disabled color text of the counter input
   */
  disabledTextColor?: BaseTextProps['color'];
  /**
   * Whether the counter input is inside an input group
   */
  isInsideCounterInput?: boolean;
};

export type { CounterInputContextType };
