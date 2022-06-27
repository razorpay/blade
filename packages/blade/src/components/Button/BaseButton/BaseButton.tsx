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
import type { DurationString, EasingString } from '../../../tokens/global/motion';
import type { Required, ValueOf } from '../../../_helpers/types';
import makeSize from '../../../utils/makeSize';
import StyledBaseButton from './StyledBaseButton';
import {
  typography as buttonTypography,
  minHeight as buttonMinHeight,
  iconSize as buttonIconSize,
  iconSpacing as buttonIconSpacing,
  spacing as buttonSpacing,
} from './buttonTokens';
import type { ButtonTypography, ButtonMinHeight } from './buttonTokens';

type BaseButtonCommonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary';
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

const ButtonText = styled(BaseText)(
  ({
    hasIcon,
    iconPosition,
    iconSpacing,
  }: Pick<BaseButtonProps, 'iconPosition'> & { hasIcon: boolean; iconSpacing: string }) => ({
    paddingLeft: hasIcon && iconPosition === 'left' ? iconSpacing : makeSpace(0),
    paddingRight: hasIcon && iconPosition === 'right' ? iconSpacing : makeSpace(0),
  }),
);

type BaseButtonStyleProps = {
  iconSize: IconSize;
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: `${ButtonMinHeight}px`;
  iconSpacing: `${ValueOf<Theme['spacing']>}px`;
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  spacing: `${ValueOf<Theme['spacing']>}px ${ValueOf<Theme['spacing']>}px`;
  text?: string;
  defaultBackgroundColor: string;
  defaultBorderColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  activeBackgroundColor: string;
  activeBorderColor: string;
  focusBackgroundColor: string;
  focusBorderColor: string;
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  borderWidth: `${ValueOf<Theme['border']['width']>}px`;
  borderRadius: `${ValueOf<Theme['border']['radius'], 'round'>}px`;
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
  size: Required<BaseButtonCommonProps['size']>;
  variant: Required<BaseButtonCommonProps['variant']>;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: buttonIconSize[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    iconSpacing: makeSpace(theme.spacing[buttonIconSpacing[size]]),
    iconColor: `action.icon.${variant}.default`,
    textColor: `action.text.${variant}.default`,
    spacing: `${makeSpace(theme.spacing[buttonSpacing[size].topBottom])} ${makeSpace(
      theme.spacing[buttonSpacing[size].rightLeft],
    )}`,
    text: size === 'xsmall' ? children?.trim().toUpperCase() : children?.trim(),
    defaultBackgroundColor: getIn(theme.colors, `action.background.${variant}.default`),
    defaultBorderColor: getIn(theme.colors, `action.border.${variant}.default`),
    hoverBackgroundColor: getIn(theme.colors, `action.background.${variant}.hover`),
    hoverBorderColor: getIn(theme.colors, `action.border.${variant}.hover`),
    activeBackgroundColor: getIn(theme.colors, `action.background.${variant}.active`),
    activeBorderColor: getIn(theme.colors, `action.border.${variant}.active`),
    focusBackgroundColor: getIn(theme.colors, `action.background.${variant}.focus`),
    focusBorderColor: getIn(theme.colors, `action.border.${variant}.focus`),
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.small),
    motionDuration: 'duration.xquick',
    motionEasing: 'easing.standard.effective',
  };

  if (isDisabled) {
    const disabledBackgroundColor = getIn(theme.colors, `action.background.${variant}.disabled`);
    const disabledBorderColor = getIn(theme.colors, `action.border.${variant}.disabled`);
    props.iconColor = `action.icon.${variant}.disabled`;
    props.textColor = `action.text.${variant}.disabled`;
    props.defaultBackgroundColor = disabledBackgroundColor;
    props.defaultBorderColor = disabledBorderColor;
    props.hoverBackgroundColor = disabledBackgroundColor;
    props.hoverBorderColor = disabledBorderColor;
    props.activeBackgroundColor = disabledBackgroundColor;
    props.activeBorderColor = disabledBorderColor;
    props.focusBackgroundColor = disabledBackgroundColor;
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
  const buttonTypographyTokens = buttonTypography[platform];
  if (!Icon && !children?.trim()) {
    throw new Error(
      `[Blade: BaseButton]: At least one of icon or text is required to render a button.`,
    );
  }
  const {
    activeBorderColor,
    activeBackgroundColor,
    defaultBorderColor,
    defaultBackgroundColor,
    minHeight,
    spacing,
    focusBorderColor,
    focusBackgroundColor,
    focusRingColor,
    fontSize,
    hoverBorderColor,
    hoverBackgroundColor,
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
      activeBackgroundColor={activeBackgroundColor}
      defaultBorderColor={defaultBorderColor}
      minHeight={minHeight}
      spacing={spacing}
      defaultBackgroundColor={defaultBackgroundColor}
      disabled={isDisabled}
      focusBorderColor={focusBorderColor}
      focusBackgroundColor={focusBackgroundColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      isFullWidth={isFullWidth}
      onClick={onClick}
      type={type}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
    >
      {Icon && iconPosition == 'left' ? <Icon size={iconSize} color={iconColor} /> : null}
      {text ? (
        <ButtonText
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
        </ButtonText>
      ) : null}
      {Icon && iconPosition == 'right' ? <Icon size={iconSize} color={iconColor} /> : null}
    </StyledBaseButton>
  );
};

export default BaseButton;
