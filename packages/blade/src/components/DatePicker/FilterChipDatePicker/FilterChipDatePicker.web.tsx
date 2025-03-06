import type { FilterChipDatePickerProps } from '../types';
import { BaseDatePicker } from '../BaseDatePicker.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  return <BaseDatePicker {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
