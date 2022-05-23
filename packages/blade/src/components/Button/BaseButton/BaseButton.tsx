import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import BaseText from '../../Typography/BaseText';
import { useTheme } from '../../BladeProvider';
import type { IconProps } from '../../Icons';
import StyledBaseButton from './StyledBaseButton';

export type BaseButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  intent?: 'positive' | 'negative' | 'notice' | 'info' | 'neutral';
  contrast?: 'low' | 'high';
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  icon?: React.ComponentType<IconProps>;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit';
  children?: string;
};

const BaseButton = ({
  variant = 'primary',
  intent,
  contrast = 'low',
  size = 'medium',
  icon,
  iconPosition = 'left',
  isDisabled = false,
  isFullWidth = false,
  onClick,
  type = 'button',
  children,
}: BaseButtonProps): ReactElement => {
  const { theme } = useTheme();
  const buttonColor = getIn(theme.colors, 'action.background.primary.default');
  const hoverColor = getIn(theme.colors, 'action.background.primary.hover');
  const activeColor = getIn(theme.colors, 'action.background.primary.active');
  const IconComponent = icon;
  console.log('props', {
    variant,
    intent,
    contrast,
    size,
    icon,
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
      {IconComponent ? <IconComponent size="small" color="action.icon.primary.default" /> : null}
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
