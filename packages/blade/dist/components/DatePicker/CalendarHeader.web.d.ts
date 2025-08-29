import { CalendarLevel as MantineCalendarLevel } from '@mantine/dates';
import { PickerType, DateValue, DatesRangeValue } from './types';
type CalendarHeaderProps = {
    isRange: boolean;
    date: DateValue | DatesRangeValue;
    pickerType: PickerType;
    showLevelChangeLink?: boolean;
    onNextMonth: () => void;
    onPreviousMonth: () => void;
    onNextYear: () => void;
    onPreviousYear: () => void;
    onNextDecade: () => void;
    onPreviousDecade: () => void;
    onLevelChange: (level: MantineCalendarLevel) => void;
};
declare const CalendarHeader: ({ isRange, date, pickerType, onNextMonth, onNextYear, onNextDecade, onPreviousMonth, onPreviousYear, onPreviousDecade, onLevelChange, showLevelChangeLink, }: CalendarHeaderProps & {
    showLevelChangeLink?: boolean | undefined;
}) => React.ReactElement;
export { CalendarHeader };
