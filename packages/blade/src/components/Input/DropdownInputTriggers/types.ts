import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute } from '~utils/types';

export type SelectChevronIconProps = {
  onClick?: () => void;
  isOpen?: boolean;
  isDisabled?: boolean;
};

type DropdownInputTriggersCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'name'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'autoFocus'
  | 'onClick'
  | 'onFocus'
  | 'onBlur'
  | 'placeholder'
  | 'testID'
  | 'size'
  | keyof DataAnalyticsAttribute
> & {
  icon?: IconComponent;
  /**
   * Controlled value of the Select. Use it in combination of `onChange`.
   *
   * Check out [Controlled Dropdown Documentation](https://blade.razorpay.com/?path=/story/components-dropdown-with-select--controlled-dropdown&globals=measureEnabled:false) for example.
   */
  value?: string | string[];
  /**
   * Used to set the default value of SelectInput when it's uncontrolled. Use `value` instead for controlled SelectInput
   */
  defaultValue?: string | string[];
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;
  /**
   * Syncs the selected value to inputValue in AutoComplete
   *
   * Only needed in single select AutoComplete because inputValue is expected to be same as selected value there
   */
  syncInputValueWithSelection?: (value: string) => void;
  /**
   * constraints the height of input to given number rows
   *
   * When set to expandable, input takes 1 row in the begining and expands to take 3 when active
   *
   * @default 'single'
   */
  maxRows?: 'single' | 'multiple' | 'expandable';

  /**
   * Position of the label.
   *
   * Can be
   * - top: top positioned
   * - left: left positioned
   * - inside-input: added inside the input (not applicable for single select AutoComplete)
   */
  labelPosition?: BaseInputProps['labelPosition'] | 'inside-input';
};

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type DropdownInputTriggersPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type DropdownInputTriggersPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type DropdownInputTriggersProps = (
  | DropdownInputTriggersPropsWithA11yLabel
  | DropdownInputTriggersPropsWithLabel
) &
  DropdownInputTriggersCommonProps;

export type BaseDropdownInputTriggerProps = Omit<
  DropdownInputTriggersProps,
  // AutoComplete and SelectInput have slightly different implementations for keydown and change
  'onKeydown' | 'onClick'
> & {
  onTriggerKeydown: BaseInputProps['onKeyDown'];
  /**
   * For AutoComplete
   */
  onInputValueChange?: BaseInputProps['onChange'];
  /**
   * For AutoComplete
   */
  inputValue?: BaseInputProps['value'];

  /**
   * Set true if trigger is selectinput
   */
  isSelectInput: boolean;

  /**
   * Internal prop to handle click on input trigger
   */
  onTriggerClick: BaseInputProps['onClick'];
};

export type useControlledDropdownInputProps = Pick<
  BaseDropdownInputTriggerProps,
  | 'onChange'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onInputValueChange'
  | 'syncInputValueWithSelection'
  | 'isSelectInput'
> & {
  triggererRef: React.RefObject<HTMLElement>;
};

export type SelectInputProps = DropdownInputTriggersProps;

export type AutoCompleteProps = DropdownInputTriggersCommonProps & {
  /**
   * Callback to handle the change in input element.
   *
   * This is different from onChange which handles the change in selection of item
   */
  onInputValueChange?: BaseInputProps['onChange'];
  /**
   * Controlled state of value inside AutoComplete input
   */
  inputValue?: BaseInputProps['value'];
  /**
   * Controlled state of filtering of items in AutoComplete.
   *
   * Checkout [Custom Filtering Example](https://blade.razorpay.com/?path=/story/components-dropdown-with-autocomplete--controlled-filtering)
   *
   */
  filteredValues?: string[];
};
