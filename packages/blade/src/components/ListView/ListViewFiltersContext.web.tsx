import React from 'react';
import type { ListViewContextType } from './types';

const ListViewFiltersGroupContext = React.createContext<ListViewContextType>({
  setSelectedFilters: () => {},
  clearFiltersCallbackTriggerer: 0,
  setClearFiltersCallbackTriggerer: () => {},
});
const ListViewFiltersProvider = ListViewFiltersGroupContext.Provider;

const useListViewFilterContext = (): ListViewContextType => {
  const context = React.useContext(ListViewFiltersGroupContext);
  return context;
};

export { useListViewFilterContext, ListViewFiltersProvider };
