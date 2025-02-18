import React from 'react';
import type { QuickFilterGroupProps } from '../types';

export type QuickFilterGroupContextType = Pick<
  QuickFilterGroupProps,
  'selectionType' | 'onChange'
> & {
  selectedQuickFilters: string[];
  setSelectedQuickFilters: React.Dispatch<React.SetStateAction<NonNullable<string[]>>>;
};
const QuickFilterGroupContext = React.createContext<QuickFilterGroupContextType>({
  selectionType: 'single',
  onChange: undefined,
  selectedQuickFilters: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedQuickFilters: () => {},
});
const QuickFilterGroupProvider = QuickFilterGroupContext.Provider;

const useQuickFilterGroupContext = (): QuickFilterGroupContextType => {
  const context = React.useContext(QuickFilterGroupContext);
  return context;
};

export { useQuickFilterGroupContext, QuickFilterGroupProvider };
