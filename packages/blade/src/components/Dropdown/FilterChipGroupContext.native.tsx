import React from 'react';
import type { FilterChipGroupContextType } from './types';

const FilterChipGroupContext = React.createContext<FilterChipGroupContextType>({
  filterChipGroupSelectedFilters: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFilterChipGroupSelectedFilters: () => {},
  clearFilterCallbackTriggerer: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setClearFilterCallbackTriggerer: () => {},
});
const FilterChipGroupProvider = FilterChipGroupContext.Provider;

const useFilterChipGroupContext = (): FilterChipGroupContextType => {
  const context = React.useContext(FilterChipGroupContext);
  return context;
};

export { useFilterChipGroupContext, FilterChipGroupProvider };
