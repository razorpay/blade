import type { GestureResponderEvent } from 'react-native';
import React from 'react';
import BaseButton from '../BaseButton';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import type { StringChildrenType } from '~src/_helpers/types';

type ButtonCommonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
  type?: 'button' | 'reset' | 'submit';
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
} & StyledPropsBlade;

/*
  Mandatory children prop when icon is not provided
  */
type ButtonWithoutIconProps = ButtonCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

/*
   Optional children prop when icon is provided
  */
type ButtonWithIconProps = ButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
};

export type ButtonProps = ButtonWithoutIconProps | ButtonWithIconProps;

const _Button: React.ForwardRefRenderFunction<BladeElementRef, ButtonProps> = (
  {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    onClick,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    accessibilityLabel,
    ...styledProps
  },
  ref,
) => {
  return (
    <BaseButton
      {...(icon ? { icon, children } : { children })}
      {...styledProps}
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
      isLoading={isLoading}
    />
  );
};

const Button = React.forwardRef(_Button);
Button.displayName = 'Button';

export default Button;
