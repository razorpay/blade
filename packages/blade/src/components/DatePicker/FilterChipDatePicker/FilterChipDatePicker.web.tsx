import { FilterChipDatePicker } from '../types';
import { DatePickerContainer } from '../DatePickerContainer.web';

const FilterChipDatePicker = (props: FilterChipDatePicker): React.ReactElement => {
  return <DatePickerContainer {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
