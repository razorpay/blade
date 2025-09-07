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
      // Always call onChange, even when date is null (for clearing/resetting)
      onChange?.({ value: date });
    },
  });

  // For external API, expose as Date
  const selectedTime = timeValueToDate(selectedTimeValue);
  const setSelectedTime = React.useCallback(
    (date: Date | null) => {
      setSelectedTimeValue(() => dateToTimeValue(date));
    },
    [setSelectedTimeValue],
  );

  // Old value backup for cancel functionality (like DatePicker)
  const [oldTimeValue, setOldTimeValue] = React.useState<Time | null>(selectedTimeValue);

  // Manage controlled/uncontrolled open state
  const [controllableIsOpen, setControllableIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => {
      onOpenChange?.({ isOpen });
      // Update old value every time timepicker is opened or closed (like DatePicker)
      setOldTimeValue(selectedTimeValue);
    },
  });

  const handleApply = React.useCallback(() => {
    if (showFooterActions) {
      // Call onChange with current selectedTime (like DatePicker calls onChange with controlledValue)
      onChange?.({ value: selectedTime });
      // Update oldTimeValue to current value (like DatePicker)
      setOldTimeValue(selectedTimeValue);
      // Call onApply callback (like DatePicker)
      onApply?.({ value: selectedTime });
    }
    setControllableIsOpen(() => false);
  }, [
    selectedTime,
    selectedTimeValue,
    onChange,
    setOldTimeValue,
    onApply,
    setControllableIsOpen,
    showFooterActions,
  ]);

  const handleCancel = React.useCallback(() => {
    // Restore selectedTimeValue from oldTimeValue (like DatePicker restores controlledValue from oldValue)
    setSelectedTimeValue(() => oldTimeValue);
    setControllableIsOpen(() => false);
  }, [oldTimeValue, setSelectedTimeValue, setControllableIsOpen]);

  const { selectedHour, selectedMinute, selectedPeriod } = getTimeComponents(
    selectedTime,
    timeFormat,
  );

  // Function to create complete time from current partial/full values
  const createCompleteTimeCallback = React.useCallback(() => {
    return createCompleteTime(selectedHour, selectedMinute, selectedPeriod, timeFormat);
  }, [selectedHour, selectedMinute, selectedPeriod, timeFormat]);

  return {
    // Core state (Date API for external use)
    selectedTime,
    setSelectedTime,
    isOpen: controllableIsOpen ?? false,
    setIsOpen: (isOpen: boolean) => setControllableIsOpen(() => isOpen),

    // TimeValue for React Aria compatibility
    selectedTimeValue,
    setSelectedTimeValue,

    // Individual time components for easy access
    selectedHour,
    selectedMinute,
    selectedPeriod,

    // Actions
    onApply: handleApply,
    onCancel: handleCancel,

    // Time validation and creation
    createCompleteTime: createCompleteTimeCallback,
  } as const;
};
