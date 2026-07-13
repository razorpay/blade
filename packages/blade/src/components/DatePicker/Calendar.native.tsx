/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs';
import React from 'react';
import { useI18nContext } from '@razorpay/i18nify-react';
import type { DateSelectionType, PickerType, DatesRangeValue } from './types';
import { CalendarHeader } from './CalendarHeader';
import { DayCell, ListCell, TodayDot } from './CalendarStyles.native';
import { levelToPicker, pickerToLevel } from './constants';
import { shiftTimezone } from './shiftTimezone';
import { convertIntlToDayjsLocale } from './utils';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { useControllableState } from '~utils/useControllable';
import { throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

type CalendarLevel = 'month' | 'year' | 'decade';
type NavType = 'month' | 'year' | 'decade';

type ControlProps = {
  selected: boolean;
  inRange?: boolean;
  firstInRange?: boolean;
  lastInRange?: boolean;
};

type CalendarNativeProps<Type extends DateSelectionType> = {
  firstDayOfWeek?: number;
  selectionType?: Type;
  allowSingleDateInRange?: boolean;
  defaultPicker?: PickerType;
  picker?: PickerType;
  onPickerChange?: (picker: PickerType) => void;
  minDate?: Date;
  maxDate?: Date;
  excludeDate?: (date: Date) => boolean;
  showLevelChangeLink?: boolean;
  selectedValue: DatesRangeValue | Date | null;
  __onDayClick?: (event: undefined, date: Date) => void;
  getDayProps: (date: Date) => ControlProps;
  getMonthControlProps: (date: Date) => ControlProps;
  getYearControlProps: (date: Date) => ControlProps;
  onMonthSelect?: (date: Date) => void;
  onYearSelect?: (date: Date) => void;
  onNext?: (data: { date: Date; type: NavType }) => void;
  onPrevious?: (data: { date: Date; type: NavType }) => void;
};

const DAY_COLORS = {
  default: 'interactive.text.gray.normal',
  disabled: 'interactive.text.gray.disabled',
  outside: 'interactive.text.gray.muted',
  onSelected: 'interactive.text.onPrimary.normal',
  today: 'interactive.text.primary.normal',
} as const;

// Hoisted so the same object reference is reused across renders (a new inline
// `{ aspectRatio: 1 }` on every cell would defeat DayCell memoization).
const DAY_CELL_STYLE = { aspectRatio: 1 } as const;

type DayGridCellProps = {
  dateTime: number;
  dayLabel: string;
  accessibilityLabel: string;
  textColor: string;
  isSelected: boolean;
  isInRange?: boolean;
  isFirstInRange?: boolean;
  isLastInRange?: boolean;
  isDisabled: boolean;
  isToday: boolean;
  onDayPress: (dateTime: number) => void;
};

/**
 * Memoized single day cell. Tapping a date only changes the selection booleans
 * of the one or two affected cells, so `React.memo` lets every other cell skip
 * re-rendering (and skip the styled-components style recompute + Text render).
 * All props are primitives / a stable callback so the shallow compare is cheap.
 */
const DayGridCell = React.memo(
  ({
    dateTime,
    dayLabel,
    accessibilityLabel,
    textColor,
    isSelected,
    isInRange,
    isFirstInRange,
    isLastInRange,
    isDisabled,
    isToday,
    onDayPress,
  }: DayGridCellProps): React.ReactElement => {
    return (
      <DayCell
        style={DAY_CELL_STYLE}
        isSelected={isSelected}
        isInRange={isInRange}
        isFirstInRange={isFirstInRange}
        isLastInRange={isLastInRange}
        isDisabled={isDisabled}
        disabled={isDisabled}
        accessibilityLabel={accessibilityLabel}
        onPress={() => {
          if (isDisabled) return;
          onDayPress(dateTime);
        }}
      >
        <Text size="medium" color={textColor as never}>
          {dayLabel}
        </Text>
        {isToday ? <TodayDot isSelected={isSelected} /> : null}
      </DayCell>
    );
  },
);

/**
 * Native calendar. The web version renders `@mantine/dates` `<DatePicker>` (DOM only),
 * so on native the grid is rebuilt by hand with dayjs. Day / month / year levels are
 * supported; range selection visuals are driven by the shared `getControlProps`
 * booleans returned via `getDayProps`. Locale comes from `useI18nContext` (not the
 * web-only `@mantine/dates` `DatesProvider`).
 */
const Calendar = <Type extends DateSelectionType>({
  firstDayOfWeek = 0,
  selectionType,
  defaultPicker = 'day',
  picker,
  onPickerChange,
  minDate,
  maxDate,
  excludeDate,
  showLevelChangeLink,
  selectedValue,
  __onDayClick,
  getDayProps,
  getMonthControlProps,
  getYearControlProps,
  onMonthSelect,
  onYearSelect,
  onNext,
  onPrevious,
}: CalendarNativeProps<Type>): React.ReactElement => {
  const isRange = selectionType === 'range';
  const { i18nState } = useI18nContext();
  const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');

  const [level, setLevel] = useControllableState<CalendarLevel>({
    defaultValue: pickerToLevel[defaultPicker],
    value: picker ? pickerToLevel[picker] : undefined,
    onChange: (newLevel) => {
      onPickerChange?.(levelToPicker[newLevel]);
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

  const [viewDate, setViewDate] = React.useState<Date | null>(null);

  const currentDate = React.useMemo(() => {
    if (viewDate) {
      return viewDate;
    }
    const isRangeSelection = Array.isArray(selectedValue);
    if (isRangeSelection && (selectedValue as DatesRangeValue)[0]) {
      return (selectedValue as DatesRangeValue)[0]!;
    }
    if (!isRangeSelection && selectedValue) {
      return selectedValue;
    }
    return shiftTimezone('add', new Date());
  }, [viewDate, selectedValue]);

  const currentPicker = levelToPicker[level] as PickerType;

  // Keep a stable day-press handler so memoized `DayGridCell`s don't re-render just
  // because `__onDayClick` (recreated by the parent each render) changed identity.
  const onDayClickRef = React.useRef(__onDayClick);
  onDayClickRef.current = __onDayClick;
  const handleDayPress = React.useCallback((dateTime: number) => {
    onDayClickRef.current?.(undefined, new Date(dateTime));
  }, []);

  const navigate = (unit: 'month' | 'year', amount: number, type: NavType): void => {
    const nextDate = dayjs(currentDate).add(amount, unit).toDate();
    if (amount > 0) {
      onNext?.({ date: nextDate, type });
    } else {
      onPrevious?.({ date: nextDate, type });
    }
    setViewDate(nextDate);
  };

  const isDateDisabled = (date: dayjs.Dayjs): boolean => {
    const dateObj = date.toDate();
    if (excludeDate?.(dateObj)) return true;
    if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
    if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
    return false;
  };

  // Selection-independent day-grid geometry (dates, labels, today/outside/disabled
  // flags, weekday headers). Keyed on the visible month so tapping different days in
  // the same month does NOT rebuild the grid or recreate 42 dayjs objects per render —
  // only the per-cell selection booleans below are recomputed.
  const monthKey = dayjs(currentDate).format('YYYY-MM');
  const dayGrid = React.useMemo(() => {
    const monthStart = dayjs(currentDate).startOf('month');
    const startWeekday = monthStart.day();
    const offset = (startWeekday - firstDayOfWeek + 7) % 7;
    const gridStart = monthStart.subtract(offset, 'day');
    const today = dayjs();
    const monthIndex = monthStart.month();

    const weekdays = Array.from({ length: 7 }, (_, i) =>
      dayjs()
        .locale(locale)
        .day((firstDayOfWeek + i) % 7)
        .format('ddd'),
    );

    const cells = Array.from({ length: 42 }, (_, i) => {
      const day = gridStart.add(i, 'day');
      return {
        dateTime: day.valueOf(),
        dayLabel: day.format('D'),
        accessibilityLabel: day.locale(locale).format('D MMMM YYYY'),
        isOutside: day.month() !== monthIndex,
        isToday: day.isSame(today, 'day'),
        isDisabled: isDateDisabled(day),
      };
    });

    return { weekdays, cells };
    // `monthKey` (not `currentDate`) is the intended dependency — the grid only
    // depends on which month is shown, not the exact selected date.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey, firstDayOfWeek, locale, minDate, maxDate, excludeDate]);

  const renderDayGrid = (): React.ReactElement => {
    const { weekdays, cells } = dayGrid;
    const weeks = Array.from({ length: 6 }, (_, weekIndex) =>
      cells.slice(weekIndex * 7, weekIndex * 7 + 7),
    );

    return (
      <BaseBox display="flex" flexDirection="column">
        <BaseBox display="flex" flexDirection="row" marginBottom="spacing.4">
          {weekdays.map((weekday, index) => (
            <BaseBox key={index} flex={1} display="flex" alignItems="center">
              <Text size="small" weight="medium" color="surface.text.gray.muted">
                {weekday}
              </Text>
            </BaseBox>
          ))}
        </BaseBox>
        {weeks.map((week, weekIndex) => (
          <BaseBox key={weekIndex} display="flex" flexDirection="row">
            {week.map((cell) => {
              const controlProps = getDayProps(new Date(cell.dateTime));

              // Web parity: the "today" cell keeps the DEFAULT number color at rest and
              // only shows the small blue dot beneath (the primary color is applied to the
              // number on :hover, which native has no equivalent of). So `isToday` is
              // intentionally NOT a text-color branch here — see `TodayDot` for the dot.
              let textColor: string = DAY_COLORS.default;
              if (cell.isDisabled) {
                textColor = DAY_COLORS.disabled;
              } else if (controlProps.selected) {
                textColor = DAY_COLORS.onSelected;
              } else if (cell.isOutside) {
                textColor = DAY_COLORS.outside;
              }

              return (
                <DayGridCell
                  key={cell.dateTime}
                  dateTime={cell.dateTime}
                  dayLabel={cell.dayLabel}
                  accessibilityLabel={cell.accessibilityLabel}
                  textColor={textColor}
                  isSelected={controlProps.selected}
                  isInRange={controlProps.inRange}
                  isFirstInRange={controlProps.firstInRange}
                  isLastInRange={controlProps.lastInRange}
                  isDisabled={cell.isDisabled}
                  isToday={cell.isToday}
                  onDayPress={handleDayPress}
                />
              );
            })}
          </BaseBox>
        ))}
      </BaseBox>
    );
  };

  const renderMonthGrid = (): React.ReactElement => {
    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs(currentDate).month(i).startOf('month'),
    );

    return (
      <BaseBox display="flex" flexDirection="row" flexWrap="wrap">
        {months.map((month) => {
          const dateObj = month.toDate();
          const controlProps = getMonthControlProps(dateObj);
          const isDisabled =
            (minDate && month.endOf('month').isBefore(dayjs(minDate), 'day')) ||
            (maxDate && month.startOf('month').isAfter(dayjs(maxDate), 'day')) ||
            false;

          return (
            <ListCell
              key={month.format('YYYY-MM')}
              isSelected={controlProps.selected}
              isDisabled={isDisabled}
              disabled={isDisabled}
              accessibilityLabel={month.locale(locale).format('MMMM YYYY')}
              onPress={() => {
                if (isDisabled) return;
                onMonthSelect?.(dateObj);
                setLevel(() => 'month');
              }}
            >
              <Text
                size="medium"
                weight="medium"
                color={(isDisabled ? DAY_COLORS.disabled : DAY_COLORS.default) as never}
              >
                {month.locale(locale).format('MMM')}
              </Text>
            </ListCell>
          );
        })}
      </BaseBox>
    );
  };

  const renderYearGrid = (): React.ReactElement => {
    const startYearOfDecade = Math.floor(dayjs(currentDate).year() / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) =>
      dayjs(currentDate)
        .year(startYearOfDecade - 1 + i)
        .startOf('year'),
    );

    return (
      <BaseBox display="flex" flexDirection="row" flexWrap="wrap">
        {years.map((year) => {
          const dateObj = year.toDate();
          const controlProps = getYearControlProps(dateObj);
          const isDisabled =
            (minDate && year.endOf('year').isBefore(dayjs(minDate), 'day')) ||
            (maxDate && year.startOf('year').isAfter(dayjs(maxDate), 'day')) ||
            false;

          return (
            <ListCell
              key={year.format('YYYY')}
              isSelected={controlProps.selected}
              isDisabled={isDisabled}
              disabled={isDisabled}
              accessibilityLabel={year.format('YYYY')}
              onPress={() => {
                if (isDisabled) return;
                onYearSelect?.(dateObj);
                setLevel(() => 'year');
              }}
            >
              <Text
                size="medium"
                weight="medium"
                color={(isDisabled ? DAY_COLORS.disabled : DAY_COLORS.default) as never}
              >
                {year.format('YYYY')}
              </Text>
            </ListCell>
          );
        })}
      </BaseBox>
    );
  };

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      gap="spacing.7"
      {...metaAttribute({ name: MetaConstants.Calendar })}
    >
      <CalendarHeader
        date={currentDate}
        onLevelChange={(newLevel) => setLevel(() => newLevel as CalendarLevel)}
        pickerType={currentPicker}
        onNextMonth={() => navigate('month', 1, 'month')}
        onPreviousMonth={() => navigate('month', -1, 'month')}
        onNextYear={() => navigate('year', 1, 'year')}
        onPreviousYear={() => navigate('year', -1, 'year')}
        onNextDecade={() => navigate('year', 10, 'decade')}
        onPreviousDecade={() => navigate('year', -10, 'decade')}
        showLevelChangeLink={showLevelChangeLink}
      />
      {currentPicker === 'day' && renderDayGrid()}
      {currentPicker === 'month' && renderMonthGrid()}
      {currentPicker === 'year' && renderYearGrid()}
    </BaseBox>
  );
};

export { Calendar };
export type { CalendarNativeProps, ControlProps };
