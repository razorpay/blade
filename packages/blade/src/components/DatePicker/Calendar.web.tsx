/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs';
import type { CalendarLevel } from '@mantine/dates';
import { shiftTimezone, useDatesContext, DatePicker } from '@mantine/dates';
import React from 'react';
import type { CalendarProps, DateSelectionType, PickerType } from './types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarStyles } from './CalendarStyles.web';
import { useUncontrolledDates } from './useControlledDates';
import { levelToPicker, pickerToLevel } from './utils';
import { useControllableState } from '~utils/useControllable';

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
  onNextMonth,
  onNextYear,
  onNextDecade,
  onPreviousMonth,
  onPreviousYear,
  onPreviousDecade,
  presets,
  ...props
}: CalendarProps<Type>): React.ReactElement => {
  const isRange = selectionType === 'range';

  const [level, setLevel] = useControllableState<CalendarLevel>({
    defaultValue: pickerToLevel[defaultPicker],
    value: pickerToLevel[picker!],
    onChange: (level) => {
      onPickerChange?.(levelToPicker[level]);
    },
  });

  const [_date, setDate] = useUncontrolledDates({
    type: 'default',
    value: date,
    defaultValue: defaultDate,
    onChange: onDateChange as any,
    // applyTimezone: !__timezoneApplied,
  });

  const ctx = useDatesContext();
  const currentDate = _date || shiftTimezone('add', new Date(), ctx.getTimezone());
  const numberOfColumns = isRange ? 2 : 1;
  const columnsToScroll = numberOfColumns || 1;

  const handleNextMonth = () => {
    const nextDate = dayjs(currentDate).add(columnsToScroll, 'month').toDate();
    onNextMonth?.(nextDate);
    setDate(nextDate);
  };

  const handlePreviousMonth = () => {
    const nextDate = dayjs(currentDate).subtract(columnsToScroll, 'month').toDate();
    onPreviousMonth?.(nextDate);
    setDate(nextDate);
  };

  const handleNextYear = () => {
    const nextDate = dayjs(currentDate).add(columnsToScroll, 'year').toDate();
    onNextYear?.(nextDate);
    setDate(nextDate);
  };

  const handlePreviousYear = () => {
    const nextDate = dayjs(currentDate).subtract(columnsToScroll, 'year').toDate();
    onPreviousYear?.(nextDate);
    setDate(nextDate);
  };

  const handleNextDecade = () => {
    const nextDate = dayjs(currentDate)
      .add(10 * columnsToScroll, 'year')
      .toDate();
    onNextDecade?.(nextDate);
    setDate(nextDate);
  };

  const handlePreviousDecade = () => {
    const nextDate = dayjs(currentDate)
      .subtract(10 * columnsToScroll, 'year')
      .toDate();
    onPreviousDecade?.(nextDate);
    setDate(nextDate);
  };

  return (
    <CalendarStyles
      display="flex"
      flexDirection="column"
      gap="spacing.6"
      firstDayOfWeek={firstDayOfWeek}
      backgroundColor="surface.background.gray.intense"
      padding="spacing.6"
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
      <DatePicker
        withCellSpacing={false}
        type={selectionType === 'single' ? 'default' : 'range'}
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
          levelsGroup: 'DatePicker-levelsGroup',
          day: 'DatePicker-cell',
          monthsListControl: 'DatePicker-cell',
          yearsListControl: 'DatePicker-cell',
          calendarHeader: 'DatePicker-header',
          monthRow: 'DatePicker-row',
          yearsListRow: 'DatePicker-row',
          monthsListRow: 'DatePicker-row',
          weekdaysRow: 'DatePicker-row',
          weekday: 'DatePicker-weekday',
        }}
        {...props}
      />
    </CalendarStyles>
  );
};

export { Calendar };
