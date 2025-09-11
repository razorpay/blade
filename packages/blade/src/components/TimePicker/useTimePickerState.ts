import React from 'react';
import type { Time } from '@internationalized/date';
import { useControllableState } from '~utils/useControllable';
import type { UseTimePickerStateProps } from './types';
import { dateToTimeValue, timeValueToDate, getTimeComponents, createCompleteTime } from './utils';

/**
 * Custom hook for TimePicker state management
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
  const [internalTimeValue, setInternalTimeValue] = useControllableState<Time | null>({
    value: dateToTimeValue(value ?? null),
    defaultValue: dateToTimeValue(defaultValue ?? null),
    onChange: (timeValue) => {
      // Convert back to Date when calling user's onChange
      const date = timeValueToDate(timeValue);
      // Always call onChange, even when date is null (for clearing/resetting)
      onChange?.({ value: date });
    },
  });

  // For external API, expose as Date
  const timeValue = timeValueToDate(internalTimeValue);
  const setTimeValue = React.useCallback(
    (date: Date | null) => {
      setInternalTimeValue(() => dateToTimeValue(date));
    },
    [setInternalTimeValue],
  );

  // Old value backup for cancel functionality
  const [oldTimeValue, setOldTimeValue] = React.useState<Time | null>(internalTimeValue);

  // Manage controlled/uncontrolled open state
  const [controllableIsOpen, setControllableIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => {
      onOpenChange?.({ isOpen });
      // Update old value every time timepicker is opened or closed
      setOldTimeValue(internalTimeValue);
    },
  });

  const handleApply = React.useCallback(() => {
    if (showFooterActions) {
      // Call onChange with current timeValue
      onChange?.({ value: timeValue });
      // Update oldTimeValue to current value
      setOldTimeValue(internalTimeValue);
      // Call onApply callback
      onApply?.({ value: timeValue });
    }
    setControllableIsOpen(() => false);
  }, [
    timeValue,
    internalTimeValue,
    onChange,
    setOldTimeValue,
    onApply,
    setControllableIsOpen,
    showFooterActions,
  ]);

  const handleCancel = React.useCallback(() => {
    // Restore internalTimeValue from oldTimeValue
    setInternalTimeValue(() => oldTimeValue);
    setControllableIsOpen(() => false);
  }, [oldTimeValue, setInternalTimeValue, setControllableIsOpen]);

  const { selectedHour, selectedMinute, selectedPeriod } = getTimeComponents(timeValue, timeFormat);

  // Function to create complete time from current partial/full values
  const createCompleteTimeCallback = React.useCallback(() => {
    return createCompleteTime(selectedHour, selectedMinute, selectedPeriod, timeFormat);
  }, [selectedHour, selectedMinute, selectedPeriod, timeFormat]);

  return {
    // Core state (Date API for external use)
    timeValue,
    setTimeValue,
    isOpen: controllableIsOpen ?? false,
    setIsOpen: (isOpen: boolean) => setControllableIsOpen(() => isOpen),

    // TimeValue for React Aria compatibility
    internalTimeValue,
    setInternalTimeValue,

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
