import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import BaseText from '../../Typography/BaseText';
import { useTheme } from '../../BladeProvider';
import type { IconComponent } from '../../Icons';
import StyledBaseButton from './StyledBaseButton';

export type BaseButtonIcon = undefined | null | IconComponent;

type BaseButtonCommonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  intent?: 'positive' | 'negative' | 'notice' | 'info' | 'neutral';
  contrast?: 'low' | 'high';
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit';
};

type BaseButtonWithoutIconProps = BaseButtonCommonProps & {
  icon?: undefined;
  children: string;
};

type BaseButtonWithIconProps = BaseButtonCommonProps & {
  icon: IconComponent;
  children?: string;
};

export type BaseButtonProps<T> = T extends {
  icon?: infer Icon;
}
  ? Icon extends Extract<BaseButtonIcon, IconComponent>
    ? BaseButtonWithIconProps
    : Icon extends Extract<BaseButtonIcon, undefined | null>
    ? BaseButtonWithoutIconProps
    : T
  : T;

const BaseButton = <T extends { icon: BaseButtonIcon }>({
  variant = 'primary',
  intent,
  contrast = 'low',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  isDisabled = false,
  isFullWidth = false,
  onClick,
  type = 'button',
  children,
}: BaseButtonProps<T>): ReactElement => {
  const { theme } = useTheme();
  const buttonColor = getIn(theme.colors, 'action.background.primary.default');
  const hoverColor = getIn(theme.colors, 'action.background.primary.hover');
  const activeColor = getIn(theme.colors, 'action.background.primary.active');
  console.log('props', {
    variant,
    intent,
    contrast,
    size,
    Icon,
    iconPosition,
    isDisabled,
    isFullWidth,
    onClick,
    type,
    children,
  });
  return (
    <StyledBaseButton
      color={buttonColor}
      hoverColor={hoverColor}
      onClick={(): void => {
        console.log('clicked');
      }}
      disabled={isDisabled}
      activeColor={activeColor}
    >
      {Icon ? <Icon size="small" color="action.icon.primary.default" /> : null}
      <BaseText
        lineHeight="s"
        fontSize={100}
        fontWeight="bold"
        textAlign="center"
        color="action.text.primary.default"
      >
        {children}
      </BaseText>
    </StyledBaseButton>
  );
};

export default BaseButton;
