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
import type { Required } from '../../../_helpers/types';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonMinHeight, ButtonTypography } from './buttonTokens';
import { typography as buttonTypography } from './buttonTokens';

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
    paddingLeft: hasIcon && iconPosition === 'left' ? iconSpacing : '0px',
    paddingRight: hasIcon && iconPosition === 'right' ? iconSpacing : '0px',
  }),
);

type ColorTokenConfig = {
  property: 'background' | 'border' | 'text' | 'icon';
  variant: Required<BaseButtonProps['variant']>;
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
  | `feedback.${Required<
      ColorTokenConfig['intent']
    >}.action.${ColorTokenConfig['property']}.primary.${ColorTokenConfig['state']}.${Required<
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
  minHeight: ButtonMinHeight;
  iconSpacing: string;
  iconColor: IconProps['color'];
  textColor: BaseTextProps['color'];
  spacing: string;
  text?: string;
  defaultColor: string;
  defaultBorderColor: string;
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
  intent,
  contrast,
}: {
  buttonTypographyTokens: ButtonTypography[TypographyPlatforms];
  children?: string;
  isDisabled: boolean;
  theme: Theme;
  size: Required<BaseButtonProps['size']>;
  variant: Required<BaseButtonProps['variant']>;
  intent: BaseButtonProps['intent'];
  contrast: Required<BaseButtonProps['contrast']>;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: 'medium',
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: '36px',
    iconSpacing: makeSpace(theme.spacing[2]),
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
    spacing: `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`,
    text: children?.trim(),
    defaultColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'default' }),
    ),
    defaultBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'default' }),
    ),
    hoverColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'hover' }),
    ),
    hoverBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'hover' }),
    ),
    activeColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'active' }),
    ),
    activeBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'active' }),
    ),
    focusColor: getIn(
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
  switch (size) {
    case 'xsmall':
      props.iconSize = 'xsmall';
      props.minHeight = '28px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[2])}`;
      props.text = children?.trim().toUpperCase();
      break;
    case 'small':
      props.iconSize = 'xsmall';
      props.minHeight = '32px';
      props.iconSpacing = makeSpace(theme.spacing[1]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[3])}`;
      break;
    case 'medium':
      props.iconSize = 'medium';
      props.minHeight = '36px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`;
      break;
    case 'large':
      props.iconSize = 'medium';
      props.minHeight = '48px';
      props.iconSpacing = makeSpace(theme.spacing[2]);
      props.spacing = `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`;
      break;
    default:
  }

  if (isDisabled) {
    const disabledColor = getIn(
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
    props.defaultColor = disabledColor;
    props.defaultBorderColor = disabledBorderColor;
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
  const buttonTypographyTokens = buttonTypography[platform];
  if (!Icon && !children?.trim()) {
    throw new Error(
      `[Blade: BaseButton]: At least one of icon or text is required to render a button.`,
    );
  }
  const {
    activeBorderColor,
    activeColor,
    defaultBorderColor,
    defaultColor,
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
    intent,
    contrast,
  });

  return (
    <StyledBaseButton
      activeBorderColor={activeBorderColor}
      activeColor={activeColor}
      defaultBorderColor={defaultBorderColor}
      minHeight={minHeight}
      spacing={spacing}
      defaultColor={defaultColor}
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
      theme={theme}
    >
      {Icon && iconPosition == 'left' ? <Icon size={iconSize} color={iconColor} /> : null}
      {text && (
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
      )}
      {Icon && iconPosition == 'right' ? <Icon size={iconSize} color={iconColor} /> : null}
    </StyledBaseButton>
  );
};

export default BaseButton;
