import React from 'react';

export type ListContextType = {
  level?: number;
};

const ListContext = React.createContext<ListContextType>({
  level: undefined,
});
const ListProvider = ListContext.Provider;

const useListContext = (): ListContextType => {
  const context = React.useContext(ListContext);
  return context;
};

export { useListContext, ListProvider };
