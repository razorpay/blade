import React from 'react';
import type { ButtonGroupContextType } from './types';
import { throwBladeError } from '~utils/logger';

const ButtonGroupContext = React.createContext<ButtonGroupContextType>({});
const ButtonGroupProvider = ButtonGroupContext.Provider;

const useButtonGroupContext = (): ButtonGroupContextType => {
  const context = React.useContext(ButtonGroupContext);
  if (__DEV__) {
    if (typeof context === 'undefined') {
      throwBladeError({
        message: 'useButtonGroupContext must be used within ButtonGroup',
        moduleName: 'ButtonGroup',
      });
    }
  }
  return context;
};

export { useButtonGroupContext, ButtonGroupProvider };
