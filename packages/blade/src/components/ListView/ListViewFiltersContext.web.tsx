import React from 'react';
import type { ListViewContextType } from './types';

const ListViewFiltersGroupContext = React.createContext<ListViewContextType>({
  selectedFilters: [],
  setSelectedFilters: () => {},
});
const ListViewFiltersProvider = ListViewFiltersGroupContext.Provider;

const useListViewFilterContext = (): ListViewContextType => {
  const context = React.useContext(ListViewFiltersGroupContext);
  return context;
};

export { useListViewFilterContext, ListViewFiltersProvider };
