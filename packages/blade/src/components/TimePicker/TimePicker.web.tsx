import React from 'react';
import type { TimePickerProps } from './types';
import { BaseTimePicker } from './BaseTimePicker.web';

const TimePicker = (props: TimePickerProps): React.ReactElement => {
  console.log('[TimePicker] rendered with props:', props);
  return <BaseTimePicker {...props} />;
};

export { TimePicker };
