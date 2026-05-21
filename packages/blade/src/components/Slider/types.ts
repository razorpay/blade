import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SliderOnChange = ({
  value,
  event,
}: {
  value: number;
  event: React.ChangeEvent<HTMLInputElement>;
}) => void;

type SliderProps = {
  /**
   * The label for the slider.
   */
  label?: string;

  /**
   * Provides accessible label for the slider input element.
   * Falls back to `label` if not provided.
   */
  accessibilityLabel?: string;

  /**
   * Sets the controlled value of the slider.
   * Use `onChange` to update it.
   */
  value?: number;

  /**
   * Sets the initial uncontrolled value of the slider.
   * @default 0
   */
  defaultValue?: number;

  /**
   * Callback invoked when the slider value changes.
   */
  onChange?: SliderOnChange;

  /**
   * The minimum value of the slider.
   * @default 0
   */
  min?: number;

  /**
   * The maximum value of the slider.
   * @default 100
   */
  max?: number;

  /**
   * The step increment of the slider.
   * @default 1
   */
  step?: number;

  /**
   * If `true`, the slider will be disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * The size of the slider.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The name of the input field, useful for form submission.
   */
  name?: string;

  /**
   * Whether to show the current value label.
   * @default true
   */
  showValue?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { SliderProps, SliderOnChange };
