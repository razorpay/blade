import React from 'react';
import type { TimePickerProps } from './types';
import { BaseTimePicker } from './BaseTimePicker.web';

/**
 * TimePicker component for time selection
 *
 * Currently supports 12-hour format only. 24-hour format support
 * will be added in a future release once we upgrade to Mantine v8.
 * Features configurable minute steps and responsive mobile/desktop layouts.
 *
 * @example Basic Usage
 * ```jsx
 * <TimePicker
 *   label="Meeting time"
 *   value={selectedTime}
 *   onChange={({ value }) => setSelectedTime(value)}
 * />
 * ```
 *
 * @example With Custom Step
 * ```jsx
 * <TimePicker
 *   label="Appointment"
 *   minuteStep={15}
 *   showFooterActions={true}
 *   onApply={({ value }) => handleConfirm(value)}
 * />
 * ```
 */
const TimePicker = (props: TimePickerProps): React.ReactElement => {
  return <BaseTimePicker {...props} />;
};

export { TimePicker };
