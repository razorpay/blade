import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { FormInputLabelProps, FormInputValidationProps } from '~components/Form';

type OnChange = ({ value, name }: { value: number; name?: string }) => void;

type SliderProps = {
  /**
   * The label to display for the slider.
   */
  label?: string;
  /**
   * Desktop only prop. Default value on mobile will be `top`.
   *
   * @default 'top'
   */
  labelPosition?: FormInputLabelProps['labelPosition'];
  /**
   * Sets the controlled value of the slider. Use `onChange` to update it.
   */
  value?: number;
  /**
   * Sets the initial uncontrolled value of the slider.
   *
   * @default 0
   */
  defaultValue?: number;
  /**
   * The minimum allowed value for the slider.
   *
   * @default 0
   */
  min?: number;
  /**
   * The maximum allowed value for the slider.
   *
   * @default 100
   */
  max?: number;
  /**
   * The stepping interval between values.
   *
   * @default 1
   */
  step?: number;
  /**
   * The callback invoked when the slider value changes.
   */
  onChange?: OnChange;
  /**
   * The name attribute of the hidden input element, useful for form submission.
   */
  name?: string;
  /**
   * If `true`, the slider will be disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the size of the slider.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If `true`, shows the current value next to the slider label.
   *
   * @default true
   */
  showValue?: boolean;
  /**
   * Provides an accessible label for the slider when no visible label is provided.
   */
  accessibilityLabel?: string;
} & FormInputValidationProps &
  TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { OnChange, SliderProps };
