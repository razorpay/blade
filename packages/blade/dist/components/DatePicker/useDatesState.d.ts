import { DatePickerType, PickerBaseProps } from '@mantine/dates';
interface UseDatesRangeInput<Type extends DatePickerType = 'default'> extends PickerBaseProps<Type> {
    level: 'year' | 'month' | 'day';
    type: Type;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
    applyTimezone?: boolean;
}
type ChangeValue = 'day' | 'month' | 'year';
type OnDateChange = (date: Date, changeValue: ChangeValue) => void;
export declare function useDatesState<Type extends DatePickerType = 'default'>({ type, level, value, defaultValue, onChange, allowSingleDateInRange, allowDeselect, onMouseLeave, applyTimezone, }: UseDatesRangeInput<Type>): {
    readonly onDateChange: OnDateChange;
    readonly onRootMouseLeave: ((event: import('react').MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
    readonly onHoveredDateChange: import('react').Dispatch<import('react').SetStateAction<Date | null>>;
    readonly getControlProps: (date: Date) => {
        selected: any;
        inRange: boolean;
        firstInRange: boolean;
        lastInRange: boolean;
        'data-autofocus': true | undefined;
        'data-celltype': "month" | "year" | "day";
        'data-date': string;
    } | {
        selected: boolean;
        'data-autofocus': true | undefined;
        'data-celltype': "month" | "year" | "day";
        'data-date': string;
        inRange?: undefined;
        firstInRange?: undefined;
        lastInRange?: undefined;
    };
    readonly setPickedDate: import('react').Dispatch<import('react').SetStateAction<Date | null>>;
    readonly pickedDate: Date | null;
    readonly controlledValue: any;
    readonly setControlledValue: any;
    readonly handleReset: () => void;
};
export {};
