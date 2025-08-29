import { default as React } from 'react';
import { TabsProps } from './types';
import { ControllableStateSetter } from '../../utils/useControllable';
type TabsContextProps = (Pick<TabsProps, 'size' | 'variant' | 'isFullWidthTabItem' | 'isLazy'> & {
    isVertical: boolean;
    baseId: string;
    selectedValue: string;
    setSelectedValue?: ControllableStateSetter<string>;
}) | null;
declare const TabsContext: React.Context<TabsContextProps>;
declare const useTabsContext: () => NonNullable<TabsContextProps>;
export { TabsContext, useTabsContext };
