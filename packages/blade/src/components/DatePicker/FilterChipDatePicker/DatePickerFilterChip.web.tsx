import { forwardRef } from 'react';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerFilterChipProps } from '../types';
import { getFormattedDate, getHumanizedDate } from '../utils';
import { useDatePickerContext } from '../DatePickerContext';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import type { BladeElementRef } from '~utils/types';

const formatDateRange = (
  date: Date | [Date, Date],
  format: string,
  locale: string,
  selectionType: 'single' | 'range',
): string => {
  const formatOptions = {
    date,
    format,
    labelSeparator: '-',
    locale,
    type: 'default' as const,
  };

  if (selectionType === 'single' && date instanceof Date) {
    return getFormattedDate(formatOptions);
  }

  if (Array.isArray(date)) {
    const [startDate, endDate] = date;
    if (startDate) {
      return `${getFormattedDate({ ...formatOptions, date: startDate })}  ${
        endDate ? ' - ' : ''
      } ${getFormattedDate({
        ...formatOptions,
        date: endDate,
      })}`;
    }
  }
  return '';
};

const _DatePickerFilterChip: React.ForwardRefRenderFunction<
  BladeElementRef,
  DatePickerFilterChipProps & {
    onClearButtonChange: (value: string) => void;
  }
> = (
  {
    ...props
  }: DatePickerFilterChipProps & {
    onClearButtonChange: (value: string) => void;
  },
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const {
    referenceProps,
    label,
    selectionType,
    onClearButtonChange,
    accessibilityLabel,
    date,
    format,
    isDisabled,
    selectedPresetLabel,
  } = props;
  const { locale } = useDatesContext();
  const displayFormat = useDatePickerContext()?.displayFormat ?? 'default';

  // Check if there's actually a valid date selection.
  // In range mode both dates need to be present.
  const hasValidSelection =
    selectionType === 'range'
      ? Boolean((date as [Date | null, Date | null])?.[0]) &&
        Boolean((date as [Date | null, Date | null])?.[1])
      : Boolean(date);

  // When displayFormat is 'compact' and a defined preset (e.g. "Last 7 days") is selected,
  // show the preset label inside the chip instead of the actual date range.
  // For custom range selections there is no preset label, so we fall back to the date range.
  const shouldShowPresetLabel =
    displayFormat === 'compact' && Boolean(selectedPresetLabel) && hasValidSelection;

  let dateValue: string;
  if (shouldShowPresetLabel) {
    // A defined preset (e.g. "Past 7 days") is selected → show its label.
    dateValue = selectedPresetLabel as string;
  } else if (displayFormat === 'compact' && format === 'DD/MM/YYYY') {
    // Compact mode with a custom/date selection on the day picker → humanised date range.
    // Month/year pickers keep their own format (e.g. MMM/YYYY) which is already readable.
    dateValue = getHumanizedDate({ date, locale, selectionType });
  } else {
    // Default → show the date range using the configured format (e.g. DD/MM/YYYY).
    dateValue = formatDateRange(date, format, locale, selectionType);
  }

  return (
    <BaseFilterChip
      ref={ref}
      label={label}
      value={dateValue}
      onClearButtonClick={onClearButtonChange}
      accessibilityProps={{
        label: accessibilityLabel ?? label,
        hasPopup: referenceProps['aria-haspopup'],
        expanded: referenceProps['aria-expanded'],
        controls: referenceProps['aria-controls'],
        role: 'combobox',
      }}
      isDisabled={isDisabled}
      {...referenceProps}
    />
  );
};

const DatePickerFilterChip = forwardRef(_DatePickerFilterChip);

export { DatePickerFilterChip };
