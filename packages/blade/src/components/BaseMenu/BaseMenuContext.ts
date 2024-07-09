import React from 'react';
import type { BaseMenuItemContextType } from './types';

const BaseMenuItemContext = React.createContext<BaseMenuItemContextType>({});

const useBaseMenuItem = (): BaseMenuItemContextType => {
  const menuItemValue = React.useContext(BaseMenuItemContext);
  return menuItemValue;
};

export { useBaseMenuItem, BaseMenuItemContext };
