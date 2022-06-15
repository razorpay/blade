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
import type { Required } from '../../../_helpers/types';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonMinHeight, ButtonTypography } from './buttonTokens';
import { typography as buttonTypography } from './buttonTokens';

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
};

const getProps = ({
  buttonTypographyTokens,
  children,
  isDisabled,
  size,
  theme,
}: {
  buttonTypographyTokens: ButtonTypography[TypographyPlatforms];
  children?: string;
  isDisabled: boolean;
  theme: Theme;
  size: Required<BaseButtonCommonProps['size']>;
}): BaseButtonStyleProps => {
  const props: BaseButtonStyleProps = {
    iconSize: 'medium',
    lineHeight: buttonTypographyTokens.lineHeights[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    minHeight: '40px',
    iconSpacing: makeSpace(theme.spacing[2]),
    iconColor: 'action.icon.primary.default',
    textColor: 'action.text.primary.default',
    spacing: `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[5])}`,
    text: children?.trim(),
    defaultColor: getIn(theme.colors, 'action.background.primary.default'),
    defaultBorderColor: getIn(theme.colors, 'action.border.primary.default'),
    hoverColor: getIn(theme.colors, 'action.background.primary.hover'),
    hoverBorderColor: getIn(theme.colors, 'action.border.primary.hover'),
    activeColor: getIn(theme.colors, 'action.background.primary.active'),
    activeBorderColor: getIn(theme.colors, 'action.border.primary.active'),
    focusColor: getIn(theme.colors, 'action.background.primary.focus'),
    focusBorderColor: getIn(theme.colors, 'action.border.primary.focus'),
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.small),
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
      props.minHeight = '40px';
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
    const disabledColor = getIn(theme.colors, 'action.background.primary.disabled');
    const disabledBorderColor = getIn(theme.colors, 'action.border.primary.disabled');
    props.iconColor = 'action.icon.primary.disabled';
    props.textColor = 'action.text.primary.disabled';
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
