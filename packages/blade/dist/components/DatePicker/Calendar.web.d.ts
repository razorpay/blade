import { default as React } from 'react';
import { DatesRangeValue } from '@mantine/dates';
import { CalendarProps, DateSelectionType, PickerType, DateValue } from './types';
declare const Calendar: <Type extends DateSelectionType>({ firstDayOfWeek, selectionType, allowSingleDateInRange, defaultPicker, picker, onPickerChange, date, defaultDate, onDateChange, onNext, onPrevious, presets, showLevelChangeLink, selectedValue, ...props }: Pick<import('@mantine/dates').DatePickerProps<Type extends "single" ? "default" : "range">, "value" | "defaultValue" | "onChange" | ("onMouseLeave" | "__onDayMouseEnter" | "__onDayClick" | "getDayProps" | "getYearControlProps" | "getMonthControlProps") | "onMonthSelect" | "onYearSelect"> & {
    selectionType?: Type | undefined;
    picker?: PickerType | undefined;
    defaultPicker?: PickerType | undefined;
    onPickerChange?: ((picker: PickerType) => void) | undefined;
    isOpen?: boolean | undefined;
    defaultIsOpen?: boolean | undefined;
    onOpenChange?: (({ isOpen }: {
        isOpen: boolean;
    }) => void) | undefined;
    presets?: {
        label: string;
        value: (date: Date) => DatesRangeValue;
    }[] | undefined;
    firstDayOfWeek?: import('@mantine/dates').DayOfWeek | undefined;
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
    excludeDate?: ((date: Date) => boolean) | undefined;
    allowSingleDateInRange?: boolean | undefined;
    onNext?: (({ date, type }: {
        date: Date;
        type: "month" | "year" | "decade";
    }) => void) | undefined;
    onPrevious?: (({ date, type }: {
        date: Date;
        type: "month" | "year" | "decade";
    }) => void) | undefined;
    showFooterActions?: boolean | undefined;
} & {
    date?: Date | undefined;
    defaultDate?: Date | undefined;
    onDateChange?: ((date: DateValue) => void) | undefined;
    showLevelChangeLink?: boolean | undefined;
    selectedValue: DatesRangeValue | null;
}) => React.ReactElement;
export { Calendar };
