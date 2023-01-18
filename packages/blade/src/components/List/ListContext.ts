import React from 'react';
import type { ListProps } from './List';

export type ListContextType = {
  level: number;
};

const ListContext = React.createContext<ListContextType>({});
const ListProvider = ListContext.Provider;

const useListContext = (): ListContextType => {
  const context = React.useContext(ListContext);
  return context;
};

export { useListContext, ListProvider };
