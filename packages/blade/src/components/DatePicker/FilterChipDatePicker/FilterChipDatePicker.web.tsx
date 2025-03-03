import type { FilterChipDatePickerProps } from '../types';
import { DatePickerContainer } from '../DatePickerContainer.web';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  return <DatePickerContainer {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
