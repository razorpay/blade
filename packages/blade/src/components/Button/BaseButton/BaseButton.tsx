import type { ReactElement } from 'react';
import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import type { BaseTextProps } from '../../Typography/BaseText';
import BaseText from '../../Typography/BaseText';
import type { Theme } from '../../BladeProvider';
import { useTheme } from '../../BladeProvider';
import type { IconComponent, IconProps, IconSize } from '../../Icons';
import makeSpace from '../../../utils/makeSpace';
import StyledBaseButton from './StyledBaseButton';
import { typography } from './buttonTokens';

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
    iconSpacing,
  }: BaseTextProps &
    Pick<BaseButtonProps, 'iconPosition'> & { hasIcon: boolean; iconSpacing: string }) => ({
    paddingLeft: hasIcon && iconPosition === 'left' ? iconSpacing : '0px',
    paddingRight: hasIcon && iconPosition === 'right' ? iconSpacing : '0px',
  }),
);

type BaseButtonStyleProps = {
  iconSize: IconSize; // prop
  fontSize: keyof Theme['typography']['fonts']['size']; // prop
  lineHeight: keyof Theme['typography']['lineHeights']; // prop
  minHeight: '48px' | '40px' | '32px' | '28px'; // raw value
  iconSpacing: string; // raw value
  iconColor: IconProps['color']; // prop
  textColor: BaseTextProps['color']; // prop
  spacing: string; // raw value
  text?: string;
};

const getProps = ({
  theme,
  size,
  children,
  buttonTypographyTokens,
}: {
  theme: Theme;
  size: BaseButtonCommonProps['size'];
  children?: string;
  buttonTypographyTokens: typeof typography.onDesktop | typeof typography.onMobile;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: 'medium',
    fontSize: buttonTypographyTokens.fonts.size.medium,
    lineHeight: buttonTypographyTokens.lineHeight.medium,
    minHeight: '40px',
    iconSpacing: makeSpace(theme.spacing[2]),
    iconColor: 'action.icon.primary.default',
    textColor: 'action.text.primary.default',
    spacing: `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`,
    text: children?.trim(),
  };

  switch (size) {
    case 'large':
      props.iconSize = 'medium';
      props.fontSize = buttonTypographyTokens.fonts.size.large;
      props.lineHeight = buttonTypographyTokens.lineHeight.large;
      props.minHeight = '48px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'medium':
      props.iconSize = 'medium';
      props.fontSize = buttonTypographyTokens.fonts.size.medium;
      props.lineHeight = buttonTypographyTokens.lineHeight.medium;
      props.minHeight = '40px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'small':
      props.iconSize = 'xsmall';
      props.fontSize = buttonTypographyTokens.fonts.size.small;
      props.lineHeight = buttonTypographyTokens.lineHeight.small;
      props.minHeight = '32px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[3])}`;
      break;
    case 'xsmall':
      props.iconSize = 'xsmall';
      props.fontSize = buttonTypographyTokens.fonts.size.xsmall;
      props.lineHeight = buttonTypographyTokens.lineHeight.xsmall;
      props.minHeight = '28px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[2])}`;
      props.text = children?.trim().toUpperCase();
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
  const { theme, platform } = useTheme();
  const buttonTypographyTokens = typography[platform];
  const color = getIn(theme.colors, 'action.background.primary.default');
  const hoverColor = getIn(theme.colors, 'action.background.primary.hover');
  const activeColor = getIn(theme.colors, 'action.background.primary.active');
  if (!Icon && !children?.trim()) {
    throw new Error(`[Blade: BaseButton]: Cannot render a BaseButton without an icon or text`);
  }
  const {
    iconSize,
    fontSize,
    lineHeight,
    minHeight,
    iconColor,
    iconSpacing,
    textColor,
    spacing,
    text,
  } = getProps({
    theme,
    size,
    children,
    buttonTypographyTokens,
  });
  console.log('unused props', {
    variant,
    intent,
    contrast,
    isDisabled,
    isFullWidth,
    onClick,
    type,
  });
  return (
    <StyledBaseButton
      color={color}
      hoverColor={hoverColor}
      onClick={(): void => {
        console.log('clicked');
      }}
      disabled={isDisabled}
      activeColor={activeColor}
      minHeight={minHeight}
      spacing={spacing}
    >
      {Icon && iconPosition == 'left' ? <Icon size={iconSize} color={iconColor} /> : null}
      {text && (
        <StyledBaseText
          lineHeight={lineHeight}
          fontSize={fontSize}
          fontWeight="bold"
          textAlign="center"
          color={textColor}
          iconPosition={iconPosition}
          hasIcon={!!Icon}
          iconSpacing={iconSpacing}
        >
          {text}
        </StyledBaseText>
      )}
      {Icon && iconPosition == 'right' ? <Icon size={iconSize} color={iconColor} /> : null}
    </StyledBaseButton>
  );
};

export default BaseButton;
