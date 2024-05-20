import type {
  DayOfWeek,
  DatePickerProps as MantineDatePickerProps,
  DatesRangeValue,
} from '@mantine/dates';
import type { DatePickerCommonInputProps } from './DateInput';
import type { BaseInputProps } from '~components/Input/BaseInput';

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
type CalendarProps<SelectionType extends DateSelectionType> = Pick<
  MantineDatePickerProps<SelectionType extends 'single' ? 'default' : 'range'>,
  | '__onDayMouseEnter'
  | '__onDayClick'
  | 'getDayProps'
  | 'getYearControlProps'
  | 'getMonthControlProps'
  | 'onMouseLeave'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onMonthSelect'
  | 'onYearSelect'
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
  defaultPicker?: PickerType;
  onPickerChange?: (picker: PickerType) => void;

  // Standard controlled/uncontrolled state props
  isOpen?: boolean;
  defaultIsOpen?: boolean;
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
  excludeDate?: (date: Date) => boolean;
  /**
   * Determines whether single date can be selected as range, applicable only when type="range"
   * @default false
   */
  allowSingleDateInRange?: boolean;
  /**
   * Sets the locale for the calendar.
   *
   * @default 'en'
   */
  locale?: string;

  // Basic selection props
  onNext?: (date: Date) => void;
  onNextMonth?: (date: Date) => void;
  onNextYear?: (date: Date) => void;
  onNextDecade?: (date: Date) => void;
  onPrevious?: (date: Date) => void;
  onPreviousYear?: (date: Date) => void;
  onPreviousMonth?: (date: Date) => void;
  onPreviousDecade?: (date: Date) => void;
};

type DatePickerProps<Type extends DateSelectionType> = CalendarProps<Type> &
  Omit<DatePickerCommonInputProps, 'inputRef' | 'referenceProps' | 'labelPosition'> & {
    label?: Type extends 'single' ? string : { start: string; end?: string };
    labelPosition?: BaseInputProps['labelPosition'];
  };

export type { CalendarProps, DatePickerProps, PickerType, DateSelectionType };
