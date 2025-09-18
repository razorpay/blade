import React from 'react';
import { Time } from '@internationalized/date';
import type { UseTimePickerStateProps } from './types';
import { dateToTimeValue, timeValueToDate, getTimeComponents, createCompleteTime } from './utils';
import { useControllableState } from '~utils/useControllable';

/**
 * Returns empty time value (midnight) when neither value nor defaultValue is provided
 */
const getEmptyTimeValue = (): Time => new Time(0, 0);

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
}: UseTimePickerStateProps): {
  timeValue: Date | null;
  setTimeValue: (date: Date | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  internalTimeValue: Time;
  setInternalTimeValue: (timeValue: Time) => void;
  selectedHour: number;
  selectedMinute: number;
  selectedPeriod: string;
  onApply: () => void;
  onCancel: () => void;
  createCompleteTime: () => Date | null;
} => {
  // Convert values for React Aria Time compatibility
  const convertedValue = value !== undefined ? dateToTimeValue(value) : undefined;
  const convertedDefaultValue =
    defaultValue !== undefined ? dateToTimeValue(defaultValue) : undefined;

  const [internalTimeValue, setInternalTimeValue] = useControllableState<Time>({
    value: convertedValue ?? undefined,
    defaultValue: convertedDefaultValue ?? undefined,
    onChange: (timeValue) => {
      const date = timeValueToDate(timeValue);
      onChange?.({ value: date });
    },
  });

  // For external API, expose as Date
  const timeValue = timeValueToDate(internalTimeValue);
  const setTimeValue = React.useCallback(
    (date: Date | null) => {
      setInternalTimeValue(() => dateToTimeValue(date) ?? getEmptyTimeValue());
    },
    [setInternalTimeValue],
  );

  // Old value backup for cancel functionality
  const [oldTimeValue, setOldTimeValue] = React.useState<Time>(internalTimeValue);

  // Manage controlled/uncontrolled open state
  const [controllableIsOpen, setControllableIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen: boolean) => {
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
    setInternalTimeValue: (timeValue: Time) => setInternalTimeValue(() => timeValue),

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
