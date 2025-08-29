import { SyntheticEvent, default as React } from 'react';
import { BaseLinkProps } from '../BaseLink';
import { IconComponent } from '../../Icons';
import { StyledPropsBlade } from '../../Box/styledProps';
import { StringChildrenType, TestID, BladeElementRef, DataAnalyticsAttribute } from '../../../utils/types';
import { Platform } from '../../../utils';
import { BladeCommonEvents } from '../../types';
type LinkCommonProps = {
    variant?: 'anchor' | 'button';
    icon?: IconComponent;
    color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
    iconPosition?: 'left' | 'right';
    isDisabled?: boolean;
    onClick?: (event: SyntheticEvent) => void;
    href?: string;
    target?: string;
    accessibilityLabel?: string;
    /**
     * It is exposed for internal usage with tooltip.
     *
     * @private
     */
    'aria-describedby'?: string;
    /**
     * Sets the size of the link
     *
     * @default medium
     */
    size?: BaseLinkProps['size'];
} & TestID & StyledPropsBlade & BladeCommonEvents & Platform.Select<{
    native: {
        /**
         * Defines how far your touch can start away from the link
         */
        hitSlop?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        } | number;
        /**
         * This is a web only prop and has no effect on react-native.
         */
        htmlTitle?: undefined;
    };
    web: {
        /**
         * This is a react-native only prop and has no effect on web.
         */
        hitSlop?: undefined;
        /**
         * The title of the link which is displayed as a tooltip.
         */
        htmlTitle?: string;
    };
}>;
type LinkWithoutIconProps = LinkCommonProps & {
    icon?: undefined;
    children: StringChildrenType;
};
type LinkWithIconProps = LinkCommonProps & {
    icon: IconComponent;
    children?: StringChildrenType;
};
type LinkPropsWithOrWithoutIcon = LinkWithIconProps | LinkWithoutIconProps;
type LinkAnchorVariantProps = LinkPropsWithOrWithoutIcon & {
    variant?: 'anchor';
    href?: string;
    target?: string;
    rel?: string;
    isDisabled?: undefined;
} & DataAnalyticsAttribute;
export type LinkButtonVariantProps = LinkPropsWithOrWithoutIcon & {
    variant?: 'button';
    isDisabled?: boolean;
    href?: undefined;
    target?: undefined;
    rel?: undefined;
} & DataAnalyticsAttribute;
export type LinkProps = LinkAnchorVariantProps | LinkButtonVariantProps;
declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<BladeElementRef>>;
export default Link;
