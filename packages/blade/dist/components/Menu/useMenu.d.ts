import { default as React } from 'react';
import { MenuContextType, UseFloatingMenuProps, UseFloatingMenuReturnType } from './types';
declare const MenuContext: React.Context<MenuContextType>;
declare const useMenu: () => MenuContextType;
declare const useFloatingMenuSetup: ({ elementsRef, openInteraction, onOpenChange, isOpen, }: UseFloatingMenuProps) => UseFloatingMenuReturnType;
export { MenuContext, useMenu, useFloatingMenuSetup };
