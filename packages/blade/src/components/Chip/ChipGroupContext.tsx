import React from 'react';
import type { ChipGroupContextType } from './types';
import { throwBladeError } from '~utils/logger';

const ChipGroupContext = React.createContext<ChipGroupContextType>({});
const ChipGroupProvider = ChipGroupContext.Provider;

const useChipGroupContext = (): ChipGroupContextType => {
  const context = React.useContext(ChipGroupContext);
  if (__DEV__) {
    if (typeof context === 'undefined') {
      throwBladeError({
        message: 'useChipGroupContext must be used within ChipGroup',
        moduleName: 'ChipGroup',
      });
    }
  }
  return context;
};

export { useChipGroupContext, ChipGroupProvider };
