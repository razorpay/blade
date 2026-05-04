/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import dayjs from 'dayjs';
import type { DatePickerProps, DateSelectionType } from './types';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import { useControllableState } from '~utils/useControllable';

type DatesRangeValue = [Date | null, Date | null];
type DateValue = Date | null;
type AnyValue = DateValue | DatesRangeValue;

const DEFAULT_FIRST_DAY = 1; // Monday
const FORMAT_DEFAULT = 'DD MMM YYYY';

const isRange = (selectionType: DateSelectionType | undefined): boolean =>
  selectionType === 'range';

const toRange = (v: AnyValue | undefined): DatesRangeValue => {
  if (Array.isArray(v)) return [v[0] ?? null, v[1] ?? null];
  return [null, null];
};

const toSingle = (v: AnyValue | undefined): DateValue => {
  if (v instanceof Date) return v;
  return null;
};

const sameDay = (a: Date | null, b: Date | null): boolean => {
  if (!a || !b) return false;
  return dayjs(a).isSame(dayjs(b), 'day');
};

const isBetween = (d: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const x = dayjs(d);
  return x.isAfter(dayjs(start), 'day') && x.isBefore(dayjs(end), 'day');
};

const startOfMonth = (d: Date): Date => dayjs(d).startOf('month').toDate();

const buildMonthGrid = (anchor: Date, firstDayOfWeek: number): Date[][] => {
  const start = dayjs(anchor).startOf('month');
  const end = dayjs(anchor).endOf('month');
  const startOffset = (start.day() - firstDayOfWeek + 7) % 7;
  const cells: Date[][] = [];
  let row: Date[] = [];
  let cursor = start.subtract(startOffset, 'day');
  while (cursor.isBefore(end) || cursor.isSame(end, 'day') || row.length > 0) {
    row.push(cursor.toDate());
    if (row.length === 7) {
      cells.push(row);
      row = [];
      if (cursor.isAfter(end, 'day')) break;
    }
    cursor = cursor.add(1, 'day');
  }
  return cells;
};

const dayHeaders = (firstDayOfWeek: number): string[] => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return [...labels.slice(firstDayOfWeek), ...labels.slice(0, firstDayOfWeek)];
};

const formatDateValue = (
  value: AnyValue | undefined,
  selectionType: DateSelectionType | undefined,
  format: string,
): string => {
  if (isRange(selectionType)) {
    const [s, e] = toRange(value);
    if (!s && !e) return '';
    if (s && e) return `${dayjs(s).format(format)} – ${dayjs(e).format(format)}`;
    if (s) return dayjs(s).format(format);
    return dayjs(e!).format(format);
  }
  const single = toSingle(value);
  return single ? dayjs(single).format(format) : '';
};

