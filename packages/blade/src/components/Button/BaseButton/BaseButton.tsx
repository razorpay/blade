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
import makeSize from '../../../utils/makeSize';
import type {
  BorderRadiusValues,
  BorderWidthValues,
  SpacingValues,
} from '../../../tokens/theme/theme.d';
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
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit';
};

/*
Mandatory children prop when icon is not provided
*/
type BaseButtonWithoutIconProps = BaseButtonCommonProps & {
  icon?: undefined;
  children: string;
};

/*
 Optional children prop when icon is provided
*/
type BaseButtonWithIconProps = BaseButtonCommonProps & {
  icon: IconComponent;
  children?: string;
};

/*
 With or without icon prop. We need at least an icon or a children prop present.
*/
type BaseButtonPropsWithOrWithoutIconProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;

/*
 With a variant prop along with or without an icon prop.
*/
type BaseButtonWithVariantProps = BaseButtonPropsWithOrWithoutIconProps & {
  variant?: 'primary' | 'secondary' | 'tertiary';
  intent?: undefined;
  contrast?: undefined;
};

/*
 With an intent & contrast prop along with or without an icon prop.
*/
type BaseButtonWithIntentProps = BaseButtonPropsWithOrWithoutIconProps & {
  intent?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  variant?: undefined;
};

/* 
 We restrict using variant when intent or contrast is provided and 
 we restrict using intent & contrast when variant is provided.
*/
export type BaseButtonProps = BaseButtonWithVariantProps | BaseButtonWithIntentProps;

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

type ColorTokenConfig = {
  property: 'background' | 'border' | 'text' | 'icon';
  variant: NonNullable<BaseButtonProps['variant']>;
  state: 'default' | 'hover' | 'active' | 'focus' | 'disabled';
  intent: BaseButtonProps['intent'];
  contrast: BaseButtonProps['contrast'];
};

const getColorToken = ({
  property,
  variant,
  state,
  contrast,
  intent,
}: ColorTokenConfig):
  | `action.${ColorTokenConfig['property']}.${ColorTokenConfig['variant']}.${ColorTokenConfig['state']}`
  | `feedback.${NonNullable<
      ColorTokenConfig['intent']
    >}.action.${ColorTokenConfig['property']}.primary.${ColorTokenConfig['state']}.${NonNullable<
      ColorTokenConfig['contrast']
    >}Contrast` => {
  if (intent && contrast) {
    return `feedback.${intent}.action.${property}.primary.${state}.${contrast}Contrast`;
  }
  return `action.${property}.${variant}.${state}`;
};

type BaseButtonStyleProps = {
  iconSize: IconSize;
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: `${ButtonMinHeight}px`;
  iconSpacing: SpacingValues;
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  spacing: `${SpacingValues} ${SpacingValues}`;
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
  borderWidth: BorderWidthValues;
  borderRadius: BorderRadiusValues;
};

const getProps = ({
  buttonTypographyTokens,
  children,
  isDisabled,
  size,
  theme,
  variant,
  intent,
  contrast,
}: {
  buttonTypographyTokens: ButtonTypography[TypographyPlatforms];
  children?: string;
  isDisabled: boolean;
  theme: Theme;
  size: NonNullable<BaseButtonProps['size']>;
  variant: NonNullable<BaseButtonProps['variant']>;
  intent: BaseButtonProps['intent'];
  contrast: NonNullable<BaseButtonProps['contrast']>;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: buttonIconSize[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    iconSpacing: makeSpace(theme.spacing[buttonIconSpacing[size]]),
    iconColor: getColorToken({
      property: 'icon',
      variant,
      contrast,
      intent,
      state: 'default',
    }) as IconProps['color'],
    textColor: getColorToken({
      property: 'text',
      variant,
      contrast,
      intent,
      state: 'default',
    }) as BaseTextProps['color'],
    spacing: `${makeSpace(theme.spacing[buttonSpacing[size].topBottom])} ${makeSpace(
      theme.spacing[buttonSpacing[size].rightLeft],
    )}`,
    text: size === 'xsmall' ? children?.trim().toUpperCase() : children?.trim(),
    defaultBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'default' }),
    ),
    defaultBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'default' }),
    ),
    hoverBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'hover' }),
    ),
    hoverBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'hover' }),
    ),
    activeBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'active' }),
    ),
    activeBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'active' }),
    ),
    focusBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'focus' }),
    ),
    focusBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'focus' }),
    ),
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.small),
    motionDuration: 'duration.xquick',
    motionEasing: 'easing.standard.effective',
  };

  if (isDisabled) {
    const disabledBackgroundColor = getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'disabled' }),
    );
    const disabledBorderColor = getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'disabled' }),
    );
    props.iconColor = getColorToken({
      property: 'icon',
      variant,
      contrast,
      intent,
      state: 'disabled',
    }) as IconProps['color'];
    props.textColor = getColorToken({
      property: 'text',
      variant,
      contrast,
      intent,
      state: 'disabled',
    }) as BaseTextProps['color'];
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
