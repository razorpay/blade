import { default as React } from 'react';
import { TabsProps } from './types';
declare const iconSizeMap: {
    readonly small: "medium";
    readonly medium: "medium";
    readonly large: "large";
};
declare const useTabsItemPropRestriction: (trailing: React.ReactNode, tabItemSize: NonNullable<TabsProps['size']>) => React.ReactNode;
declare const componentIds: {
    readonly TabList: "TabList";
    readonly TabPanel: "TabPanel";
};
export { useTabsItemPropRestriction, iconSizeMap, componentIds };
