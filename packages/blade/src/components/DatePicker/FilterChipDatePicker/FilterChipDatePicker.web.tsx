import type { FilterChipDatePickerProps } from '../types';
import { BaseDatePicker } from '../BaseDatePicker.web';

const FilterChipDatePicker = ({
  showFooterActions = false,
  ...props
}: FilterChipDatePickerProps): React.ReactElement => {
  return <BaseDatePicker {...props} showFooterActions={showFooterActions} inputElementType="chip" />;
};

export { FilterChipDatePicker };
