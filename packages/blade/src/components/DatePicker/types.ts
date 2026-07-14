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
   * Controlled month that the calendar renders, independent of the selected `value`.
   *
   * Useful when you want the calendar to open on a specific month without pre-selecting
   * a date — e.g. a "comparison" range picker that should default to the period
   * immediately preceding a primary range picker's selection.
   *
   * Falls back to the first date of `value`/`defaultValue` (or today) when not set.
   *
   * When `visibleMonth` is controlled, you must handle `onVisibleMonthChange` to keep
   * the prop in sync — otherwise calendar navigation will not work.
   *
   * @example
   * // Anchor a comparison picker to the month before the primary range's start
   * <DatePicker selectionType="range" visibleMonth={dayjs(primaryStart).subtract(1, 'month').toDate()} />
   */
  visibleMonth?: Date;
  /**
   * Uncontrolled variant of `visibleMonth`. Sets the initial month the calendar renders,
   * without pre-selecting a date.
   */
  defaultVisibleMonth?: Date;
  /**
   * Callback which fires when the rendered month changes, either via calendar
   * navigation (next/previous month, year, or decade) or when a date in a
   * different month is selected. Does not fire when the `visibleMonth` prop
   * is updated externally by the consumer.
   */
  onVisibleMonthChange?: (date: Date) => void;

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
  /**
   * Whether to show the footer with apply/cancel buttons
   * @default true
   */
  showFooterActions?: boolean;
  /**
   * Custom React element to render in the footer above/side of action buttons
   * Can be used to add custom content like informational text, links, or other components
   */
  footer?: React.ReactElement;
  /**
   * Controls how the selected date is displayed in the input field.
   *
   * - `compact`: Shows only the preset label (e.g., "Last 7 days") instead of the actual dates.
   *   Useful for presets where showing the label is more meaningful than showing actual dates.
   * - `default`: Shows the actual date values in the input field.
   *
   * @default 'default'
   */
  displayFormat?: 'compact' | 'default';
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
    label?: Type extends 'single' ? string : string | { start: string; end?: string };
    /**
     * Sets the HTML [name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname) attribute on the input elements.
     * Can be used when submitting a form.
     *
     * @example 'date' | { start: 'start-date', end: 'end-date' }
     */
    name?: Type extends 'single' ? string : { start: string; end?: string };
    helpText?: Type extends 'single' ? string : string | { start: string; end?: string };
    errorText?: Type extends 'single' ? string : string | { start: string; end?: string };
    successText?: Type extends 'single' ? string : string | { start: string; end?: string };
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
    /**
     * Decides whether to render a clear icon button
     */
    showClearButton?: boolean;
    /**
     * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
     */
    onClearButtonClick?: () => void;
  };

type DatePickerRangeInputProps = {
  selectionType: 'range';
  label?: string | { start: string; end?: string };
  name?: { start: string; end: string };
  successText?: string | { start: string; end?: string };
  errorText?: string | { start: string; end?: string };
  helpText?: string | { start: string; end?: string };
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
  | 'size'
  | 'isRequired'
  | 'necessityIndicator'
  | 'autoFocus'
  | 'isDisabled'
  | 'accessibilityLabel'
  | 'labelSuffix'
  | 'labelTrailing'
> &
  FormInputValidationProps;

type DatePickerInputProps = DatePickerCommonInputProps &
  (DatePickerRangeInputProps | DatePickerSingleInputProps) & {
    format: string;
    placeholder?: string;
    setControlledValue?: (date: Date | null | [Date | null, Date | null]) => void;
    leadingDropdown?: React.ReactElement | null;
    selectedPreset?: DatesRangeValue | null;
    excludeDate?: (date: Date) => boolean;
    minDate?: Date;
    maxDate?: Date;
    effectiveSelectionType?: 'single' | 'range' | null;
    /**
     * Decides whether to render a clear icon button
     */
    showClearButton?: boolean;
    /**
     * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
     */
    onClearButtonClick?: () => void;
    /*
     * The label of the currently selected preset to display when displayFormat is 'compact'.
     */
    selectedPresetLabel?: string | null;
  };

type DatePickerFilterChipProps = DatePickerInputProps;

type FilterChipDatePickerProps = Omit<DatePickerProps<'single' | 'range'>, 'label'> & {
  /**
   * Sets the label for the input element.
   */
  label: string;
  /**
   * Callback which fires when the clear (cross) button is clicked.
   *
   * Clearing also fires `onChange` with an empty value (`null` for single selection,
   * `[null, null]` for range). When the FilterChipDatePicker is controlled (a `value` is
   * provided), the chip cannot clear itself — you must reset `value` in response to
   * `onChange`/`onClearButtonClick`. In the uncontrolled case (only `defaultValue`), the chip
   * clears itself automatically.
   *
   * Tip: pass `showClearButton={false}` to hide the clear button for filters that must always
   * hold a value.
   */
  onClearButtonClick?: () => void;
};

type DateInputProps = BaseInputProps & {
  format?: string;
  date?: Date | null | [Date | null, Date | null];
  setControlledValue?: (date: Date | null | [Date | null, Date | null]) => void;
  leadingDropdown?: React.ReactElement;
  selectionType: 'single' | 'range';
  excludeDate?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  effectiveSelectionType?: 'single' | 'range' | null;
  /**
   * Decides whether to render a clear icon button
   */
  showClearButton?: boolean;
  /**
   * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
   */
  onClearButtonClick?: () => void;
  /**
   * The label of the currently selected preset to display when displayFormat is 'compact'.
   */
  selectedPresetLabel?: string | null;
};

export type {
  CalendarProps,
  DatePickerProps,
  PickerType,
  DatesRangeValue,
  DateValue,
  DateSelectionType,
  DatePickerInputProps,
  DatePickerFilterChipProps,
  FilterChipDatePickerProps,
  DateInputProps,
};
