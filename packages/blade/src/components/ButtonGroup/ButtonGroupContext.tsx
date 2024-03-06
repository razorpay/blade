import React from 'react';
import type { ButtonGroupContextType } from './types';

const ButtonGroupContext = React.createContext<ButtonGroupContextType>({});
const ButtonGroupProvider = ButtonGroupContext.Provider;

const useButtonGroupContext = (): ButtonGroupContextType => {
  const context = React.useContext(ButtonGroupContext);
  return context;
};

export { useButtonGroupContext, ButtonGroupProvider };
