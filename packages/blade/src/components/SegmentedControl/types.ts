import type React from 'react';
import type { IconComponent } from '~components/Icons';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type SegmentedControlSize = 'small' | 'medium' | 'large';

type SegmentedControlCommonProps = {
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
  onChange?: ({ name, value }: { name: string | undefined; value: string }) => void;
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
   * Name attribute for form identification.
   */
  name?: string;
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
  DataAnalyticsAttribute &
  StyledPropsBlade;

type SegmentedControlPropsWithLabel = {
  /**
   * Renders the label of the segmented control.
   */
  label: string;
  /**
   * Accessibility label for the segmented control.
   */
  accessibilityLabel?: string;
};

type SegmentedControlPropsWithA11yLabel = {
  /**
   * Renders the label of the segmented control.
   */
  label?: undefined;
  /**
   * Accessibility label for the segmented control (required when no visible label).
   */
  accessibilityLabel: string;
};

type SegmentedControlProps = (SegmentedControlPropsWithLabel | SegmentedControlPropsWithA11yLabel) &
  SegmentedControlCommonProps;

type SegmentedControlItemIconWithLabel = {
  /**
   * A leading icon component.
   */
  leading: IconComponent;
  /**
   * The label content of the item.
   */
  children: React.ReactNode;
  /**
   * Accessibility label for the item.
   */
  accessibilityLabel?: string;
};

type SegmentedControlItemIconOnly = {
  /**
   * A leading icon component.
   */
  leading: IconComponent;
  /**
   * The label content of the item. Omit for icon-only items.
   */
  children?: undefined;
  /**
   * Accessibility label for the item. Required for icon-only items.
   */
  accessibilityLabel: string;
};

type SegmentedControlItemWithIconProps =
  | SegmentedControlItemIconWithLabel
  | SegmentedControlItemIconOnly;

type SegmentedControlItemWithoutIconProps = {
  /**
   * A leading icon component.
   */
  leading?: undefined;
  /**
   * The label content of the item.
   */
  children: React.ReactNode;
  /**
   * Accessibility label for the item.
   */
  accessibilityLabel?: string;
};

type SegmentedControlItemProps = (
  | SegmentedControlItemWithIconProps
  | SegmentedControlItemWithoutIconProps
) & {
  /**
   * The unique value for this item.
   */
  value: string;
  /**
   * If `true`, this item is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute;

export type { SegmentedControlProps, SegmentedControlItemProps, SegmentedControlSize };
