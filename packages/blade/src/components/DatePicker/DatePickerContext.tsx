import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface DatePickerContextType {
  isDatePickerBodyOpen: boolean;
  isCompactMode: boolean;
}

const DatePickerContext = createContext<DatePickerContextType | undefined>(undefined);

interface DatePickerProviderProps {
  children: ReactNode;
  isDatePickerBodyOpen: boolean;
  isCompactMode: boolean;
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  children,
  isDatePickerBodyOpen,
  isCompactMode,
}) => {
  const value: DatePickerContextType = {
    isDatePickerBodyOpen,
    isCompactMode,
  };

  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
};

export const useDatePickerContext = (): DatePickerContextType | undefined => {
  const context = useContext(DatePickerContext);

  return context;
};
