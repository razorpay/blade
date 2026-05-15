import { BaseDatePicker } from '../BaseDatePicker.web';

import type { FilterChipDatePickerProps } from '../types';

const FilterChipDatePicker = (props: FilterChipDatePickerProps): React.ReactElement => {
  return <BaseDatePicker {...props} inputElementType="chip" />;
};

export { FilterChipDatePicker };
