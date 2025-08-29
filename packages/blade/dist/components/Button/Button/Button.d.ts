import { GestureResponderEvent } from 'react-native';
import { default as React } from 'react';
import { BaseButtonProps } from '../BaseButton/BaseButton';
import { IconComponent } from '../../Icons';
import { Platform } from '../../../utils';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BladeElementRef, DataAnalyticsAttribute, StringChildrenType, TestID } from '../../../utils/types';
import { BladeCommonEvents } from '../../types';
import { AriaRoles } from '../../../utils/makeAccessible';
type ButtonCommonProps = {
    /**
     * Automatically renders button with `a` tag with `href` on web
     */
    href?: BaseButtonProps['href'];
    /**
     * anchor target attribute
     *
     * Should only be used alongside `href`
     */
    target?: BaseButtonProps['target'];
    /**
     * anchor rel attribute
     *
     * Should only be used alongside `href`
     */
    rel?: BaseButtonProps['rel'];
    variant?: 'primary' | 'secondary' | 'tertiary';
    color?: 'primary' | 'white' | 'positive' | 'negative';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    iconPosition?: 'left' | 'right';
    isDisabled?: boolean;
    isFullWidth?: boolean;
    isLoading?: boolean;
    accessibilityLabel?: string;
    type?: 'button' | 'reset' | 'submit';
    /**
     * It is exposed for internal usage with tooltip.
     *
     * @private
     */
    'aria-describedby'?: string;
    /**
     * It is exposed for internal usage with menu.
     *
     * @private
     */
    'aria-controls'?: string;
    /**
     * It is exposed for internal usage with menu.
     *
     * @private
     */
    'aria-expanded'?: boolean;
    /**
     * It is exposed for internal usage with menu.
     *
     * @private
     */
    'aria-haspopup'?: 'menu';
    /**
     * It is exposed for internal usage with menu.
     *
     * @private
     */
    role?: AriaRoles;
    tabIndex?: BaseButtonProps['tabIndex'];
    onClick?: Platform.Select<{
        native: (event: GestureResponderEvent) => void;
        web: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }>;
} & TestID & StyledPropsBlade & DataAnalyticsAttribute & BladeCommonEvents;
type ButtonWithoutIconProps = ButtonCommonProps & {
    icon?: undefined;
    children: StringChildrenType;
};
type ButtonWithIconProps = ButtonCommonProps & {
    icon: IconComponent;
    children?: StringChildrenType;
};
export type ButtonProps = ButtonWithoutIconProps | ButtonWithIconProps;
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<BladeElementRef>>;
export default Button;
