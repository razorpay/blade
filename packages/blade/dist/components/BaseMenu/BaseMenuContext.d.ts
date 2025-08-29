import { default as React } from 'react';
import { BaseMenuItemContextType } from './types';
declare const BaseMenuItemContext: React.Context<BaseMenuItemContextType>;
declare const useBaseMenuItem: () => BaseMenuItemContextType;
export { useBaseMenuItem, BaseMenuItemContext };
