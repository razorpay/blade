import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

interface DatePickerContextType {
  isDatePickerBodyOpen: boolean;
  displayFormat: 'compact' | 'default';
}

const DatePickerContext = createContext<DatePickerContextType | undefined>(undefined);

interface DatePickerProviderProps {
  children: ReactNode;
  isDatePickerBodyOpen: boolean;
  displayFormat: 'compact' | 'default';
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  children,
  isDatePickerBodyOpen,
  displayFormat,
}) => {
  // Memoize context value to prevent infinite re-renders in consumers
  const value = useMemo<DatePickerContextType>(
    () => ({
      isDatePickerBodyOpen,
      displayFormat,
    }),
    [isDatePickerBodyOpen, displayFormat],
  );

  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
};

export const useDatePickerContext = (): DatePickerContextType | undefined => {
  const context = useContext(DatePickerContext);

  return context;
};
