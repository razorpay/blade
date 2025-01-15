/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DayOfWeek,
  DateValue,
  DatePickerProps as MantineDatePickerProps,
  DatesRangeValue,
} from '@mantine/dates';
import type { BaseInputProps } from '~components/Input/BaseInput';
import type { TextInputProps } from '~components/Input/TextInput';
import type { FormInputValidationProps } from '~components/Form';

type Level = 'month' | 'year' | 'decade';
type PickerType = 'day' | 'month' | 'year';
type Preset = {
  /**
   * Label for the preset
   *
   * @example 'Last 7 days'
   */
  label: string;
  /**
   * Value can be a range of dates
   *
   * @example with range selection
   * [dayjs().subtract(7, 'day'), dayjs()]
   */
  value: (date: Date) => DatesRangeValue;
};

type DateSelectionType = 'single' | 'range';
type MantineInternalProps =
  | '__onDayMouseEnter'
  | '__onDayClick'
  | 'getDayProps'
  | 'getYearControlProps'
  | 'getMonthControlProps'
  | 'onMouseLeave';

type CalendarProps<SelectionType extends DateSelectionType> = Pick<
  MantineDatePickerProps<SelectionType extends 'single' ? 'default' : 'range'>,
  MantineInternalProps | 'value' | 'defaultValue' | 'onChange' | 'onMonthSelect' | 'onYearSelect'
> & {
  /**
   * Sets the selection mode of the calendar
   * @default 'single'
   */
  selectionType?: SelectionType;
  /**
   * Sets the picker type
   * @default 'date'
   */
  picker?: PickerType;
  /**
   * Sets the default picker type
   */
  defaultPicker?: PickerType;
  /**
   * Callback which fires when picker type changes
   */
  onPickerChange?: (picker: PickerType) => void;

  /**
   * Controlled isOpen state
   */
  isOpen?: boolean;
  /**
   * Uncontrolled isOpen state
   */
  defaultIsOpen?: boolean;
  /**
   * Callback which fires when isOpen state changes
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;

  /**
   * Defines presets for the date picker
   *
   * @example with single selection
   * [
   *   { label: 'In 7 days', value: dayjs().add(7, 'day') },
   *   { label: 'In a month', value: dayjs().add(1, 'month') },
   * ]
   *
   * @example with range selection
   * [
   *   { label: 'Last 7 days', value: [dayjs().subtract(7, 'day'), dayjs()] },
   *   { label: 'Last month', value: [dayjs().subtract(1, 'month'), dayjs()] },
   * ]
   */
  presets?: Preset[];
  /**
   * Sets the first day of the week in the calendar.
   *
   * 0-6 (0=Sunday, 1=Monday, etc.)
   * @default 1
   */
  firstDayOfWeek?: DayOfWeek;
  /**
   * Sets the minimum date that can be selected.
   */
  minDate?: Date;
  /**
   * Sets the maximum date that can be selected.
   */
  maxDate?: Date;
  /**
   * Disables dates that do not pass the function.
   */
  excludeDate?: (date: Date) => boolean;
  /**
   * Determines whether single date can be selected as range, applicable only when type="range"
   * @default false
   */
  allowSingleDateInRange?: boolean;

  /**
   * Callback which is called whenever the next button is clicked.
   *
   * @param date - The updated date.
   * @param type - The level of the calendar. ("month" | "year" | "decade")
   */
  onNext?: ({ date, type }: { date: Date; type: Level }) => void;
  /**
   * Callback which is called whenever the previous button is clicked.
   *
   * @param date - The updated date.
   * @param type - The level of the calendar. ("month" | "year" | "decade")
   */
  onPrevious?: ({ date, type }: { date: Date; type: Level }) => void;
};

type DatePickerProps<Type extends DateSelectionType> = Omit<
  CalendarProps<Type>,
  MantineInternalProps
> &
  Omit<
    DatePickerCommonInputProps,
    | 'inputRef'
    | 'referenceProps'
    | 'labelPosition'
    | 'name'
    | 'successText'
    | 'errorText'
    | 'helpText'
  > & {
    /**
     * Sets the label for the input element.
     */
    label?: Type extends 'single' ? string : { start: string; end?: string };
    /**
     * Sets the HTML [name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname) attribute on the input elements.
     * Can be used when submitting a form.
     *
     * @example 'date' | { start: 'start-date', end: 'end-date' }
     */
    name?: Type extends 'single' ? string : { start: string; end?: string };
    helpText?: Type extends 'single' ? string : { start: string; end?: string };
    errorText?: Type extends 'single' ? string : { start: string; end?: string };
    successText?: Type extends 'single' ? string : { start: string; end?: string };
    /**
     * Callback which fires when apply button is clicked
     */
    onApply?: Type extends 'single' ? (value: DateValue) => void : (value: DatesRangeValue) => void;
    labelPosition?: BaseInputProps['labelPosition'];
    /**
     * Sets the date format to be displayed in the input field.
     * @default 'DD/MM/YYYY'  if pickerType is 'month' then 'MMMM', 'YYYY' if pickerType is 'year'
     */
    format?: 'DD/MM/YYYY' | 'MMM' | 'MMMM' | 'YYYY';
    /**
     *  Placeholder text for the datepicker input , when no date is selected.
     * @default 'DD/MM/YYYY'  if pickerType is 'month' then 'MMMM', 'YYYY' if pickerType is 'year'
     */
    inputPlaceHolder?: string;
  };

type DatePickerRangeInputProps = {
  selectionType: 'range';
  label?: { start: string; end?: string };
  name?: { start: string; end: string };
  successText?: { start: string; end?: string };
  errorText?: { start: string; end?: string };
  helpText?: { start: string; end?: string };
  date: [Date, Date];
};

type DatePickerSingleInputProps = {
  selectionType: 'single';
  label?: string;
  name?: string;
  successText?: string;
  errorText?: string;
  helpText?: string;
  date: Date;
};

type DatePickerCommonInputProps = {
  labelPosition?: BaseInputProps['labelPosition'];
  inputRef: React.Ref<any>;
  referenceProps: any;
} & Pick<
  TextInputProps,
  'size' | 'isRequired' | 'necessityIndicator' | 'autoFocus' | 'isDisabled' | 'accessibilityLabel'
> &
  FormInputValidationProps;

type DatePickerInputProps = DatePickerCommonInputProps &
  (DatePickerRangeInputProps | DatePickerSingleInputProps) & {
    format: string;
    placeholder?: string;
  };

export type {
  CalendarProps,
  DatePickerProps,
  PickerType,
  DatesRangeValue,
  DateValue,
  DateSelectionType,
  DatePickerInputProps,
};
