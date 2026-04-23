import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons/iconMap';

export type ChipColor = 'primary' | 'positive' | 'negative';
export type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';

type ChipCommonProps = {
  /**
   * Icon component to display in the Chip.
   */
  icon?: IconComponent;
  /**
   * Color variant of the Chip.
   * Overrides the color set by parent ChipGroup.
   */
  color?: ChipColor;
  /**
   * Whether the chip is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /** Value used for selection state tracking. */
  value?: string;
  /** CSS width of the chip container. */
  width?: string;
  /** CSS max-width of the chip container. */
  maxWidth?: string;
  /** CSS min-width of the chip container. */
  minWidth?: string;
  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade;

type ChipWithoutIconProps = ChipCommonProps & {
  icon?: undefined;
  /** Text content for the chip. Required when no icon is provided. */
  children: Snippet;
};

type ChipWithIconProps = ChipCommonProps & {
  icon: IconComponent;
  /** Text content for the chip. Optional when icon is provided. */
  children?: Snippet;
};

export type ChipProps = (ChipWithoutIconProps | ChipWithIconProps) & DataAnalyticsAttribute;

type ChipGroupCommonProps = {
  /** Snippet children (Chip components). */
  children: Snippet;
  /**
   * Position of the label relative to the chip group.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /** Help text displayed below the chip group. */
  helpText?: string;
  /** Error text displayed below the chip group when validation fails. */
  errorText?: string;
  /**
   * Validation state of the chip group.
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Necessity indicator displayed after the label.
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** Default selected value(s) for uncontrolled usage. */
  defaultValue?: string | string[];
  /**
   * Whether all chips in the group are disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether selection is required.
   * @default false
   */
  isRequired?: boolean;
  /** Name attribute for form submission. Auto-generated if not provided. */
  name?: string;
  /** Callback fired when selection changes. */
  onChange?: (payload: { name: string; values: string[] }) => void;
  /**
   * Selection behavior: single (radio) or multiple (checkbox).
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Size of the chips in the group.
   * @default 'small'
   */
  size?: ChipSize;
  /**
   * Color variant for all chips in the group.
   * @default 'primary'
   */
  color?: ChipColor;
  /** Controlled value(s). Use with onChange. */
  value?: string | string[];
  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade;

type ChipGroupPropsWithA11yLabel = {
  label?: undefined;
  /** Accessibility label when no visible label is provided. */
  accessibilityLabel: string;
};

type ChipGroupPropsWithLabel = {
  /** Visible label for the chip group. */
  label: string;
  /** Additional accessibility label. */
  accessibilityLabel?: string;
};

export type ChipGroupProps = (ChipGroupPropsWithA11yLabel | ChipGroupPropsWithLabel) &
  ChipGroupCommonProps &
  DataAnalyticsAttribute;

export type State = {
  value: string[];
  isChecked(value: string): boolean;
  addValue(value: string): void;
  removeValue(value: string): void;
};

export type ChipGroupContextType = Pick<
  ChipGroupCommonProps,
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
