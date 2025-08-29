import { default as React } from 'react';
import { TabNavItemData } from './types';
type TabNavContextProps = {
    containerRef: React.RefObject<HTMLDivElement>;
    controlledItems: TabNavItemData[];
    setControlledItems: React.Dispatch<React.SetStateAction<TabNavItemData[]>>;
};
declare const TabNavContext: React.Context<TabNavContextProps | null>;
declare const useTabNavContext: () => TabNavContextProps;
export { TabNavContext, useTabNavContext };
