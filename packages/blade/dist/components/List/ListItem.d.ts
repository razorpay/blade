import { default as React } from 'react';
import { ListProps } from './List';
import { IconComponent } from '../Icons';
import { TestID } from '../../utils/types';
type ListItemProps = {
    /**
     * Children to be rendered for ListItem. This can be a text, ListItemLink or another List.
     *
     */
    children: React.ReactNode;
    /**
     * Icon to be rendered for a ListItem's bullet.
     *
     */
    icon?: IconComponent;
    /**
     * Icon color of the ListItem's bullet.
     *
     */
    iconColor?: ListProps['iconColor'];
    /**
     * This is a private prop to be used only for internal logic purposes.
     *
     */
    _itemNumber?: undefined;
} & TestID;
declare const ListItem: ({ children, icon: Icon, iconColor: listItemIconColor, _itemNumber, testID, }: ListItemProps) => React.ReactElement;
export { ListItem };
export type { ListItemProps };
