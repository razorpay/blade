import React from 'react';

export type ListContextType = {
  level?: number;
  size: 'small' | 'medium';
};

const ListContext = React.createContext<ListContextType>({
  level: undefined,
  size: 'medium',
});
const ListProvider = ListContext.Provider;

const useListContext = (): ListContextType => {
  const context = React.useContext(ListContext);
  return context;
};

export { useListContext, ListProvider };
