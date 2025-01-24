/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs';
import React from 'react';
import type { CalendarLevel } from '@mantine/dates';
import { useDatesContext, DatePicker } from '@mantine/dates';
import type { CalendarProps, DateSelectionType, PickerType, DateValue } from './types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGradientStyles, CalendarStyles } from './CalendarStyles';
import { useUncontrolledDates } from './useControlledDates';
import { levelToPicker, pickerToLevel, classes } from './constants';
import { shiftTimezone } from './shiftTimezone';
import { useControllableState } from '~utils/useControllable';
import { useIsMobile } from '~utils/useIsMobile';
import { throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

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
  onNext,
  onPrevious,
  presets,
  showLevelChangeLink,
  ...props
}: CalendarProps<Type> & {
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: DateValue) => void;
  showLevelChangeLink?: boolean;
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
  const currentDate = _date ?? shiftTimezone('add', new Date());
  const numberOfColumns = isMobile || !isRange ? 1 : 2;
  const columnsToScroll = numberOfColumns;

  const handleNextMonth = () => {
    const nextDate = dayjs(currentDate).add(columnsToScroll, 'month').toDate();
    onNext?.({ date: nextDate, type: 'month' });
    setDate(nextDate);
  };

  const handlePreviousMonth = () => {
    const nextDate = dayjs(currentDate).subtract(columnsToScroll, 'month').toDate();
    onPrevious?.({ date: nextDate, type: 'month' });
    setDate(nextDate);
  };

  const handleNextYear = () => {
    const nextDate = dayjs(currentDate).add(columnsToScroll, 'year').toDate();
    onNext?.({ date: nextDate, type: 'year' });
    setDate(nextDate);
  };

  const handlePreviousYear = () => {
    const nextDate = dayjs(currentDate).subtract(columnsToScroll, 'year').toDate();
    onPrevious?.({ date: nextDate, type: 'year' });
    setDate(nextDate);
  };

  const handleNextDecade = () => {
    const nextDate = dayjs(currentDate)
      .add(10 * columnsToScroll, 'year')
      .toDate();
    onNext?.({ date: nextDate, type: 'decade' });
    setDate(nextDate);
  };

  const handlePreviousDecade = () => {
    const nextDate = dayjs(currentDate)
      .subtract(10 * columnsToScroll, 'year')
      .toDate();
    onPrevious?.({ date: nextDate, type: 'decade' });
    setDate(nextDate);
  };

  return (
    <CalendarStyles
      display="flex"
      flexDirection="column"
      gap="spacing.7"
      pickerType={levelToPicker[level]}
      {...metaAttribute({ name: MetaConstants.Calendar })}
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
        showLevelChangeLink={showLevelChangeLink}
      />
      <CalendarGradientStyles isRange={isRange} date={currentDate}>
        <DatePicker
          withCellSpacing={false}
          type={isRange ? 'range' : 'default'}
          date={_date}
          locale={dateContext.locale}
          level={level}
          onDateChange={setDate}
          onLevelChange={(level) => setLevel(() => level)}
          numberOfColumns={numberOfColumns}
          weekdayFormat="ddd"
          firstDayOfWeek={firstDayOfWeek}
          // @ts-expect-error unable to narrow props based on `type`
          allowSingleDateInRange={allowSingleDateInRange}
          classNames={{
            monthLevelGroup: classes.levelsGroup,
            yearLevelGroup: classes.levelsGroup,
            decadeLevelGroup: classes.levelsGroup,
            day: classes.dayCell,
            monthsListCell: classes.yearsListControl,
            yearsListCell: classes.monthsListControl,
            monthCell: classes.dayCell,
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
