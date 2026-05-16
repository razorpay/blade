import React from 'react';
import { BaseTimePicker } from './BaseTimePicker.web';

import type { TimePickerProps } from './types';

const TimePicker = (props: TimePickerProps): React.ReactElement => {
  return <BaseTimePicker {...props} />;
};

export { TimePicker };
