import React from 'react';
import type { FilterChipGroupContextType } from './types';

const FilterChipGroupContext = React.createContext<FilterChipGroupContextType>({
  filterChipGroupSelectedFilters: [],
  setFilterChipGroupSelectedFilters: () => {},
  clearFilterCallbackTriggerer: 0,
  setClearFilterCallbackTriggerer: () => {},
});
const FilterChipGroupProvider = FilterChipGroupContext.Provider;

const useFilterChipGroupContext = (): FilterChipGroupContextType => {
  const context = React.useContext(FilterChipGroupContext);
  return context;
};

export { useFilterChipGroupContext, FilterChipGroupProvider };
