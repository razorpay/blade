import React from 'react';
import type { SideNavContextType } from './types';
import { throwBladeError } from '~utils/logger';

const SideNavContext = React.createContext<SideNavContextType>({});

const useSideNav = (): SideNavContextType => {
  const value = React.useContext(SideNavContext);
  if (!value) {
    throwBladeError({ moduleName: 'SideNavContext', message: 'SideNavLink used outside SideNav' });
  }
  return value;
};

export { SideNavContext, useSideNav };
