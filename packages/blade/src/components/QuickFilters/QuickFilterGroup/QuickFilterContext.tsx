/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { QuickFilterGroupProps } from '../types';

export type QuickFilterGroupContextType = Pick<
  QuickFilterGroupProps,
  'selectionType' | 'onChange'
> & {
  selectedQuickFilters: string[];
  setSelectedQuickFilters: React.Dispatch<React.SetStateAction<string[]>>;
};

const QuickFilterGroupContext = React.createContext<QuickFilterGroupContextType>({
  selectionType: 'single',
  onChange: undefined,
  selectedQuickFilters: [],
  setSelectedQuickFilters: () => {},
});
const QuickFilterGroupProvider = QuickFilterGroupContext.Provider;

const useQuickFilterGroupContext = (): QuickFilterGroupContextType => {
  const context = React.useContext(QuickFilterGroupContext);
  return context;
};

export { useQuickFilterGroupContext, QuickFilterGroupProvider };
