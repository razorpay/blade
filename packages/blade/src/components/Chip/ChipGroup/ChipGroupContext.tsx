import React from 'react';
import type { ChipGroupContextType } from './types';

const ChipGroupContext = React.createContext<ChipGroupContextType>({});
const ChipGroupProvider = ChipGroupContext.Provider;

const useChipGroupContext = (): ChipGroupContextType => {
  const context = React.useContext(ChipGroupContext);
  return context;
};

export { useChipGroupContext, ChipGroupProvider };
