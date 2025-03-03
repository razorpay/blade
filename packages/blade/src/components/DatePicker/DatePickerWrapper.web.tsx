import React from 'react';
import type { DatePickerProps, DateSelectionType } from './types';
import { DatePicker } from './DatePicker.web';

const DatePickerWrapper = <Type extends DateSelectionType = 'single'>(
  props: DatePickerProps<Type>,
): React.ReactElement => {
  return <DatePicker {...props} inputElementType="datePickerInput" />;
};

export { DatePickerWrapper as DatePicker };
