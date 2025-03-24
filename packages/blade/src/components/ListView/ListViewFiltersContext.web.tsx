import React from 'react';
import type { ListViewContextType } from './types';

const ListViewFiltersGroupContext = React.createContext<ListViewContextType>({
  listViewSelectedFilters: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setListViewSelectedFilters: () => {},
});
const ListViewFiltersProvider = ListViewFiltersGroupContext.Provider;

const useListViewFilterContext = (): ListViewContextType => {
  const context = React.useContext(ListViewFiltersGroupContext);
  return context;
};

export { useListViewFilterContext, ListViewFiltersProvider };
