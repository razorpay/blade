import type { ReactElement } from 'react';
import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import type { BaseTextProps } from '../../Typography/BaseText';
import BaseText from '../../Typography/BaseText';
import type { Theme } from '../../BladeProvider';
import { useTheme } from '../../BladeProvider';
import type { IconComponent, IconProps, IconSize } from '../../Icons';
import makeSpace from '../../../utils/makeSpace';
import type { TypographyPlatforms } from '../../../tokens/global/typography';
import makeBorderSize from '../../../utils/makeBorderSize';
import type { DurationStringTokens, EasingStringTokens } from '../../../tokens/global/motion';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonMinHeight, ButtonTypography } from './buttonTokens';
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
  iconSize: IconSize;
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: ButtonMinHeight;
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
  borderWidth: string;
  borderRadius: string;
  motionDuration: DurationStringTokens;
  motionEasing: EasingStringTokens;
};

const getProps = ({
  buttonTypographyTokens,
  children,
  isDisabled,
  size,
  theme,
  variant,
}: {
  buttonTypographyTokens: ButtonTypography[TypographyPlatforms];
  children?: string;
  isDisabled: boolean;
  theme: Theme;
  size: BaseButtonCommonProps['size'];
  variant: Exclude<BaseButtonCommonProps['variant'], undefined>;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: 'medium',
    fontSize: buttonTypographyTokens.fonts.size.medium,
    lineHeight: buttonTypographyTokens.lineHeights.medium,
    minHeight: '40px',
    iconSpacing: makeSpace(theme.spacing[2]),
    iconColor: `action.icon.${variant}.default`,
    textColor: `action.text.${variant}.default`,
    spacing: `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`,
    text: children?.trim(),
    color: getIn(theme.colors, `action.background.${variant}.default`),
    borderColor: getIn(theme.colors, `action.border.${variant}.default`),
    hoverColor: getIn(theme.colors, `action.background.${variant}.hover`),
    hoverBorderColor: getIn(theme.colors, `action.border.${variant}.hover`),
    activeColor: getIn(theme.colors, `action.background.${variant}.active`),
    activeBorderColor: getIn(theme.colors, `action.border.${variant}.active`),
    focusColor: getIn(theme.colors, `action.background.${variant}.focus`),
    focusBorderColor: getIn(theme.colors, `action.border.${variant}.focus`),
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.small),
    motionDuration: 'duration.xquick',
    motionEasing: 'easing.standard.effective',
  };

  switch (size) {
    case 'large':
      props.iconSize = 'medium';
      props.fontSize = buttonTypographyTokens.fonts.size.large;
      props.lineHeight = buttonTypographyTokens.lineHeights.large;
      props.minHeight = '48px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'medium':
      props.iconSize = 'medium';
      props.fontSize = buttonTypographyTokens.fonts.size.medium;
      props.lineHeight = buttonTypographyTokens.lineHeights.medium;
      props.minHeight = '40px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'small':
      props.iconSize = 'xsmall';
      props.fontSize = buttonTypographyTokens.fonts.size.small;
      props.lineHeight = buttonTypographyTokens.lineHeights.small;
      props.minHeight = '32px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[3])}`;
      break;
    case 'xsmall':
      props.iconSize = 'xsmall';
      props.fontSize = buttonTypographyTokens.fonts.size.xsmall;
      props.lineHeight = buttonTypographyTokens.lineHeights.xsmall;
      props.minHeight = '28px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[2])}`;
      props.text = children?.trim().toUpperCase();
      break;
    default:
  }

  if (isDisabled) {
    const disabledColor = getIn(theme.colors, `action.background.${variant}.disabled`);
    const disabledBorderColor = getIn(theme.colors, `action.border.${variant}.disabled`);
    props.iconColor = `action.icon.${variant}.disabled`;
    props.textColor = `action.text.${variant}.disabled`;
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
    borderWidth,
    borderRadius,
    motionDuration,
    motionEasing,
  } = getProps({
    buttonTypographyTokens,
    children,
    isDisabled,
    size,
    variant,
    theme,
  });
  console.log('unused props', {
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
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
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
