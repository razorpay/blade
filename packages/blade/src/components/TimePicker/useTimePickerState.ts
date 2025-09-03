import React from 'react';
import type { TimeFormat, MinuteStep, TimePickerValue } from './types';
import { useControllableState } from '~utils/useControllable';
import { Time } from '@internationalized/date';

type UseTimePickerStateProps = {
  // Controlled/uncontrolled time value
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (time: Date | null) => void;

  // Controlled/uncontrolled open state
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpenChange?: (state: { isOpen: boolean }) => void;

  // Configuration
  timeFormat?: TimeFormat;
  minuteStep?: MinuteStep;
  showFooterActions?: boolean;

  // Apply callback
  onApply?: (timeValue: TimePickerValue) => void;
};

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
  minuteStep = 1,
  showFooterActions = true,
  onApply,
}: UseTimePickerStateProps) => {
  // Helper functions to convert between Date and TimeValue
  const dateToTimeValue = React.useCallback((date: Date | null): Time | null => {
    if (!date) return null;
    return new Time(date.getHours(), date.getMinutes());
  }, []);

  const timeValueToDate = React.useCallback((timeValue: Time | null): Date | null => {
    if (!timeValue) return null;
    const date = new Date();
    date.setHours(timeValue.hour, timeValue.minute, 0, 0);
    return date;
  }, []);

  // Internal state uses TimeValue for React Aria compatibility
  const [selectedTimeValue, setSelectedTimeValue] = useControllableState<Time | null>({
    value: dateToTimeValue(value || null),
    defaultValue: dateToTimeValue(defaultValue || null),
    onChange: (timeValue) => {
      // Convert back to Date when calling user's onChange
      const date = timeValueToDate(timeValue);
      onChange?.(date);
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
      onApply?.({ value: tempTime || new Date() });
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

  // Helper function to get individual time components
  const getTimeComponents = (time: Date | null) => {
    if (!time) {
      return {
        selectedHour: timeFormat === '12h' ? 12 : 0,
        selectedMinute: 0,
        selectedPeriod: 'AM' as const,
      };
    }

    const hour = time.getHours();
    const minute = time.getMinutes();

    if (timeFormat === '12h') {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return {
        selectedHour: displayHour,
        selectedMinute: minute,
        selectedPeriod: period,
      };
    } else {
      return {
        selectedHour: hour,
        selectedMinute: minute,
        selectedPeriod: 'AM' as const, // Not used in 24h format
      };
    }
  };

  const currentTime = showFooterActions ? tempTime : selectedTime;
  const currentTimeValue = showFooterActions ? tempTimeValue : selectedTimeValue;
  const { selectedHour, selectedMinute, selectedPeriod } = getTimeComponents(currentTime);

  // Function to create complete time from current partial/full values
  const createCompleteTime = React.useCallback(() => {
    const hour = selectedHour;
    const minute = selectedMinute;
    const period = selectedPeriod;

    // Validate values
    if (timeFormat === '12h') {
      if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
    } else {
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    }

    const newDate = new Date();
    if (timeFormat === '12h') {
      const hour24 = period === 'AM' ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
      newDate.setHours(hour24, minute, 0, 0);
    } else {
      newDate.setHours(hour, minute, 0, 0);
    }

    return newDate;
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

    // Configuration
    timeFormat,
    minuteStep,
    showFooterActions,

    // Actions
    onApply: handleApply,
    onCancel: handleCancel,

    // Time validation and creation
    createCompleteTime,

    // Temporary state for footer actions
    tempTime,
    setTempTime,
  } as const;
};
