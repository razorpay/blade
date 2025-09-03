import React from 'react';
import { Box } from '~components/Box';
import { SpinWheel } from './SpinWheel';
import { TimePickerFooter } from './TimePickerFooter';
import type { TimeFormat, MinuteStep } from './types';

/**
 * Helper function for time conversion
 */
const convertTo24Hour = (hour12: number, period: string): number => {
  if (period === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  } else {
    return hour12 === 12 ? 12 : hour12 + 12;
  }
};

type TimePickerContentProps = {
  selectedTime: Date | null;
  setSelectedTime: (time: Date | null) => void;
  selectedHour: number;
  selectedMinute: number;
  selectedPeriod: string;
  timeFormat: TimeFormat;
  minuteStep: MinuteStep;
  showFooterActions: boolean;
  onApply: () => void;
  onCancel: () => void;
};

/**
 * Content component for TimePicker dropdown
 * Contains the time selection wheels and footer
 */
const TimePickerContent = ({
  selectedTime,
  setSelectedTime,
  selectedHour,
  selectedMinute,
  selectedPeriod,
  timeFormat,
  minuteStep,
  showFooterActions,
  onApply,
  onCancel,
}: TimePickerContentProps): React.ReactElement => {
  // Use values from hook instead of local state
  const currentHour = selectedHour;
  const currentMinute = selectedMinute;
  const currentPeriod = selectedPeriod;

  const is12HourFormat = timeFormat === '12h';

  // Generate values for each wheel
  const hourValues = is12HourFormat
    ? Array.from({ length: 12 }, (_, i) => i + 1) // 1-12 for 12-hour
    : Array.from({ length: 24 }, (_, i) => i); // 0-23 for 24-hour

  const minuteValues = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);
  const periodValues: ('AM' | 'PM')[] = ['AM', 'PM'];

  // No longer need sync effect since we use values directly from hook

  // Create Date object from selection parameters
  const createDateFromSelection = (hour?: number, minute?: number, period?: string): Date => {
    const date = new Date();
    const useHour = hour ?? currentHour;
    const useMinute = minute ?? currentMinute;
    const usePeriod = period ?? currentPeriod;

    const hour24 = is12HourFormat ? convertTo24Hour(useHour, usePeriod) : useHour;
    date.setHours(hour24, useMinute, 0, 0);
    return date;
  };

  // Handle value changes - directly update selectedTime
  const handleHourChange = (value: string | number) => {
    const hour = Number(value);
    const newDate = createDateFromSelection(hour, currentMinute, currentPeriod);
    setSelectedTime(newDate);
  };

  const handleMinuteChange = (value: string | number) => {
    const minute = Number(value);
    const newDate = createDateFromSelection(currentHour, minute, currentPeriod);
    setSelectedTime(newDate);
  };

  const handlePeriodChange = (value: string | number) => {
    const period = value as 'AM' | 'PM';
    const newDate = createDateFromSelection(currentHour, currentMinute, period);
    setSelectedTime(newDate);
  };

  const handleApply = () => {
    const newDate = createDateFromSelection();
    setSelectedTime(newDate);
    onApply();
  };

  console.log('qswap1 content', currentHour, currentMinute, currentPeriod);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      padding="spacing.4"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      minWidth="280px"
    >
      {/* Time Selection Wheels */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-start"
        gap="spacing.3"
      >
        {/* Hour Wheel */}
        <SpinWheel
          label="Hour"
          values={hourValues}
          selectedValue={currentHour}
          onValueChange={handleHourChange}
          width="80px"
        />

        {/* Minute Wheel */}
        <SpinWheel
          label="Min"
          values={minuteValues}
          selectedValue={currentMinute}
          onValueChange={handleMinuteChange}
          width="80px"
        />

        {/* Period Wheel (only for 12-hour format) */}
        {is12HourFormat && (
          <SpinWheel
            label="Period"
            values={periodValues}
            selectedValue={currentPeriod}
            onValueChange={handlePeriodChange}
            width="80px"
          />
        )}
      </Box>

      {/* Footer with Apply/Cancel buttons */}
      {showFooterActions && <TimePickerFooter onApply={handleApply} onCancel={onCancel} />}
    </Box>
  );
};

export { TimePickerContent };
