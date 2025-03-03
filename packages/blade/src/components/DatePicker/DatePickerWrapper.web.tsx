/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { DatePickerProps, DateSelectionType } from './types';
import { DatePicker } from './DatePicker.web';

const DatePickerWrapper = <Type extends DateSelectionType = 'single'>(
  props: DatePickerProps<Type>,
) => {
  return <DatePicker {...props} inputElementType="datePickerInput" />;
};

export { DatePickerWrapper as DatePicker };
