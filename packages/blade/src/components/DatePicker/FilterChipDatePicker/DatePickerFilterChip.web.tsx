import { forwardRef } from 'react';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerFilterChipProps } from '../types';
import { getFormattedDate } from '../utils';
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
  console.log('DatePickerFilterChip', props);
  const {
    referenceProps,
    label,
    selectionType,
    onClearButtonChange,
    accessibilityLabel,
    date,
    format,
  } = props;
  const { locale } = useDatesContext();

  const dateValue = formatDateRange(date, format, locale, selectionType);

  return (
    <BaseFilterChip
      ref={ref}
      label={label}
      value={dateValue}
      onClearButtonClick={onClearButtonChange}
      //   selectionType={selectionType}
      //   id="start-date"
      accessibilityProps={{
        label: accessibilityLabel ?? label,
        hasPopup: referenceProps['aria-haspopup'],
        expanded: referenceProps['aria-expanded'],
        controls: referenceProps['aria-controls'],
        role: 'combobox',
        // controls: `${dropdownBaseId}-actionlist`,
        // activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      }}
      {...referenceProps}
    />
  );
};

const DatePickerFilterChip = forwardRef(_DatePickerFilterChip);

export { DatePickerFilterChip };
