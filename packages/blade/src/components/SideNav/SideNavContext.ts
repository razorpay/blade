import React from 'react';
import type { NavLinkContextType, SideNavContextType } from './types';
import { throwBladeError } from '~utils/logger';

const SideNavContext = React.createContext<SideNavContextType>({});

const useSideNav = (): SideNavContextType => {
  const value = React.useContext(SideNavContext);
  if (!value) {
    throwBladeError({
      moduleName: 'SideNavContext',
      message: 'SideNav* components cannot be used outside SideNav',
    });
  }
  return value;
};

const NavLinkContext = React.createContext<NavLinkContextType>({});
const useNavLink = (): NavLinkContextType => {
  const value = React.useContext(NavLinkContext);
  return value;
};

export { SideNavContext, useSideNav, NavLinkContext, useNavLink };
