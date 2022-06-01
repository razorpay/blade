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
    Pick<BaseButtonProps, 'iconPosition'> & { hasIcon: boolean; iconSpacing: string }) => `
    padding-left: ${hasIcon && iconPosition === 'left' ? iconSpacing : 0};
    padding-right: ${hasIcon && iconPosition === 'right' ? iconSpacing : 0};
`,
);

type BaseButtonStyleProps = {
  iconSize: IconSize;
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: '48px' | '40px' | '32px' | '28px';
  iconSpacing: string;
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  spacing: string;
  text?: string;
  color: string;
  borderColor: string;
  hoverColor: string;
  hoverBorderColor: string;
  activeColor: string;
  activeBorderColor: string;
  focusColor: string;
  focusBorderColor: string;
  focusRingColor: string;
};

const getProps = ({
  buttonTypographyTokens,
  children,
  isDisabled,
  size,
  theme,
}: {
  buttonTypographyTokens: typeof typography.onDesktop | typeof typography.onMobile;
  children?: string;
  isDisabled: boolean;
  theme: Theme;
  size: BaseButtonCommonProps['size'];
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: 'medium',
    fontSize: buttonTypographyTokens.fonts.size.medium,
    lineHeight: buttonTypographyTokens.lineHeights.medium,
    minHeight: '40px',
    iconSpacing: makeSpace(theme.spacing[2]),
    iconColor: 'action.icon.primary.default',
    textColor: 'action.text.primary.default',
    spacing: `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])} ${makeSpace(
      theme.spacing[0],
    )} ${makeSpace(theme.spacing[5])}`,
    text: children?.trim(),
    color: getIn(theme.colors, 'action.background.primary.default'),
    borderColor: getIn(theme.colors, 'action.border.primary.default'),
    hoverColor: getIn(theme.colors, 'action.background.primary.hover'),
    hoverBorderColor: getIn(theme.colors, 'action.border.primary.hover'),
    activeColor: getIn(theme.colors, 'action.background.primary.active'),
    activeBorderColor: getIn(theme.colors, 'action.border.primary.active'),
    focusColor: getIn(theme.colors, 'action.background.primary.focus'),
    focusBorderColor: getIn(theme.colors, 'action.border.primary.focus'),
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
  };

  switch (size) {
    case 'large':
      props.iconSize = 'medium';
      props.fontSize = buttonTypographyTokens.fonts.size.large;
      props.lineHeight = buttonTypographyTokens.lineHeights.large;
      props.minHeight = '48px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])} ${makeSpace(
        theme.spacing[0],
      )} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'medium':
      props.iconSize = 'medium';
      props.fontSize = buttonTypographyTokens.fonts.size.medium;
      props.lineHeight = buttonTypographyTokens.lineHeights.medium;
      props.minHeight = '40px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])} ${makeSpace(
        theme.spacing[0],
      )} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'small':
      props.iconSize = 'xsmall';
      props.fontSize = buttonTypographyTokens.fonts.size.small;
      props.lineHeight = buttonTypographyTokens.lineHeights.small;
      props.minHeight = '32px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[3])} ${makeSpace(
        theme.spacing[0],
      )} ${makeSpace(theme.spacing[3])}`;
      break;
    case 'xsmall':
      props.iconSize = 'xsmall';
      props.fontSize = buttonTypographyTokens.fonts.size.xsmall;
      props.lineHeight = buttonTypographyTokens.lineHeights.xsmall;
      props.minHeight = '28px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[2])} ${makeSpace(
        theme.spacing[0],
      )} ${makeSpace(theme.spacing[2])}`;
      props.text = children?.trim().toUpperCase();
      break;
    default:
  }

  if (isDisabled) {
    const disabledColor = getIn(theme.colors, 'action.background.primary.disabled');
    const disabledBorderColor = getIn(theme.colors, 'action.border.primary.disabled');
    props.iconColor = 'action.icon.primary.disabled';
    props.textColor = 'action.text.primary.disabled';
    props.color = disabledColor;
    props.borderColor = disabledBorderColor;
    props.hoverColor = disabledColor;
    props.hoverBorderColor = disabledBorderColor;
    props.activeColor = disabledColor;
    props.activeBorderColor = disabledBorderColor;
    props.focusColor = disabledColor;
    props.focusBorderColor = disabledBorderColor;
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
  if (!Icon && !children?.trim()) {
    throw new Error(`[Blade: BaseButton]: Cannot render a BaseButton without an icon or text`);
  }
  const {
    activeBorderColor,
    activeColor,
    borderColor,
    color,
    minHeight,
    spacing,
    focusBorderColor,
    focusColor,
    focusRingColor,
    fontSize,
    hoverBorderColor,
    hoverColor,
    iconColor,
    iconSize,
    iconSpacing,
    lineHeight,
    text,
    textColor,
  } = getProps({
    buttonTypographyTokens,
    children,
    isDisabled,
    size,
    theme,
  });
  console.log('unused props', {
    variant,
    intent,
    contrast,
  });
  return (
    <StyledBaseButton
      activeBorderColor={activeBorderColor}
      activeColor={activeColor}
      borderColor={borderColor}
      minHeight={minHeight}
      spacing={spacing}
      color={color}
      disabled={isDisabled}
      focusBorderColor={focusBorderColor}
      focusColor={focusColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      hoverColor={hoverColor}
      isFullWidth={isFullWidth}
      onClick={onClick}
      type={type}
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
