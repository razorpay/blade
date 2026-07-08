import type { FilterChipDatePickerProps } from '../types';
import { BaseDatePicker } from '../BaseDatePicker.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  // Default to no footer: treat range/preset selection as confirmation.
  // Callers can pass showFooterActions={true} to opt back into Apply/Cancel.
  return <BaseDatePicker showFooterActions={false} {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
