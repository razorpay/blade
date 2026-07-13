import { forwardRef } from 'react';
import { useI18nContext } from '@razorpay/i18nify-react';
import type { DatePickerFilterChipProps } from '../types';
import { getFormattedDate, getHumanizedDate, convertIntlToDayjsLocale } from '../utils';
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
  const { i18nState } = useI18nContext();
  const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');
  const displayFormat = useDatePickerContext()?.displayFormat ?? 'default';

  const hasValidSelection =
    selectionType === 'range'
      ? Boolean((date as [Date | null, Date | null])?.[0]) &&
        Boolean((date as [Date | null, Date | null])?.[1])
      : Boolean(date);

  const shouldShowPresetLabel =
    displayFormat === 'compact' && Boolean(selectedPresetLabel) && hasValidSelection;

  let dateValue: string;
  if (shouldShowPresetLabel) {
    dateValue = selectedPresetLabel as string;
  } else if (displayFormat === 'compact' && format === 'DD/MM/YYYY') {
    dateValue = getHumanizedDate({ date, locale, selectionType });
  } else {
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
        hasPopup: referenceProps?.['aria-haspopup'],
        expanded: referenceProps?.['aria-expanded'],
        controls: referenceProps?.['aria-controls'],
        role: 'combobox',
      }}
      isDisabled={isDisabled}
      {...referenceProps}
    />
  );
};

const DatePickerFilterChip = forwardRef(_DatePickerFilterChip);

export { DatePickerFilterChip };
