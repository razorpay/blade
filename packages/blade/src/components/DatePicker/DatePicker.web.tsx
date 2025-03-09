import React from 'react';
import type { DatePickerProps, DateSelectionType } from './types';
import { BaseDatePicker } from './BaseDatePicker.web';

const DatePicker = <Type extends DateSelectionType = 'single'>(
  props: DatePickerProps<Type>,
): React.ReactElement => {
  return <BaseDatePicker {...props} inputElementType="datePickerInput" />;
};

export { DatePicker };
