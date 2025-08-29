import { default as React } from 'react';
import { DatePickerProps, DateSelectionType } from './types';
declare const DatePicker: <Type extends DateSelectionType = "single">(props: DatePickerProps<Type>) => React.ReactElement;
export { DatePicker };
