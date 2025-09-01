import React from 'react';
import type { TimePickerContextValue, TimeFormat, MinuteStep } from './types';

/**
 * Context for TimePicker state management
 * Provides shared state and utilities across TimePicker components
 */
const TimePickerContext = React.createContext<TimePickerContextValue | null>(null);

/**
 * Hook to access TimePicker context
 * Throws error if used outside TimePickerProvider
 */
const useTimePickerContext = (): TimePickerContextValue => {
  const context = React.useContext(TimePickerContext);
  if (!context) {
    throw new Error('useTimePickerContext must be used within a TimePickerProvider');
  }
  return context;
};

/**
 * Provider component that wraps TimePicker and provides shared state
 */
type TimePickerProviderProps = {
  children: React.ReactNode;
  selectedTime: Date | null;
  setSelectedTime: (time: Date | null) => void;
  timeFormat: TimeFormat;
  minuteStep: MinuteStep;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showFooterActions: boolean;
  onApply: () => void;
  onCancel: () => void;
};

const TimePickerProvider = ({
  children,
  selectedTime,
  setSelectedTime,
  timeFormat,
  minuteStep,
  isOpen,
  setIsOpen,
  showFooterActions,
  onApply,
  onCancel,
}: TimePickerProviderProps): React.ReactElement => {
  /**
   * Format time for display in input field
   * Handles null/undefined cases and applies format
   */
  const formatTimeForDisplay = React.useCallback(
    (time: Date | null): string => {
      if (!time) return '';

      const hours = time.getHours();
      const minutes = time.getMinutes();

      // Currently only 12h format is supported
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${period}`;
    },
    [timeFormat],
  );

  /**
   * Parse time string from input field back to Date object
   * Handles various input formats and validates
   */
  const parseTimeFromInput = React.useCallback((timeString: string): Date | null => {
    if (!timeString.trim()) return null;

    try {
      // Currently only 12h format is supported: HH:MM AM/PM
      const time12hRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
      const match = timeString.trim().match(time12hRegex);

      if (!match) return null;

      const [, hourStr, minuteStr, period] = match;
      let hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);

      // Validate ranges
      if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        return null;
      }

      // Convert to 24h format
      if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }

      // Create date with current date but specified time
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    } catch {
      return null;
    }
  }, []);

  /**
   * Generate hour values for 12h format
   */
  const getHourValues = React.useCallback((): string[] => {
    // Currently only 12h format is supported
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, []);

  /**
   * Generate minute values based on step
   */
  const getMinuteValues = React.useCallback((): string[] => {
    const values: string[] = [];
    for (let i = 0; i < 60; i += minuteStep) {
      values.push(i.toString().padStart(2, '0'));
    }
    return values;
  }, [minuteStep]);

  /**
   * Generate period values (AM/PM for 12h format)
   */
  const getPeriodValues = React.useCallback((): string[] => {
    // Currently only 12h format is supported
    return ['AM', 'PM'];
  }, []);

  /**
   * Get current time parts from selected time
   */
  const currentTimeParts = React.useMemo(() => {
    if (!selectedTime) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Currently only 12h format is supported
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return {
        hour: displayHours.toString().padStart(2, '0'),
        minute: minutes.toString().padStart(2, '0'),
        period,
      };
    }

    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();

    // Currently only 12h format is supported
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return {
      hour: displayHours.toString().padStart(2, '0'),
      minute: minutes.toString().padStart(2, '0'),
      period,
    };
  }, [selectedTime]);

  /**
   * Update hour part while preserving other parts
   */
  const updateHour = React.useCallback(
    (hour: string) => {
      const currentTime = selectedTime || new Date();
      const newTime = new Date(currentTime);

      let hourNum = parseInt(hour, 10);

      // Currently only 12h format is supported
      const currentPeriod = currentTimeParts.period;
      if (currentPeriod === 'PM' && hourNum !== 12) {
        hourNum += 12;
      } else if (currentPeriod === 'AM' && hourNum === 12) {
        hourNum = 0;
      }

      newTime.setHours(hourNum);
      setSelectedTime(newTime);
    },
    [selectedTime, setSelectedTime, currentTimeParts.period],
  );

  /**
   * Update minute part while preserving other parts
   */
  const updateMinute = React.useCallback(
    (minute: string) => {
      const currentTime = selectedTime || new Date();
      const newTime = new Date(currentTime);
      newTime.setMinutes(parseInt(minute, 10));
      setSelectedTime(newTime);
    },
    [selectedTime, setSelectedTime],
  );

  /**
   * Update period (AM/PM) while preserving other parts
   */
  const updatePeriod = React.useCallback(
    (period: string) => {
      // Currently only 12h format is supported
      const currentTime = selectedTime || new Date();
      const newTime = new Date(currentTime);
      const currentHours = newTime.getHours();

      if (period === 'PM' && currentHours < 12) {
        newTime.setHours(currentHours + 12);
      } else if (period === 'AM' && currentHours >= 12) {
        newTime.setHours(currentHours - 12);
      }

      setSelectedTime(newTime);
    },
    [selectedTime, setSelectedTime],
  );

  /**
   * Validate time against constraints
   * Future: Add minTime, maxTime, excludeTime support
   */
  const validateTime = React.useCallback(
    (time: Date | null): { isValid: boolean; error?: string } => {
      if (!time) {
        return { isValid: false, error: 'Time is required' };
      }

      const hours = time.getHours();
      const minutes = time.getMinutes();

      // Basic validation
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return { isValid: false, error: 'Invalid time format' };
      }

      // Minute step validation
      if (minutes % minuteStep !== 0) {
        return {
          isValid: false,
          error: `Minutes must be in ${minuteStep}-minute intervals`,
        };
      }

      return { isValid: true };
    },
    [minuteStep],
  );

  const contextValue: TimePickerContextValue = {
    selectedTime,
    setSelectedTime,
    timeFormat,
    minuteStep,
    isOpen,
    setIsOpen,
    showFooterActions,
    onApply,
    onCancel,
    formatTimeForDisplay,
    parseTimeFromInput,
    getHourValues,
    getMinuteValues,
    getPeriodValues,
    currentHour: currentTimeParts.hour,
    currentMinute: currentTimeParts.minute,
    currentPeriod: currentTimeParts.period,
    updateHour,
    updateMinute,
    updatePeriod,
    validateTime,
  };

  return <TimePickerContext.Provider value={contextValue}>{children}</TimePickerContext.Provider>;
};

export { TimePickerProvider, useTimePickerContext };
