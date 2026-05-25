import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { FormInputLabelProps } from '~components/Form/FormLabel';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SliderOnChangeEvent = {
  value: number;
  name?: string;
};

type SliderProps = {
  /**
   * The minimum allowed value of the slider.
   * @default 0
   */
  min?: number;
  /**
   * The maximum allowed value of the slider.
   * @default 100
   */
  max?: number;
  /**
   * The granularity the value must adhere to.
   * @default 1
   */
  step?: number;
  /**
   * The controlled value of the slider. Use `onChange` to update the value.
   */
  value?: number;
  /**
   * The initial (uncontrolled) value of the slider.
   * @default 0
   */
  defaultValue?: number;
  /**
   * Callback fired when the value changes.
   */
  onChange?: (event: SliderOnChangeEvent) => void;
  /**
   * Callback fired when the slider is released (mouse/touch up).
   */
  onChangeEnd?: (event: SliderOnChangeEvent) => void;
  /**
   * If `true`, the slider will be disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * The name of the input (useful for form submission).
   */
  name?: string;
  /**
   * Provides an accessible label for the slider.
   */
  accessibilityLabel?: string;
  /**
   * If `true`, shows the current value above the thumb as a tooltip.
   * @default false
   */
  showTooltip?: boolean;
  /**
   * Help text shown below the slider.
   */
  helpText?: string;
  /**
   * Error text shown when `validationState` is `'error'`.
   */
  errorText?: string;
  /**
   * Success text shown when `validationState` is `'success'`.
   */
  successText?: string;
  /**
   * Sets validation state for the slider.
   * @default 'none'
   */
  validationState?: 'error' | 'success' | 'none';
  /**
   * Size of the slider track and thumb.
   * @default 'medium'
   */
  size?: 'small' | 'medium';
} & FormInputLabelProps &
  TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { SliderProps, SliderOnChangeEvent };
