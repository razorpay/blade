import React from 'react';
import type { FilterChipGroupContextType } from './types';

const FilterChipGroupContext = React.createContext<FilterChipGroupContextType>({
  filterChipGroupSelectedFilters: [],
  setFilterChipGroupSelectedFilters: () => {},
});
const FilterChipGroupProvider = FilterChipGroupContext.Provider;

const useFilterChipGroupContext = (): FilterChipGroupContextType => {
  const context = React.useContext(FilterChipGroupContext);
  return context;
};

export { useFilterChipGroupContext, FilterChipGroupProvider };
