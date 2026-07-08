import type { FilterChipDatePickerProps } from '../types';
import { BaseDatePicker } from '../BaseDatePicker.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  return <BaseDatePicker {...props} showFooterActions={false} inputElementType="chip" />;
};

export { FilterChipDatePicker };
