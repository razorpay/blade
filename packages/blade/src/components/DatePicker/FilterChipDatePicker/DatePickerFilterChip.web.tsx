import { forwardRef } from 'react';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerFilterChipProps } from '../types';
import { getFormattedDate } from '../utils';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import type { BladeElementRef } from '~utils/types';

const _DatePickerFilterChip: React.ForwardRefRenderFunction<
  BladeElementRef,
  DatePickerFilterChipProps
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
  const dateValue = getFormattedDate({
    date,
    format,
    labelSeparator: '-',
    locale,
    type: 'default',
  });

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
