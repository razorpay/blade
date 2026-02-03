import React, { createContext, useContext } from 'react';
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
  const value: DatePickerContextType = {
    isDatePickerBodyOpen,
    displayFormat,
  };

  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
};

export const useDatePickerContext = (): DatePickerContextType | undefined => {
  const context = useContext(DatePickerContext);

  return context;
};
