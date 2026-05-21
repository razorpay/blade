import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SliderProps = {
  /**
   * Sets the minimum value of the slider.
   * @default 0
   */
  min?: number;
  /**
   * Sets the maximum value of the slider.
   * @default 100
   */
  max?: number;
  /**
   * Sets the step interval between values.
   * @default 1
   */
  step?: number;
  /**
   * The controlled value of the slider.
   * Use `onChange` to update its value.
   */
  value?: number;
  /**
   * The initial uncontrolled value of the slider.
   * @default 0
   */
  defaultValue?: number;
  /**
   * Callback fired when the slider value changes.
   */
  onChange?: ({ value }: { value: number }) => void;
  /**
   * If `true`, the slider will be disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Label displayed above the slider.
   */
  label?: string;
  /**
   * If `true`, the current value is shown next to the label.
   * @default false
   */
  showValue?: boolean;
  /**
   * Provides accessible label for the slider input (used as aria-label).
   */
  accessibilityLabel: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { SliderProps };
