import type { GestureResponderEvent } from 'react-native';
import React from 'react';
import BaseButton from '../BaseButton';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';

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
};

/*
  Mandatory children prop when icon is not provided
  */
type ButtonWithoutIconProps = ButtonCommonProps & {
  icon?: undefined;
  children: string;
};

/*
   Optional children prop when icon is provided
  */
type ButtonWithIconProps = ButtonCommonProps & {
  icon: IconComponent;
  children?: string;
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
  },
  ref,
) => {
  const buttonRef = useBladeInnerRef(ref);

  return (
    <BaseButton
      {...(icon ? { icon, children } : { children })}
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
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
