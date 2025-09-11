import React from 'react';
import type { TimePickerProps } from './types';
import { BaseTimePicker } from './BaseTimePicker.web';

const TimePicker = (props: TimePickerProps): React.ReactElement => {
  return <BaseTimePicker {...props} />;
};

export { TimePicker };
