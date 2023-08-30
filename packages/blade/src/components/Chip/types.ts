import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { Theme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';
import type { DotNotationColorStringToken, StringChildrenType, TestID } from '~utils/types';

type ChipProps = {
  /**
   * Sets the label of the Chip
   */
  children: StringChildrenType;
  /**
   * Displays the Blade Icon component within the Chip
   * Accepts a component of type `IconComponent` from Blade.
   *
   */
  icon?: IconComponent;
  /**
   * Sets the Chip's visual intent
   *
   */
  intent?: 'positive' | 'negative' | 'none';
  /**
   * If `true`, the Chip will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * The value to be used in the Chip input.
   * This is the value that will be returned on form submission.
   * Use `onChange` to update its value
   */
  value?: string;
} & TestID &
  StyledPropsBlade;

type ChipGroupProps = {
  /**
   * Accessibility label for the ChipGroup
   */
  accessibilityLabel: string;
  /**
   * Accepts multiple Chip components as children
   */
  children: React.ReactNode;
  /**
   * Sets the initial value of the ChipGroup component.
   */
  defaultValue?: string | string[];
  /**
   * Controls the interactive state of the ChipGroup. When set to true, all contained Chip elements become non-interactive and visually disabled.
   * Setting it to false enables normal user interaction. Useful for temporarily disabling user input within the ChipGroup.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Specifies the name attribute for the ChipGroup component.
   * When provided, this attribute ensures that the Chip elements within the group are semantically associated, allowing them to be grouped logically for form submission.
   * This can be particularly useful in scenarios where the ChipGroup is part of a larger form and needs to be identified as a distinct entity when the form is submitted.
   * If not provided, a default unique identifier will be generated internally.
   */
  name?: string;
  /**
   * The callback invoked on any state change within the ChipGroup
   */
  onChange?: ({ name, values }: { name: string; values: string[] }) => void;
  /**
   * Defines the selection behavior within the ChipGroup component.
   * When set to 'single', only one Chip can be selected at a time, akin to a radio button group.
   * When set to 'multiple', multiple Chips can be concurrently selected, simulating checkbox-like behavior within the group.
   *
   * @default "single"
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Specifies the size of the rendered Chips withing the ChipGroup
   *
   * @default "small"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Value of the Chip group
   * Acts as a controlled component by specifying the ChipGroup value
   * Use `onChange` to update its value
   */
  value?: string | string[];
  /**
   * Sets the ChipGroups's visual intent, it will propagate down to all the Chips
   *
   * @default "none"
   */
  intent?: 'positive' | 'negative' | 'none';
} & TestID &
  StyledPropsBlade;

type State = {
  value: string[];
  isChecked(value: string): boolean;
  addValue(value: string): void;
  removeValue(value: string): void;
};

type ChipGroupContextType = Pick<
  ChipGroupProps,
  | 'isDisabled'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'size'
  | 'intent'
  | 'selectionType'
> & { state?: State };

type AnimatedChipProps = {
  borderColor: DotNotationColorStringToken<Theme['colors']>;
  isPressed?: boolean;
  isDisabled?: boolean;
  isDesktop?: boolean;
  theme: Theme;
  children: React.ReactNode;
};

type StyledChipWrapperProps = {
  intent: ChipGroupProps['intent'];
  borderColor: DotNotationColorStringToken<Theme['colors']>;
  isChecked?: boolean;
  isDisabled?: boolean;
  theme: Theme;
  children: React.ReactNode;
};

export type {
  AnimatedChipProps,
  ChipGroupContextType,
  ChipGroupProps,
  ChipProps,
  State,
  StyledChipWrapperProps,
};
