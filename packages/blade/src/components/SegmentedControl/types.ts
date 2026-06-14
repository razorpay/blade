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
   * If `true`, each item expands to fill the available width equally.
   *
   * @default false
   */
  isFullWidth?: boolean;
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
} & TestID &
  DataAnalyticsAttribute;

type SegmentedControlItemProps = {
  /**
   * The unique value for this item.
   */
  value: string;
  /**
   * The label content of the item.
   */
  children: React.ReactNode;
  /**
   * An optional leading icon.
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