type CalendarProps = {
  selectionType: DateSelectionType;
  value: AnyValue;
  onValueChange: (next: AnyValue) => void;
  visibleMonth: Date;
  onVisibleMonthChange: (next: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  excludeDate?: (date: Date) => boolean;
  firstDayOfWeek: number;
};

const Calendar = ({
  selectionType,
  value,
  onValueChange,
  visibleMonth,
  onVisibleMonthChange,
  minDate,
  maxDate,
  excludeDate,
  firstDayOfWeek,
}: CalendarProps): React.ReactElement => {
  const { theme } = useTheme();
  const grid = useMemo(() => buildMonthGrid(visibleMonth, firstDayOfWeek), [
    visibleMonth,
    firstDayOfWeek,
  ]);
  const [start, end] = isRange(selectionType) ? toRange(value) : [toSingle(value), null];

  const isDisabled = (d: Date): boolean => {
    if (minDate && dayjs(d).isBefore(dayjs(minDate), 'day')) return true;
    if (maxDate && dayjs(d).isAfter(dayjs(maxDate), 'day')) return true;
    if (excludeDate && excludeDate(d)) return true;
    return false;
  };

  const onDayPress = (d: Date): void => {
    if (isDisabled(d)) return;
    if (!isRange(selectionType)) {
      onValueChange(d);
      return;
    }
    if (!start || (start && end)) {
      onValueChange([d, null]);
      return;
    }
    if (dayjs(d).isBefore(dayjs(start), 'day')) {
      onValueChange([d, null]);
      return;
    }
    onValueChange([start, d]);
  };

  const monthLabel = dayjs(visibleMonth).format('MMMM YYYY');
  const goPrev = (): void =>
    onVisibleMonthChange(dayjs(visibleMonth).subtract(1, 'month').toDate());
  const goNext = (): void => onVisibleMonthChange(dayjs(visibleMonth).add(1, 'month').toDate());

  const selectedBg = getIn(theme.colors, 'interactive.background.primary.default');
  const inRangeBg = getIn(theme.colors, 'interactive.background.primary.faded');

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingY="spacing.3"
      >
        <Pressable accessibilityRole="button" onPress={goPrev} hitSlop={8}>
          <Box
            paddingX="spacing.3"
            paddingY="spacing.2"
            borderRadius="medium"
            backgroundColor="surface.background.gray.subtle"
          >
            <Text size="medium">‹</Text>
          </Box>
        </Pressable>
        <Text size="medium" weight="semibold">
          {monthLabel}
        </Text>
        <Pressable accessibilityRole="button" onPress={goNext} hitSlop={8}>
          <Box
            paddingX="spacing.3"
            paddingY="spacing.2"
            borderRadius="medium"
            backgroundColor="surface.background.gray.subtle"
          >
            <Text size="medium">›</Text>
          </Box>
        </Pressable>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="space-around" paddingY="spacing.2">
        {dayHeaders(firstDayOfWeek).map((label) => (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <Text size="small" color="surface.text.gray.muted">
              {label}
            </Text>
          </View>
        ))}
      </Box>

      <Box>
        {grid.map((row, rowIdx) => (
          <View
            key={`row-${rowIdx}`}
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}
          >
            {row.map((day) => {
              const sameMonth = dayjs(day).isSame(dayjs(visibleMonth), 'month');
              const disabled = isDisabled(day);
              const selectedStart = sameDay(day, start);
              const selectedEnd = sameDay(day, end);
              const inRange = isBetween(day, start, end);
              const isSelected = selectedStart || selectedEnd;
              const bg = isSelected ? selectedBg : inRange ? inRangeBg : 'transparent';
              const textColorToken = isSelected
                ? 'interactive.text.primary.normal'
                : disabled || !sameMonth
                ? 'surface.text.gray.disabled'
                : 'surface.text.gray.normal';
              return (
                <Pressable
                  key={day.toISOString()}
                  onPress={() => onDayPress(day)}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={dayjs(day).format('DD MMM YYYY')}
                  style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: bg,
                    }}
                  >
                    <Text
                      size="small"
                      color={textColorToken}
                      weight={isSelected ? 'semibold' : 'regular'}
                    >
                      {dayjs(day).format('D')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </Box>
    </Box>
  );
};

type DatePickerInternalProps<Type extends DateSelectionType> = DatePickerProps<Type>;

function _DatePicker<Type extends DateSelectionType = 'single'>(
  props: DatePickerInternalProps<Type>,
): React.ReactElement {
  const { theme } = useTheme();
  const {
    selectionType = 'single' as Type,
    value,
    defaultValue,
    onChange,
    onApply,
    presets,
    minDate,
    maxDate,
    excludeDate,
    firstDayOfWeek = DEFAULT_FIRST_DAY,
    label,
    inputPlaceHolder,
    format = FORMAT_DEFAULT,
    showFooterActions = true,
    footer,
    showClearButton,
    onClearButtonClick,
    isOpen,
    defaultIsOpen,
    onOpenChange,
    isDisabled,
    displayFormat = 'default',
  } = props as any;

  const [innerValue, setInnerValue] = useControllableState<AnyValue>({
    value: value as AnyValue,
    defaultValue: (defaultValue ?? (selectionType === 'range' ? [null, null] : null)) as AnyValue,
    onChange: onChange as any,
  });

  const [draft, setDraft] = useState<AnyValue>(innerValue ?? null);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string | null>(null);

  const [openInternal, setOpenInternal] = useControllableState<boolean>({
    value: isOpen,
    defaultValue: defaultIsOpen ?? false,
    onChange: (next) => onOpenChange?.({ isOpen: next }),
  });

  const initialAnchor = useMemo(() => {
    const ref = (Array.isArray(innerValue) ? innerValue[0] : innerValue) ?? new Date();
    return startOfMonth(ref ?? new Date());
  }, [innerValue]);
  const [visibleMonth, setVisibleMonth] = useState<Date>(initialAnchor);

  const labelText = useMemo(() => {
    if (typeof label === 'string') return label;
    if (label && typeof label === 'object') {
      const start = (label as { start: string; end?: string }).start;
      return start;
    }
    return undefined;
  }, [label]);

  const triggerText = useMemo(() => {
    if (displayFormat === 'compact' && selectedPresetLabel) {
      return selectedPresetLabel;
    }
    const formatted = formatDateValue(innerValue, selectionType, format);
    return (
      formatted ||
      inputPlaceHolder ||
      (selectionType === 'range' ? 'Select date range' : 'Select date')
    );
  }, [displayFormat, selectedPresetLabel, innerValue, selectionType, format, inputPlaceHolder]);

  const open = (): void => {
    setDraft(innerValue ?? (selectionType === 'range' ? [null, null] : null));
    setVisibleMonth(initialAnchor);
    setOpenInternal(() => true);
  };

  const close = (): void => setOpenInternal(() => false);

  const apply = (): void => {
    setInnerValue(() => draft);
    onApply?.(draft as any);
    close();
  };

  const cancel = (): void => {
    setDraft(innerValue ?? (selectionType === 'range' ? [null, null] : null));
    close();
  };

  const clear = (): void => {
    const cleared: AnyValue = selectionType === 'range' ? [null, null] : null;
    setDraft(cleared);
    setInnerValue(() => cleared);
    setSelectedPresetLabel(null);
    onClearButtonClick?.();
  };

  const applyPreset = (preset: { label: string; value: (date: Date) => any }): void => {
    const next = preset.value(new Date());
    setDraft(next as AnyValue);
    setSelectedPresetLabel(preset.label);
  };

  const isApplyEnabled = useMemo(() => {
    if (selectionType === 'range') {
      const [s, e] = toRange(draft);
      return Boolean(s && e);
    }
    return Boolean(toSingle(draft));
  }, [draft, selectionType]);

  return (
    <Box width="100%">
      {labelText ? (
        <Box paddingBottom="spacing.2">
          <Text size="small" color="surface.text.gray.muted">
            {labelText}
          </Text>
        </Box>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={labelText}
        disabled={isDisabled}
        onPress={open}
      >
        <Box
          paddingX="spacing.4"
          paddingY="spacing.4"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          backgroundColor={
            isDisabled ? 'surface.background.gray.subtle' : 'surface.background.gray.intense'
          }
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            size="medium"
            color={
              triggerText && innerValue ? 'surface.text.gray.normal' : 'surface.text.gray.muted'
            }
          >
            {triggerText}
          </Text>
          {showClearButton && innerValue ? (
            <Pressable accessibilityRole="button" onPress={clear} hitSlop={8}>
              <Text size="small" color="surface.text.gray.muted">
                ✕
              </Text>
            </Pressable>
          ) : null}
        </Box>
      </Pressable>

      <BottomSheet isOpen={openInternal} onDismiss={close}>
        <BottomSheetHeader
          title={selectionType === 'range' ? 'Select Date Range' : 'Select Date'}
        />
        <BottomSheetBody>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Calendar
              selectionType={selectionType}
              value={draft}
              onValueChange={(next) => {
                setDraft(next);
                setSelectedPresetLabel(null);
              }}
              visibleMonth={visibleMonth}
              onVisibleMonthChange={setVisibleMonth}
              minDate={minDate}
              maxDate={maxDate}
              excludeDate={excludeDate}
              firstDayOfWeek={firstDayOfWeek}
            />

            {presets && presets.length > 0 ? (
              <Box paddingTop="spacing.5">
                <Text size="small" weight="semibold" color="surface.text.gray.muted">
                  Quick Select
                </Text>
                <Box display="flex" flexDirection="row" flexWrap="wrap" paddingTop="spacing.3">
                  {presets.map((preset: { label: string; value: any }) => {
                    const active = selectedPresetLabel === preset.label;
                    return (
                      <Pressable
                        key={preset.label}
                        accessibilityRole="button"
                        onPress={() => applyPreset(preset)}
                        style={{
                          marginRight: 8,
                          marginBottom: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: active
                            ? getIn(theme.colors, 'interactive.border.primary.default')
                            : getIn(theme.colors, 'surface.border.gray.muted'),
                          backgroundColor: active
                            ? getIn(theme.colors, 'interactive.background.primary.faded')
                            : 'transparent',
                        }}
                      >
                        <Text
                          size="small"
                          color={
                            active ? 'interactive.text.primary.normal' : 'surface.text.gray.normal'
                          }
                        >
                          {preset.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </Box>
              </Box>
            ) : null}

            {footer ? <Box paddingTop="spacing.4">{footer}</Box> : null}
          </ScrollView>
        </BottomSheetBody>
        {showFooterActions ? (
          <BottomSheetFooter>
            <Box display="flex" flexDirection="row">
              <Box flex={1} marginRight="spacing.2">
                <Button variant="secondary" isFullWidth onClick={cancel}>
                  Cancel
                </Button>
              </Box>
              <Box flex={1}>
                <Button isFullWidth isDisabled={!isApplyEnabled} onClick={apply}>
                  Apply
                </Button>
              </Box>
            </Box>
          </BottomSheetFooter>
        ) : null}
      </BottomSheet>
    </Box>
  );
}

/**
 * DatePicker
 *
 * Lets the user pick a single date or a range of dates. On native, the picker
 * renders a tap-to-open trigger; the calendar opens inside a `BottomSheet`.
 *
 * Native MVP supports: `single` and `range` selection, presets, min/max date,
 * controlled/uncontrolled value, controlled/uncontrolled open state, custom
 * footer slot, clear button, and the `compact`/`default` displayFormat. Month
 * and year picker variants, locale customisation, and the masked text input
 * are not yet implemented on native.
 *
 * #### Usage
 *
 * ```tsx
 * <DatePicker
 *   label="Pick date"
 *   selectionType="range"
 *   presets={[
 *     { label: 'Past 7 days', value: () => [dayjs().subtract(7, 'day').toDate(), new Date()] },
 *   ]}
 *   onApply={(value) => console.log(value)}
 * />
 * ```
 */
const DatePicker = _DatePicker;

export { DatePicker };
