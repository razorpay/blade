import React from 'react';
import type { ListProps } from './List';
import type { IconComponent } from '~components/Icons';

export type ListContextType = {
  level?: number;
  size: NonNullable<ListProps['size']>;
  icon?: IconComponent;
  iconColor?: ListProps['iconColor'];
  variant: NonNullable<ListProps['variant']>;
};

const ListContext = React.createContext<ListContextType>({
  level: undefined,
  size: 'medium',
  variant: 'unordered',
});
const ListProvider = ListContext.Provider;

const useListContext = (): ListContextType => {
  const context = React.useContext(ListContext);
  return context;
};

export { useListContext, ListProvider };
