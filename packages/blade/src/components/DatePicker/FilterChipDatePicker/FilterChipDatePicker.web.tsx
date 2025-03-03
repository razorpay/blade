import type { FilterChipDatePickerProps } from '../types';
import { DatePicker } from '../DatePicker.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  console.log('FilterChipDatePicker', props);
  return <DatePicker {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
