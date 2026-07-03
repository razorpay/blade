import type { Snippet } from 'svelte';

export type SegmentedControlSize = 'small' | 'medium' | 'large';

type SegmentedControlCommonProps = {
  /**
   * The content of the SegmentedControl, accepts `SegmentedControlItem` snippets.
   */
  children: Snippet;
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
   * @default undefined
   */
  onChange?: (params: { name: string | undefined; value: string }) => void;
  /**
   * The size of the segmented control.
   * @default 'medium'
   */
  size?: SegmentedControlSize;
  /**
   * If `true`, the entire segmented control is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Name attribute for form identification.
   */
  name?: string;
  /**
   * Sets the position of the label.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Help text displayed below the segmented control.
   */
  helpText?: string;
  /**
   * Error text displayed when `validationState` is set to 'error'. Overrides helpText.
   */
  errorText?: string;
  /**
   * Sets the validation state of the segmented control.
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after the label.
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the required state of the segmented control.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Test ID for automated testing.
   */
  testID?: string;
};

type SegmentedControlPropsWithLabel = SegmentedControlCommonProps & {
  /**
   * Renders the label of the segmented control.
   */
  label: string;
  accessibilityLabel?: string;
};

type SegmentedControlPropsWithA11yLabel = SegmentedControlCommonProps & {
  label?: undefined;
  /**
   * Accessibility label for the segmented control (required when no visible label).
   */
  accessibilityLabel: string;
};

export type SegmentedControlProps =
  | SegmentedControlPropsWithLabel
  | SegmentedControlPropsWithA11yLabel;

export type SegmentedControlItemProps = {
  /**
   * The unique value for this item.
   */
  value: string;
  /**
   * The label content of the item.
   */
  children?: Snippet;
  /**
   * A leading icon component.
   */
  leading?: unknown;
  /**
   * If `true`, this item is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Accessibility label for the item. Required for icon-only items.
   */
  accessibilityLabel?: string;
  /**
   * Test ID for automated testing.
   */
  testID?: string;
};

export type SegmentedControlContextType = {
  selectedValue: string | undefined;
  setSelectedValue: (value: string) => void;
  size: SegmentedControlSize;
  isDisabled: boolean;
  name: string | undefined;
  baseId: string;
  totalItems: number;
  firstEnabledValue: string | undefined;
  /** Called synchronously during item init — no HTMLElement needed. */
  registerItem: (value: string, isItemDisabled: boolean) => void;
};
