/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs';
import React from 'react';
import type { CalendarLevel } from '@mantine/dates';
import { shiftTimezone, useDatesContext, DatePicker } from '@mantine/dates';
import type { CalendarProps, DateSelectionType, PickerType, DateValue } from './types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGradientStyles, CalendarStyles } from './CalendarStyles';
import { useUncontrolledDates } from './useControlledDates';
import { levelToPicker, pickerToLevel, classes } from './constants';
import { useControllableState } from '~utils/useControllable';
import { useIsMobile } from '~utils/useIsMobile';
import { throwBladeError } from '~utils/logger';

const Calendar = <Type extends DateSelectionType>({
  firstDayOfWeek = 0,
  selectionType,
  allowSingleDateInRange,
  defaultPicker = 'day',
  picker,
  onPickerChange,
  date,
  defaultDate,
  onDateChange,
  locale,
  onNext,
  onPrevious,
  onNextMonth,
  onNextYear,
  onNextDecade,
  onPreviousMonth,
  onPreviousYear,
  onPreviousDecade,
  presets,
  ...props
}: CalendarProps<Type> & {
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: DateValue) => void;
}): React.ReactElement => {
  const isRange = selectionType === 'range';

  const [level, setLevel] = useControllableState<CalendarLevel>({
    defaultValue: pickerToLevel[defaultPicker],
    value: pickerToLevel[picker!],
    onChange: (level) => {
      onPickerChange?.(levelToPicker[level]);
    },
  });

  if (__DEV__) {
    if (isRange && level !== 'month') {
      throwBladeError({
        message: `Cannot use range DatePicker with pickerType: ${levelToPicker[level]}, Only "day" is supported`,
        moduleName: 'DatePicker',
      });
    }
  }

  const [_date, setDate] = useUncontrolledDates({
    type: 'default',
    value: date,
    defaultValue: defaultDate,
    onChange: onDateChange,
  });

  const dateContext = useDatesContext();
  const isMobile = useIsMobile();
  const currentDate = _date ?? shiftTimezone('add', new Date(), dateContext.getTimezone());
  const numberOfColumns = isMobile ?? !isRange ? 1 : 2;
  const columnsToScroll = numberOfColumns ?? 1;

  const handleNextMonth = () => {
    const nextDate = dayjs(currentDate).add(columnsToScroll, 'month').toDate();
    onNextMonth?.(nextDate);
    onNext?.(nextDate);
    setDate(nextDate);
  };

  const handlePreviousMonth = () => {
    const nextDate = dayjs(currentDate).subtract(columnsToScroll, 'month').toDate();
    onPreviousMonth?.(nextDate);
    onPrevious?.(nextDate);
    setDate(nextDate);
  };

  const handleNextYear = () => {
    const nextDate = dayjs(currentDate).add(columnsToScroll, 'year').toDate();
    onNextYear?.(nextDate);
    onNext?.(nextDate);
    setDate(nextDate);
  };

  const handlePreviousYear = () => {
    const nextDate = dayjs(currentDate).subtract(columnsToScroll, 'year').toDate();
    onPreviousYear?.(nextDate);
    onPrevious?.(nextDate);
    setDate(nextDate);
  };

  const handleNextDecade = () => {
    const nextDate = dayjs(currentDate)
      .add(10 * columnsToScroll, 'year')
      .toDate();
    onNextDecade?.(nextDate);
    onNext?.(nextDate);
    setDate(nextDate);
  };

  const handlePreviousDecade = () => {
    const nextDate = dayjs(currentDate)
      .subtract(10 * columnsToScroll, 'year')
      .toDate();
    onPreviousDecade?.(nextDate);
    onNext?.(nextDate);
    setDate(nextDate);
  };

  return (
    <CalendarStyles
      display="flex"
      flexDirection="column"
      gap="spacing.7"
      pickerType={levelToPicker[level]}
    >
      <CalendarHeader
        isRange={isRange}
        date={currentDate}
        onLevelChange={(level) => setLevel(() => level)}
        pickerType={levelToPicker[level] as PickerType}
        onNextMonth={handleNextMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextDecade={handleNextDecade}
        onPreviousDecade={handlePreviousDecade}
        onNextYear={handleNextYear}
        onPreviousYear={handlePreviousYear}
      />
      <CalendarGradientStyles isRange={isRange} date={currentDate}>
        <DatePicker
          withCellSpacing={false}
          type={isRange ? 'range' : 'default'}
          date={_date}
          locale={locale}
          level={level}
          onDateChange={setDate}
          onLevelChange={(level) => setLevel(() => level)}
          numberOfColumns={numberOfColumns}
          weekdayFormat="ddd"
          firstDayOfWeek={firstDayOfWeek}
          // @ts-expect-error unable to narrow props based on `type`
          allowSingleDateInRange={allowSingleDateInRange}
          classNames={{
            levelsGroup: classes.levelsGroup,
            day: classes.dayCell,
            monthsListControl: classes.monthsListControl,
            yearsListControl: classes.yearsListControl,
            calendarHeader: classes.calendarHeader,
            monthRow: classes.row,
            yearsListRow: classes.row,
            monthsListRow: classes.row,
            weekdaysRow: classes.row,
            weekday: classes.weekday,
          }}
          {...props}
        />
      </CalendarGradientStyles>
    </CalendarStyles>
  );
};

export { Calendar };
