import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import dayjs from 'dayjs';
import localeDataPlugin from 'dayjs/plugin/localeData';
import { useI18nContext } from '@razorpay/i18nify-react';
import type { DatePickerProps, DateSelectionType, DatesRangeValue, DateValue } from './types';
import { convertIntlToDayjsLocale } from './utils';
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
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '~components/Icons';
import getIn from '~utils/lodashButBetter/get';
import { useControllableState } from '~utils/useControllable';
import { logger } from '~utils/logger';

dayjs.extend(localeDataPlugin);

type Preset = {
  label: string;
  value: (date: Date) => DatesRangeValue;
};
type AnyValue = DateValue | DatesRangeValue;

// Read the dayjs locale name from i18nify if a provider is mounted; otherwise
// fall back to whatever dayjs's global default is. The mapping matches the
// web DatePicker's `convertIntlToDayjsLocale` so behaviour is consistent
// across targets.
const useDayjsLocale = (): string => {
  // useI18nContext is provided by @razorpay/i18nify-react; if the consumer
  // hasn't mounted an I18nProvider, the hook still returns a shape with
  // `i18nState`, just without a locale set.
  const i18n = useI18nContext();
  return useMemo(
    () => convertIntlToDayjsLocale(i18n?.i18nState?.locale ?? 'en-IN'),
    [i18n?.i18nState?.locale],
  );
};

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

const dayHeaders = (firstDayOfWeek: number, localeName: string): string[] => {
  // Use the host's i18nify locale where available; falls back to English if
  // the corresponding dayjs locale file hasn't been imported by the host
  // (`import 'dayjs/locale/hi'` etc. at app boot).
  const labels = dayjs().locale(localeName).localeData().weekdaysShort();
  return [...labels.slice(firstDayOfWeek), ...labels.slice(0, firstDayOfWeek)];
};

