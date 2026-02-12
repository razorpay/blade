import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

// Placeholder type until Icons are migrated
type IconComponent = unknown;

export type ChipColor = 'primary' | 'positive' | 'negative';
export type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';

type ChipCommonProps = {
  /**
   * Displays the Blade Icon component within the Chip.
   * Accepts a component of type `IconComponent` from Blade.
   */
  icon?: IconComponent;
  /**
   * Sets the Chip's visual color.
   * Falls back to the color set by the parent `ChipGroup` component.
   */
  color?: ChipColor;
  /**
   * If `true`, the Chip will be disabled.
   * Also inherits from group.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * The value to be used in the Chip input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * Sets the width of the Chip.
   */
  width?: string;
  /**
   * Sets the maxWidth of the Chip.
   */
  maxWidth?: string;
  /**
   * Sets the minWidth of the Chip.
   */
  minWidth?: string;
  /**
   * Test ID for the element.
   */
  testID?: string;
  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

/**
 * Mandatory children prop when icon is not provided.
 */
type ChipWithoutIconProps = ChipCommonProps & {
  icon?: undefined;
  /** Text content of the Chip. Required when no icon is provided. */
  children: Snippet | string;
};

/**
 * Optional children prop when icon is provided.
 */
type ChipWithIconProps = ChipCommonProps & {
  icon: IconComponent;
  /** Text content of the Chip. Optional when icon is provided. */
  children?: Snippet | string;
};

export type ChipProps = ChipWithoutIconProps | ChipWithIconProps;

type ChipGroupCommonProps = {
  /**
   * Sets the position of the label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Help text of the chip group.
   */
  helpText?: string;
  /**
   * Error text of the chip group.
   * Renders when `validationState` is set to 'error'.
   * Overrides helpText.
   */
  errorText?: string;
  /**
   * Sets the validation state of the ChipGroup.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after ChipGroup label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Accepts multiple Chip components as children.
   */
  children: Snippet;
  /**
   * Sets the initial value of the ChipGroup component.
   */
  defaultValue?: string | string[];
  /**
   * Controls the interactive state of the ChipGroup.
   * When set to true, all contained Chip elements become non-interactive and visually disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the ChipGroup component.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Specifies the name attribute for the ChipGroup component.
   * When provided, this attribute ensures that the Chip elements within the group
   * are semantically associated for form submission.
   * If not provided, a default unique identifier will be generated internally.
   */
  name?: string;
  /**
   * The callback invoked on any state change within the ChipGroup.
   */
  onChange?: (payload: { name: string; values: string[] }) => void;
  /**
   * Defines the selection behavior within the ChipGroup component.
   * When set to 'single', only one Chip can be selected at a time.
   * When set to 'multiple', multiple Chips can be concurrently selected.
   *
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Specifies the size of the rendered Chips within the ChipGroup.
   *
   * @default 'small'
   */
  size?: ChipSize;
  /**
   * Value of the Chip group.
   * Acts as a controlled component by specifying the ChipGroup value.
   * Use `onChange` to update its value.
   */
  value?: string | string[];
  /**
   * Sets the ChipGroup's visual color. It will propagate down to all the Chips.
   *
   * @default 'primary'
   */
  color?: ChipColor;
  /**
   * Test ID for the element.
   */
  testID?: string;
  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

/**
 * Mandatory accessibilityLabel prop when label is not provided.
 */
type ChipGroupPropsWithA11yLabel = {
  /** Label to be shown for the input field. */
  label?: undefined;
  /** Accessibility label for the input. */
  accessibilityLabel: string;
};

/**
 * Optional accessibilityLabel prop when label is provided.
 */
type ChipGroupPropsWithLabel = {
  /** Label to be shown for the input field. */
  label: string;
  /** Accessibility label for the input. */
  accessibilityLabel?: string;
};

export type ChipGroupProps = (ChipGroupPropsWithA11yLabel | ChipGroupPropsWithLabel) &
  ChipGroupCommonProps;

export type State = {
  value: string[];
  isChecked(value: string): boolean;
  addValue(value: string): void;
  removeValue(value: string): void;
};

export type ChipGroupContextType = Pick<
  ChipGroupProps,
  | 'isDisabled'
  | 'isRequired'
  | 'necessityIndicator'
  | 'validationState'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'size'
  | 'color'
  | 'selectionType'
> & { state?: State };
