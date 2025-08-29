import { DatePickerType, DatePickerValue } from '@mantine/dates';
interface UseUncontrolledDates<Type extends DatePickerType = 'default'> {
    type: Type;
    value: DatePickerValue<Type> | undefined;
    defaultValue: DatePickerValue<Type> | undefined;
    onChange: ((value: DatePickerValue<Type>) => void) | undefined;
    applyTimezone?: boolean;
}
declare function useUncontrolledDates<Type extends DatePickerType = 'default'>({ type, value, defaultValue, onChange, }: UseUncontrolledDates<Type>): any[];
export { useUncontrolledDates };