const formatDateValue = (
  value: AnyValue | undefined,
  selectionType: DateSelectionType | undefined,
  format: string,
  localeName: string,
): string => {
  const fmt = (d: Date): string => dayjs(d).locale(localeName).format(format);
  if (isRange(selectionType)) {
    const [s, e] = toRange(value);
    if (!s && !e) return '';
    if (s && e) return `${fmt(s)} – ${fmt(e)}`;
    if (s) return fmt(s);
    return fmt(e!);
  }
  const single = toSingle(value);
  return single ? fmt(single) : '';
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
  localeName: string;
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
  localeName,
}: CalendarProps): React.ReactElement => {
  const { theme } = useTheme();
  const grid = useMemo(
    () => buildMonthGrid(visibleMonth, firstDayOfWeek),
    [visibleMonth, firstDayOfWeek],
  );
  const [start, end] = isRange(selectionType) ? toRange(value) : [toSingle(value), null];
  const fmt = (d: Date | dayjs.Dayjs, pattern: string): string =>
    dayjs(d).locale(localeName).format(pattern);

  const isDisabled = (d: Date): boolean => {
    if (minDate && dayjs(d).isBefore(dayjs(minDate), 'day')) return true;
    if (maxDate && dayjs(d).isAfter(dayjs(maxDate), 'day')) return true;
    if (excludeDate?.(d)) return true;
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

  const monthLabel = fmt(visibleMonth, 'MMMM YYYY');
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={goPrev}
          hitSlop={8}
        >
          <Box
            paddingX="spacing.3"
            paddingY="spacing.2"
            borderRadius="medium"
            backgroundColor="surface.background.gray.subtle"
          >
            <ChevronLeftIcon size="medium" color="surface.icon.gray.normal" />
          </Box>
        </Pressable>
        <Text size="medium" weight="semibold">
          {monthLabel}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={goNext}
          hitSlop={8}
        >
          <Box
            paddingX="spacing.3"
            paddingY="spacing.2"
            borderRadius="medium"
            backgroundColor="surface.background.gray.subtle"
          >
            <ChevronRightIcon size="medium" color="surface.icon.gray.normal" />
          </Box>
        </Pressable>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="space-around" paddingY="spacing.2">
        {dayHeaders(firstDayOfWeek, localeName).map((label) => (
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
              const baseLabel = fmt(day, 'DD MMM YYYY');
              const stateSuffix = selectedStart
                ? ', selected start of range'
                : selectedEnd
                  ? ', selected end of range'
                  : isSelected
                    ? ', selected'
                    : inRange
                      ? ', in selected range'
                      : '';
              return (
                <Pressable
                  key={day.toISOString()}
                  onPress={() => onDayPress(day)}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={`${baseLabel}${stateSuffix}`}
                  accessibilityState={{ selected: isSelected, disabled }}
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
                      {fmt(day, 'D')}
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

type NativeLabelProps = {
  /**
   * Native-only. Title shown in the BottomSheet header. Defaults to
   * "Select Date Range" / "Select Date" based on `selectionType`.
   */
  headerLabel?: string;
  /**
   * Native-only. Label for the apply button in the BottomSheet footer.
   * @default 'Apply'
   */
  applyLabel?: string;
  /**
   * Native-only. Label for the cancel button in the BottomSheet footer.
   * @default 'Cancel'
   */
  cancelLabel?: string;
  /**
   * Native-only. Heading shown above the preset chips.
   * @default 'Quick Select'
   */
  quickSelectLabel?: string;
  /**
   * Native-only. Accessibility label for the clear icon button.
   * @default 'Clear date'
   */
  clearAccessibilityLabel?: string;
};

type DatePickerNativeProps<Type extends DateSelectionType> = DatePickerProps<Type> &
  NativeLabelProps;

function _DatePicker<Type extends DateSelectionType = 'single'>(
  props: DatePickerNativeProps<Type>,
): React.ReactElement {
  const { theme } = useTheme();
  const localeName = useDayjsLocale();
  // Collapse the Type generic to its union at the destructure boundary.
  // Re-narrowing at the apply/onChange callsites preserves the public
  // signature for consumers while keeping the internal body type-safe.
  const {
    selectionType = 'single' as DateSelectionType,
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
    headerLabel,
    applyLabel = 'Apply',
    cancelLabel = 'Cancel',
    quickSelectLabel = 'Quick Select',
    clearAccessibilityLabel = 'Clear date',
    validationState = 'none',
    helpText,
    errorText,
    successText,
    isRequired,
    necessityIndicator = 'none',
    labelPosition = 'top',
    // Web-only props we don't yet implement on native — surfaced to the DEV
    // warning below.
    picker,
    defaultPicker,
    onPickerChange,
    visibleMonth: visibleMonthProp,
    defaultVisibleMonth,
    onVisibleMonthChange,
  } = props as DatePickerNativeProps<DateSelectionType> & {
    picker?: unknown;
    defaultPicker?: unknown;
    onPickerChange?: unknown;
    visibleMonth?: unknown;
    defaultVisibleMonth?: unknown;
    onVisibleMonthChange?: unknown;
    successText?: unknown;
  };

  useEffect(() => {
    if (!__DEV__) return;
    const unsupported: string[] = [];
    if (picker !== undefined) unsupported.push('picker');
    if (defaultPicker !== undefined) unsupported.push('defaultPicker');
    if (onPickerChange !== undefined) unsupported.push('onPickerChange');
    if (visibleMonthProp !== undefined) unsupported.push('visibleMonth');
    if (defaultVisibleMonth !== undefined) unsupported.push('defaultVisibleMonth');
    if (onVisibleMonthChange !== undefined) unsupported.push('onVisibleMonthChange');
    if (unsupported.length > 0) {
      logger({
        type: 'warn',
        moduleName: 'DatePicker',
        message: `The following props are not yet supported on native and will be ignored: ${unsupported.join(
          ', ',
        )}.`,
      });
    }
  }, [
    picker,
    defaultPicker,
    onPickerChange,
    visibleMonthProp,
    defaultVisibleMonth,
    onVisibleMonthChange,
  ]);

  const isError = validationState === 'error';
  const isSuccess = validationState === 'success';

  const helperRenderText = isError
    ? (errorText as string | undefined)
    : isSuccess
      ? (successText as string | undefined)
      : (helpText as string | undefined);
  const helperRenderColor:
    | 'feedback.text.negative.intense'
    | 'feedback.text.positive.intense'
    | 'surface.text.gray.muted' = isError
    ? 'feedback.text.negative.intense'
    : isSuccess
      ? 'feedback.text.positive.intense'
      : 'surface.text.gray.muted';

  // Validation state communicates through the helper text colour below the
  // trigger. The native trigger keeps the standard `surface.border.gray.muted`
  // outline so consumers writing platform-agnostic code get a consistent
  // outline. Colour-bordered validation states are tracked as a follow-up.

  const necessitySuffix =
    isRequired && necessityIndicator === 'required'
      ? '*'
      : isRequired && necessityIndicator === 'optional'
        ? ' (optional)'
        : '';

  const [innerValue, setInnerValue] = useControllableState<AnyValue>({
    value: value as AnyValue,
    defaultValue: (defaultValue ?? (selectionType === 'range' ? [null, null] : null)) as AnyValue,
    onChange: onChange as ((value: AnyValue) => void) | undefined,
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
    const formatted = formatDateValue(innerValue, selectionType, format, localeName);
    return (
      formatted ??
      inputPlaceHolder ??
      (selectionType === 'range' ? 'Select date range' : 'Select date')
    );
  }, [
    displayFormat,
    selectedPresetLabel,
    innerValue,
    selectionType,
    format,
    inputPlaceHolder,
    localeName,
  ]);

  const open = (): void => {
    setDraft(innerValue ?? (selectionType === 'range' ? [null, null] : null));
    setVisibleMonth(initialAnchor);
    setOpenInternal(() => true);
  };

  const close = (): void => setOpenInternal(() => false);

  const apply = (): void => {
    setInnerValue(() => draft);
    (onApply as ((value: AnyValue) => void) | undefined)?.(draft);
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

  const applyPreset = (preset: Preset): void => {
    const next = preset.value(new Date());
    setDraft(next);
    setSelectedPresetLabel(preset.label);
  };

  const isApplyEnabled = useMemo(() => {
    if (selectionType === 'range') {
      const [s, e] = toRange(draft);
      return Boolean(s && e);
    }
    return Boolean(toSingle(draft));
  }, [draft, selectionType]);

  // For range mode, `innerValue` is the tuple `[null, null]` when nothing is
  // selected — an array is truthy, so the previous `innerValue ?` check would
  // light up the clear button against an empty range.
  const hasValue = useMemo(() => {
    if (selectionType === 'range') {
      const [s, e] = toRange(innerValue);
      return Boolean(s ?? e);
    }
    return Boolean(toSingle(innerValue));
  }, [innerValue, selectionType]);

  const labelNode = labelText ? (
    <Text size="small" color="surface.text.gray.muted">
      {`${labelText}${necessitySuffix}`}
    </Text>
  ) : null;

  const triggerNode = (
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
          color={hasValue ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}
        >
          {triggerText}
        </Text>
        {showClearButton && hasValue ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={clearAccessibilityLabel}
            onPress={clear}
            hitSlop={8}
          >
            <CloseIcon size="small" color="surface.icon.gray.muted" />
          </Pressable>
        ) : null}
      </Box>
    </Pressable>
  );

  return (
    <Box width="100%">
      {labelPosition === 'left' && labelNode ? (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box paddingRight="spacing.3">{labelNode}</Box>
          <Box flex={1}>{triggerNode}</Box>
        </Box>
      ) : (
        <>
          {labelNode ? <Box paddingBottom="spacing.2">{labelNode}</Box> : null}
          {triggerNode}
        </>
      )}

      {helperRenderText ? (
        <Box paddingTop="spacing.2">
          <Text size="small" color={helperRenderColor}>
            {helperRenderText}
          </Text>
        </Box>
      ) : null}

      <BottomSheet isOpen={openInternal} onDismiss={close}>
        <BottomSheetHeader
          title={headerLabel ?? (selectionType === 'range' ? 'Select Date Range' : 'Select Date')}
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
              localeName={localeName}
            />

            {presets && presets.length > 0 ? (
              <Box paddingTop="spacing.5">
                <Text size="small" weight="semibold" color="surface.text.gray.muted">
                  {quickSelectLabel}
                </Text>
                <Box display="flex" flexDirection="row" flexWrap="wrap" paddingTop="spacing.3">
                  {(presets as Preset[]).map((preset) => {
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
                  {cancelLabel}
                </Button>
              </Box>
              <Box flex={1}>
                <Button isFullWidth isDisabled={!isApplyEnabled} onClick={apply}>
                  {applyLabel}
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
 * #### UX deviation from web
 *
 * The native calendar opens inside a `BottomSheet` rather than the floating
 * popover used on the web target. Tablets and large-screen devices therefore
 * see a full-width sheet, not an anchored popover.
 *
 * #### Supported props (native MVP)
 *
 * `single` / `range` selection, presets, min/max date, `excludeDate`,
 * controlled/uncontrolled value, controlled/uncontrolled open state, custom
 * footer slot, clear button, and the `compact` / `default` `displayFormat`.
 *
 * #### Not yet supported on native
 *
 * Month/year picker variants (`picker`, `defaultPicker`, `onPickerChange`),
 * `visibleMonth`/`defaultVisibleMonth`/`onVisibleMonthChange`, masked text
 * input, and the form-validation props (`validationState`, `helpText`,
 * `errorText`, `isRequired`, `necessityIndicator`, `labelPosition`). Passing
 * any of these emits a `__DEV__` warning and they are otherwise ignored at
 * runtime.
 *
 * #### Localisation
 *
 * Weekday and month names follow whatever locale the host has loaded into
 * dayjs (`import 'dayjs/locale/hi'` at app boot etc.). Day-picker UI labels
 * (`headerLabel`, `applyLabel`, `cancelLabel`, `quickSelectLabel`,
 * `clearAccessibilityLabel`) accept overrides — pass strings from your
 * i18n source.
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
