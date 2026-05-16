import React from 'react';
import { BaseDatePicker } from './BaseDatePicker.web';

import type { DatePickerProps, DateSelectionType } from './types';

const DatePicker = <Type extends DateSelectionType = 'single'>(
  props: DatePickerProps<Type>,
): React.ReactElement => {
  return <BaseDatePicker {...props} inputElementType="datePickerInput" />;
};

export { DatePicker };
