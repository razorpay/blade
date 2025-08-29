import { default as React } from 'react';
import { NavLinkContextType, SideNavContextType } from './types';
declare const SideNavContext: React.Context<SideNavContextType>;
declare const useSideNav: () => SideNavContextType;
declare const NavLinkContext: React.Context<NavLinkContextType>;
declare const useNavLink: () => NavLinkContextType;
export { SideNavContext, useSideNav, NavLinkContext, useNavLink };
