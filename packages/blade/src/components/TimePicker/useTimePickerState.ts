import React from 'react';
import type { UseTimePickerStateProps } from './types';
import { useControllableState } from '~utils/useControllable';
import { Time } from '@internationalized/date';
import { dateToTimeValue, timeValueToDate, getTimeComponents, createCompleteTime } from './utils';

/**
 * Custom hook for TimePicker state management
 * Similar to DatePicker's useDatesState but for time selection
 */
export const useTimePickerState = ({
  value,
  defaultValue,
  onChange,
  isOpen,
  defaultIsOpen = false,
  onOpenChange,
  timeFormat = '12h',
  showFooterActions = true,
  onApply,
}: UseTimePickerStateProps) => {
  // Internal state uses TimeValue for React Aria compatibility
  const [selectedTimeValue, setSelectedTimeValue] = useControllableState<Time | null>({
    value: dateToTimeValue(value || null),
    defaultValue: dateToTimeValue(defaultValue || null),
    onChange: (timeValue) => {
      // Convert back to Date when calling user's onChange
      const date = timeValueToDate(timeValue);
      if (date) {
        onChange?.({ value: date });
      }
    },
  });

  // For external API, expose as Date
  const selectedTime = timeValueToDate(selectedTimeValue);
  const setSelectedTime = React.useCallback(
    (date: Date | null) => {
      setSelectedTimeValue(() => dateToTimeValue(date));
    },
    [dateToTimeValue, setSelectedTimeValue],
  );

  // Manage controlled/uncontrolled open state
  const [controllableIsOpen, setControllableIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => {
      onOpenChange?.({ isOpen });
    },
  });

  // Temporary time state for managing changes before apply (when showFooterActions is true)
  const [tempTimeValue, setTempTimeValue] = React.useState<Time | null>(selectedTimeValue);

  // Sync tempTime with selectedTime when selectedTime changes externally
  React.useEffect(() => {
    setTempTimeValue(selectedTimeValue);
  }, [selectedTimeValue]);

  // For external API, expose temp time as Date
  const tempTime = timeValueToDate(tempTimeValue);
  const setTempTime = React.useCallback(
    (date: Date | null) => {
      setTempTimeValue(dateToTimeValue(date));
    },
    [dateToTimeValue],
  );

  const handleApply = React.useCallback(() => {
    if (showFooterActions) {
      // When footer actions are shown, apply the temp time
      setSelectedTimeValue(() => tempTimeValue);
      // Only call onApply if we have a valid time
      if (tempTime) {
        onApply?.({ value: tempTime });
      }
    }
    setControllableIsOpen(() => false);
  }, [
    tempTimeValue,
    tempTime,
    setSelectedTimeValue,
    onApply,
    setControllableIsOpen,
    showFooterActions,
  ]);

  const handleCancel = React.useCallback(() => {
    // Reset temp time to current selected time
    setTempTimeValue(selectedTimeValue);
    setControllableIsOpen(() => false);
  }, [selectedTimeValue, setControllableIsOpen]);

  const currentTime = showFooterActions ? tempTime : selectedTime;
  const currentTimeValue = showFooterActions ? tempTimeValue : selectedTimeValue;
  const { selectedHour, selectedMinute, selectedPeriod } = getTimeComponents(
    currentTime,
    timeFormat,
  );

  // Function to create complete time from current partial/full values
  const createCompleteTimeCallback = React.useCallback(() => {
    return createCompleteTime(selectedHour, selectedMinute, selectedPeriod, timeFormat);
  }, [selectedHour, selectedMinute, selectedPeriod, timeFormat]);

  return {
    // Core state (Date API for external use)
    selectedTime: currentTime,
    setSelectedTime: showFooterActions ? setTempTime : setSelectedTime,
    isOpen: controllableIsOpen ?? false,
    setIsOpen: (isOpen: boolean) => setControllableIsOpen(() => isOpen),

    // TimeValue for React Aria compatibility
    selectedTimeValue: currentTimeValue,
    setSelectedTimeValue: showFooterActions ? setTempTimeValue : setSelectedTimeValue,

    // Individual time components for easy access
    selectedHour,
    selectedMinute,
    selectedPeriod,

    // Actions
    onApply: handleApply,
    onCancel: handleCancel,

    // Time validation and creation
    createCompleteTime: createCompleteTimeCallback,

    // Temporary state for footer actions
    tempTime,
    setTempTime,
  } as const;
};
