import type { FilterChipDatePickerProps } from '../types';
import { BaseDatePicker } from '../BaseDatePicker.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  // Default to no footer actions: treat range/preset selection itself as confirmation
  return <BaseDatePicker showFooterActions={false} {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
