import React from 'react';
import type { QuickFilterGroupContextType } from '../types';

const QuickFilterGroupContext = React.createContext<QuickFilterGroupContextType>({
  selectionType: 'single',
  selectedQuickFilters: [],
});
const QuickFilterGroupProvider = QuickFilterGroupContext.Provider;

const useQuickFilterGroupContext = (): QuickFilterGroupContextType => {
  const context = React.useContext(QuickFilterGroupContext);
  return context;
};

export { useQuickFilterGroupContext, QuickFilterGroupProvider };
