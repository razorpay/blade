import type { FilterChipDatePickerProps } from '../types';
import { DatePicker } from '../DatePicker.web';
import { DatePickerFilterChip } from './DatePickerFilterChip.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  console.log('FilterChipDatePicker', props);
  return <DatePicker {...props} inputElement={<DatePickerFilterChip />} />;
};

export { FilterChipDatePicker };
