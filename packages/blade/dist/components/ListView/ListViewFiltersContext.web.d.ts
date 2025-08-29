import { default as React } from 'react';
import { ListViewContextType } from './types';
declare const ListViewFiltersProvider: React.Provider<ListViewContextType>;
declare const useListViewFilterContext: () => ListViewContextType;
export { useListViewFilterContext, ListViewFiltersProvider };
