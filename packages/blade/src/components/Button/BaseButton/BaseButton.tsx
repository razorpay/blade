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
  textPadding,
  buttonPadding,
} from './buttonTokens';
import type { ButtonTypography, ButtonMinHeight } from './buttonTokens';

type BaseButtonCommonProps = {
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit';
  variant?: 'primary' | 'secondary' | 'tertiary';
  contrast?: 'low' | 'high';
  intent?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
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
export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;

const ButtonText = styled(BaseText)<{
  paddingLeft: SpacingValues;
  paddingRight: SpacingValues;
}>(({ paddingLeft, paddingRight }) => ({
  paddingLeft,
  paddingRight,
}));

type BaseButtonColorTokenModifiers = {
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
}: BaseButtonColorTokenModifiers):
  | `action.${BaseButtonColorTokenModifiers['property']}.${BaseButtonColorTokenModifiers['variant']}.${BaseButtonColorTokenModifiers['state']}`
  | `feedback.${NonNullable<
      BaseButtonColorTokenModifiers['intent']
    >}.action.${BaseButtonColorTokenModifiers['property']}.primary.${BaseButtonColorTokenModifiers['state']}.${NonNullable<
      BaseButtonColorTokenModifiers['contrast']
    >}Contrast` => {
  if (intent && contrast) {
    // TODO: Add support for secondary & tertiary variants for feedback buttons here when a use-case is identified
    return `feedback.${intent}.action.${property}.primary.${state}.${contrast}Contrast`;
  }
  return `action.${property}.${variant}.${state}`;
};

type BaseButtonStyleProps = {
  iconSize: IconSize;
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: `${ButtonMinHeight}px`;
  textPaddingLeft: SpacingValues;
  textPaddingRight: SpacingValues;
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  buttonPaddingTop: SpacingValues;
  buttonPaddingBottom: SpacingValues;
  buttonPaddingLeft: SpacingValues;
  buttonPaddingRight: SpacingValues;
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
  hasIcon,
  iconPosition,
}: {
  buttonTypographyTokens: ButtonTypography[TypographyPlatforms];
  children?: string;
  isDisabled: boolean;
  hasIcon: boolean;
  theme: Theme;
  size: NonNullable<BaseButtonProps['size']>;
  variant: NonNullable<BaseButtonProps['variant']>;
  intent: BaseButtonProps['intent'];
  contrast: NonNullable<BaseButtonProps['contrast']>;
  iconPosition: NonNullable<BaseButtonProps['iconPosition']>;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: buttonIconSize[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    textPaddingLeft: makeSpace(
      hasIcon && iconPosition === 'left' ? theme.spacing[textPadding[size]] : 0,
    ),
    textPaddingRight: makeSpace(
      hasIcon && iconPosition === 'right' ? theme.spacing[textPadding[size]] : 0,
    ),
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
    buttonPaddingTop: makeSpace(theme.spacing[buttonPadding[size].top]),
    buttonPaddingBottom: makeSpace(theme.spacing[buttonPadding[size].bottom]),
    buttonPaddingLeft: makeSpace(theme.spacing[buttonPadding[size].left]),
    buttonPaddingRight: makeSpace(theme.spacing[buttonPadding[size].right]),
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
    buttonPaddingTop,
    buttonPaddingBottom,
    buttonPaddingLeft,
    buttonPaddingRight,
    focusBorderColor,
    focusBackgroundColor,
    focusRingColor,
    fontSize,
    hoverBorderColor,
    hoverBackgroundColor,
    iconColor,
    iconSize,
    textPaddingLeft,
    textPaddingRight,
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
    iconPosition,
    hasIcon: Boolean(Icon),
  });

  return (
    <StyledBaseButton
      activeBorderColor={activeBorderColor}
      activeBackgroundColor={activeBackgroundColor}
      defaultBorderColor={defaultBorderColor}
      minHeight={minHeight}
      buttonPaddingTop={buttonPaddingTop}
      buttonPaddingBottom={buttonPaddingBottom}
      buttonPaddingLeft={buttonPaddingLeft}
      buttonPaddingRight={buttonPaddingRight}
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
          paddingLeft={textPaddingLeft}
          paddingRight={textPaddingRight}
        >
          {text}
        </ButtonText>
      ) : null}
      {Icon && iconPosition == 'right' ? <Icon size={iconSize} color={iconColor} /> : null}
    </StyledBaseButton>
  );
};

export default BaseButton;
