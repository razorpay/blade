import type { GestureResponderEvent } from 'react-native';
import React from 'react';
import BaseButton from '../BaseButton';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import type { StringChildrenType } from '~src/_helpers/types';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

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
  },
  ref,
) => {
  return (
    <BaseButton
      {...(icon ? { icon, children } : { children })}
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

const Button = assignWithoutSideEffects(React.forwardRef(_Button), { displayName: 'Button' });

export default Button;
