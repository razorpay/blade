import React from 'react';
import type { DatePickerProps, DateSelectionType } from './types';
import { DatePickerContainer } from './DatePickerContainer.web';

const DatePicker = <Type extends DateSelectionType = 'single'>(
  props: DatePickerProps<Type>,
): React.ReactElement => {
  return <DatePickerContainer {...props} inputElementType="datePickerInput" />;
};

export { DatePicker };
