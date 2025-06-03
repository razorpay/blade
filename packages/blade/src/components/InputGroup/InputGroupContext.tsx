import React from 'react';
import type { InputGroupContextType } from './types';

const InputGroupContext = React.createContext<InputGroupContextType>({
  isInsideInputGroup: false,
});
const InputGroupProvider = InputGroupContext.Provider;

const useInputGroupContext = (): InputGroupContextType => {
  return React.useContext(InputGroupContext);
};

export { useInputGroupContext, InputGroupProvider };
