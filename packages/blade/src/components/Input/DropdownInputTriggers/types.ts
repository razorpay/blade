import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';

export type SelectChevronIconProps = {
  onClick: () => void;
  isOpen?: boolean;
};

type DropdownInputTriggersCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'labelPosition'
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
   * constraints the height of input to given number rows
   *
   * When set to expandable, input takes 1 row in the begining and expands to take 3 when active
   *
   * @default 'single'
   */
  maxRows?: 'single' | 'multiple' | 'expandable';
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
  'onKeydown'
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
};

export type SelectInputProps = DropdownInputTriggersProps;

// @TODO add jsdoc in documentation PR
export type AutoCompleteProps = DropdownInputTriggersCommonProps & {
  onInputValueChange?: BaseInputProps['onChange'];
  inputValue?: BaseInputProps['value'];
  filteredValues?: string[];
};
