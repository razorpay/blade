import type React from 'react';
import type { IconComponent } from '~components/Icons';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';

type SegmentedControlSize = 'small' | 'medium' | 'large';

type SegmentedControlProps = {
  /**
   * The content of the SegmentedControl, accepts `SegmentedControlItem` components.
   */
  children: React.ReactNode;
  /**
   * The controlled selected value.
   */
  value?: string;
  /**
   * The default value when uncontrolled.
   */
  defaultValue?: string;
  /**
   * Callback fired when the selected value changes.
   */
  onChange?: (value: string) => void;
  /**
   * The size of the segmented control.
   *
   * @default 'medium'
   */
  size?: SegmentedControlSize;
  /**
   * If `true`, the entire segmented control is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Name attribute for form submission.
   */
  name?: string;
  /**
   * Renders the label of the segmented control.
   */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Help text displayed below the segmented control.
   */
  helpText?: string;
  /**
   * Error text displayed when `validationState` is set to 'error'.
   * Overrides helpText.
   */
  errorText?: string;
  /**
   * Sets the validation state of the segmented control.
   * If set to `error`, renders the `errorText`.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after the label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the required state of the segmented control.
   *
   * @default false
   */
  isRequired?: boolean;
} & TestID &
  DataAnalyticsAttribute;

type SegmentedControlItemProps = {
  /**
   * The unique value for this item.
   */
  value: string;
  /**
   * The label content of the item. Can be omitted for icon-only items.
   */
  children?: React.ReactNode;
  /**
   * An optional leading icon. Can be used alone without children for icon-only items.
   */
  icon?: IconComponent;
  /**
   * If `true`, this item is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
} & TestID;

export type { SegmentedControlProps, SegmentedControlItemProps, SegmentedControlSize };
