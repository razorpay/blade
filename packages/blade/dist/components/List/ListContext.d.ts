import { default as React } from 'react';
import { ListProps } from './List';
import { IconComponent } from '../Icons';
export type ListContextType = {
    level?: number;
    size: NonNullable<ListProps['size']>;
    icon?: IconComponent;
    iconColor?: ListProps['iconColor'];
    variant: NonNullable<ListProps['variant']>;
};
declare const ListProvider: React.Provider<ListContextType>;
declare const useListContext: () => ListContextType;
export { useListContext, ListProvider };
