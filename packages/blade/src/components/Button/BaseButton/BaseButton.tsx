import type { ReactElement } from 'react';
import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import type { BaseTextProps } from '../../Typography/BaseText';
import BaseText from '../../Typography/BaseText';
import type { Theme } from '../../BladeProvider';
import { useTheme } from '../../BladeProvider';
import type { IconComponent, IconProps, IconSize } from '../../Icons';
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

export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;

const StyledBaseText = styled(BaseText)(
  ({
    hasIcon,
    iconPosition,
  }: BaseTextProps & Pick<BaseButtonProps, 'iconPosition'> & { hasIcon: boolean }) => `
    padding-left: ${hasIcon && iconPosition === 'left' ? '8px' : '0px'};
    padding-right: ${hasIcon && iconPosition === 'right' ? '8px' : '0px'};
`,
);

type ConfigProps = {
  iconSize: IconSize;
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  buttonHeight: '48px' | '40px' | '32px' | '28px';
  iconSpacing: keyof Theme['spacing'];
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
};

const getProps = ({ size }: { size: BaseButtonCommonProps['size'] }): ConfigProps => {
  const props: ConfigProps = {
    iconSize: 'medium',
    fontSize: 200,
    lineHeight: 's',
    buttonHeight: '48px',
    iconSpacing: 1,
    iconColor: 'action.icon.primary.default',
    textColor: 'action.text.primary.default',
  };

  switch (size) {
    case 'large':
      props.iconSize = 'medium';
      props.fontSize = 200;
      props.lineHeight = 's';
      props.buttonHeight = '48px';
      props.iconSpacing = 1;
      props.iconColor = 'action.icon.primary.default';
      break;
    default:
  }

  return props;
};

const BaseButton = ({
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
}: BaseButtonProps): ReactElement => {
  const { theme } = useTheme();
  const buttonColor = getIn(theme.colors, 'action.background.primary.default');
  const hoverColor = getIn(theme.colors, 'action.background.primary.hover');
  const activeColor = getIn(theme.colors, 'action.background.primary.active');
  if (!Icon && !children) {
    throw new Error(`[Blade: BaseButton]: Cannot render a BaseButton without an icon or text`);
  }
  const { iconSize, fontSize, lineHeight, buttonHeight, iconColor, textColor } = getProps({ size });
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
      buttonHeight={buttonHeight}
    >
      {Icon && iconPosition == 'left' ? <Icon size={iconSize} color={iconColor} /> : null}
      <StyledBaseText
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight="bold"
        textAlign="center"
        color={textColor}
        iconPosition={iconPosition}
        hasIcon={!!Icon}
      >
        {children}
      </StyledBaseText>
      {Icon && iconPosition == 'right' ? <Icon size="small" color={iconColor} /> : null}
    </StyledBaseButton>
  );
};

export default BaseButton;
