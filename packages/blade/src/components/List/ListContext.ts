import React from 'react';
import type { IconComponent } from '../Icons';

export type ListContextType = {
  level?: number;
  size: 'small' | 'medium';
  icon?: IconComponent;
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
