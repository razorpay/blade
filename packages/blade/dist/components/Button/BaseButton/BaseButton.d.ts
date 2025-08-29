import { default as React } from 'react';
import { GestureResponderEvent } from 'react-native';
import { DotNotationToken } from '../../../utils/lodashButBetter/get';
import { BaseLinkProps } from '../../Link/BaseLink';
import { Theme } from '../../BladeProvider';
import { IconComponent } from '../../Icons';
import { Platform } from '../../../utils';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BaseBoxProps } from '../../Box/BaseBox';
import { BladeElementRef, DataAnalyticsAttribute, StringChildrenType, TestID } from '../../../utils/types';
import { AccessibilityProps } from '../../../utils/makeAccessible';
import { BladeCommonEvents } from '../../types';
type BaseButtonCommonProps = {
    href?: BaseLinkProps['href'];
    target?: BaseLinkProps['target'];
    rel?: BaseLinkProps['rel'];
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    id?: string;
    tabIndex?: BaseBoxProps['tabIndex'];
    iconPosition?: 'left' | 'right';
    isDisabled?: boolean;
    isFullWidth?: boolean;
    onKeyDown?: Platform.Select<{
        native: (event: GestureResponderEvent) => void;
        web: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    }>;
    onClick?: Platform.Select<{
        native: (event: GestureResponderEvent) => void;
        web: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }>;
    type?: 'button' | 'reset' | 'submit';
    isLoading?: boolean;
    accessibilityProps?: Partial<AccessibilityProps>;
    variant?: 'primary' | 'secondary' | 'tertiary';
    color?: 'primary' | 'white' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral' | 'transparent';
} & TestID & StyledPropsBlade & BladeCommonEvents;
type BaseButtonWithoutIconProps = BaseButtonCommonProps & {
    icon?: undefined;
    children: StringChildrenType;
} & DataAnalyticsAttribute;
type BaseButtonWithIconProps = BaseButtonCommonProps & {
    icon: IconComponent;
    children?: StringChildrenType;
} & DataAnalyticsAttribute;
export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;
type BaseButtonColorTokenModifiers = {
    variant: NonNullable<BaseButtonProps['variant']>;
    state: 'default' | 'hover' | 'focus' | 'disabled';
    color: BaseButtonProps['color'];
};
export declare const getBackgroundColorToken: ({ property, variant, state, color, }: BaseButtonColorTokenModifiers & {
    property: 'background' | 'border';
}) => DotNotationToken<Theme['colors']>;
export declare const getTextColorToken: ({ property, variant, state, color, }: BaseButtonColorTokenModifiers & {
    property: 'icon' | 'text';
}) => DotNotationToken<Theme['colors']>;
declare const BaseButton: React.ForwardRefExoticComponent<BaseButtonProps & React.RefAttributes<BladeElementRef>>;
export default BaseButton;
