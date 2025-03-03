import { forwardRef } from 'react';
import type { DatePickerFilterChipProps } from '../types';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import type { BladeElementRef } from '~utils/types';

const _DatePickerFilterChip: React.ForwardRefRenderFunction<
  BladeElementRef,
  DatePickerFilterChipProps
> = (
  { ...props }: DatePickerFilterChipProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  console.log('DatePickerFilterChip', props);
  const { referenceProps, label, selectionType, accessibilityLabel } = props;
  return (
    <BaseFilterChip
      ref={ref}
      label={label}
      selectionType={selectionType}
      id="start-date"
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
