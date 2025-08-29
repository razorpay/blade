import { SyntheticEvent, default as React } from 'react';
import { GestureResponderEvent } from 'react-native';
import { IconComponent } from '../../Icons';
import { StringChildrenType, TestID, BladeElementRef } from '../../../utils/types';
import { Platform } from '../../../utils';
import { BaseTextSizes } from '../../Typography/BaseText/types';
import { StyledPropsBlade } from '../../Box/styledProps';
import { AccessibilityProps } from '../../../utils/makeAccessible';
import { BladeCommonEvents } from '../../types';
type BaseLinkCommonProps = {
    color?: 'primary' | 'white' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
    icon?: IconComponent;
    iconPosition?: 'left' | 'right';
    onClick?: (event: SyntheticEvent) => void;
    onBlur?: Platform.Select<{
        native: (event: GestureResponderEvent) => void;
        web: (event: React.FocusEvent<HTMLButtonElement>) => void;
    }>;
    onMouseLeave?: Platform.Select<{
        native: (event: GestureResponderEvent) => void;
        web: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }>;
    onKeyDown?: Platform.Select<{
        native: (event: GestureResponderEvent) => void;
        web: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    }>;
    accessibilityProps?: Partial<AccessibilityProps>;
    /**
     * Sets the size of the link
     *
     * @default medium
     */
    size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
    /**
     * Defines how far your touch can start away from the link. This is a react-native only prop and has no effect on web.
     */
    hitSlop?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    } | number;
    /**
     * The title of the link which is displayed as a tooltip. This is a web only prop and has no effect on react-native.
     */
    htmlTitle?: string;
    opacity?: number;
} & TestID & StyledPropsBlade & Omit<BladeCommonEvents, 'onBlur' | 'onMouseLeave'>;
type BaseLinkWithoutIconProps = BaseLinkCommonProps & {
    icon?: undefined;
    children: StringChildrenType;
};
type BaseLinkWithIconProps = BaseLinkCommonProps & {
    icon: IconComponent;
    children?: StringChildrenType;
};
type BaseLinkPropsWithOrWithoutIcon = BaseLinkWithIconProps | BaseLinkWithoutIconProps;
type BaseLinkAnchorVariantProps = BaseLinkPropsWithOrWithoutIcon & {
    variant?: 'anchor';
    href?: string;
    target?: string;
    rel?: string;
    isDisabled?: undefined;
};
type BaseLinkButtonVariantProps = BaseLinkPropsWithOrWithoutIcon & {
    variant?: 'button';
    isDisabled?: boolean;
    href?: undefined;
    target?: undefined;
    rel?: undefined;
};
export type BaseLinkProps = BaseLinkAnchorVariantProps | BaseLinkButtonVariantProps;
declare const BaseLink: React.ForwardRefExoticComponent<BaseLinkProps & React.RefAttributes<BladeElementRef>>;
export default BaseLink;
