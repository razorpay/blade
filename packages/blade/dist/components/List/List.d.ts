import { default as React } from 'react';
import { ListItemProps } from './ListItem';
import { IconComponent, IconProps } from '../Icons';
import { BladeElementRef, TestID } from '../../utils/types';
import { StyledPropsBlade } from '../Box/styledProps';
type ListCommonProps = {
    /**
     * ListItem to be rendered for the List.
     *
     */
    children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
    /**
     * Sets the variant to be rendered for the List.
     *
     * @default 'unordered'
     */
    variant?: 'unordered' | 'ordered' | 'ordered-filled';
    /**
     * Sets the size for the List.
     *
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large';
} & TestID & StyledPropsBlade;
type ListWithIconProps = ListCommonProps & {
    variant?: 'unordered';
    icon?: IconComponent;
    iconColor?: IconProps['color'];
};
type ListWithoutIconProps = ListCommonProps & {
    variant?: 'ordered' | 'ordered-filled';
    icon?: undefined;
    iconColor?: undefined;
};
type ListProps = ListWithIconProps | ListWithoutIconProps;
declare const List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<BladeElementRef>>;
export { List };
export type { ListProps };
