import { default as React } from 'react';
import { SectionData } from './actionListUtils';
import { DataAnalyticsAttribute } from '../../utils/types';
declare const ActionListBox: React.MemoExoticComponent<React.ForwardRefExoticComponent<{
    childrenWithId?: React.ReactNode[] | null | undefined;
    sectionData: SectionData;
    actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
    isMultiSelectable: boolean;
    isInBottomSheet: boolean;
} & DataAnalyticsAttribute & React.RefAttributes<HTMLDivElement>>>;
declare const ActionListVirtualizedBox: React.MemoExoticComponent<React.ForwardRefExoticComponent<{
    childrenWithId?: React.ReactNode[] | null | undefined;
    sectionData: SectionData;
    actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
    isMultiSelectable: boolean;
    isInBottomSheet: boolean;
} & DataAnalyticsAttribute & React.RefAttributes<HTMLDivElement>>>;
export { ActionListBox, ActionListVirtualizedBox };
