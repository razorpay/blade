import type { ReactElement } from 'react';
import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import type { BaseTextProps } from '../../Typography/BaseText';
import BaseText from '../../Typography/BaseText';
import type { Theme } from '../../BladeProvider';
import { useTheme } from '../../BladeProvider';
import type { IconComponent, IconProps, IconSize } from '../../Icons';
import makeSpacingSize from '../../../utils/makeSpacingSize';
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
    iconSpacing,
  }: BaseTextProps &
    Pick<BaseButtonProps, 'iconPosition'> & { hasIcon: boolean; iconSpacing: string }) => `
    padding-left: ${hasIcon && iconPosition === 'left' ? iconSpacing : 0};
    padding-right: ${hasIcon && iconPosition === 'right' ? iconSpacing : 0};
`,
);

type ConfigProps = {
  iconSize: IconSize; // prop
  fontSize: keyof Theme['typography']['fonts']['size']; // prop
  lineHeight: keyof Theme['typography']['lineHeights']; // prop
  buttonHeight: '48px' | '40px' | '32px' | '28px'; // raw value
  iconSpacing: string; // raw value
  iconColor: IconProps['color']; // prop
  textColor: BaseTextProps['color']; // prop
  buttonSpacing: string; // raw value
  text?: string;
};

const getProps = ({
  theme,
  size,
  children,
}: {
  theme: Theme;
  size: BaseButtonCommonProps['size'];
  children?: string;
}): ConfigProps => {
  const props: ConfigProps = {
    iconSize: 'medium',
    fontSize: 100,
    lineHeight: 'l',
    buttonHeight: '40px',
    iconSpacing: makeSpacingSize(theme.spacing[2]),
    iconColor: 'action.icon.primary.default',
    textColor: 'action.text.primary.default',
    buttonSpacing: `${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(
      theme.spacing[5],
    )} ${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(theme.spacing[5])}`,
    text: children,
  };

  switch (size) {
    case 'large':
      props.iconSize = 'medium';
      props.fontSize = 200;
      props.lineHeight = 's';
      props.buttonHeight = '48px';
      props.iconSpacing = makeSpacingSize(theme.spacing[2]);
      props.iconColor = 'action.icon.primary.default';
      props.buttonSpacing = `${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(
        theme.spacing[5],
      )} ${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(theme.spacing[5])}`;
      break;
    case 'medium':
      props.iconSize = 'medium';
      props.fontSize = 100;
      props.lineHeight = 'l';
      props.buttonHeight = '40px';
      props.iconSpacing = makeSpacingSize(theme.spacing[2]);
      props.iconColor = 'action.icon.primary.default';
      props.buttonSpacing = `${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(
        theme.spacing[5],
      )} ${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(theme.spacing[5])}`;
      break;
    case 'small':
      props.iconSize = 'xsmall';
      props.fontSize = 75;
      props.lineHeight = 'l';
      props.buttonHeight = '32px';
      props.iconSpacing = makeSpacingSize(theme.spacing[1]);
      props.iconColor = 'action.icon.primary.default';
      props.buttonSpacing = `${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(
        theme.spacing[3],
      )} ${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(theme.spacing[3])}`;
      break;
    case 'xsmall':
      props.iconSize = 'xsmall';
      props.fontSize = 75;
      props.lineHeight = 'l';
      props.buttonHeight = '28px';
      props.iconSpacing = makeSpacingSize(theme.spacing[1]);
      props.iconColor = 'action.icon.primary.default';
      props.buttonSpacing = `${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(
        theme.spacing[2],
      )} ${makeSpacingSize(theme.spacing[0])} ${makeSpacingSize(theme.spacing[2])}`;
      props.text = children?.toUpperCase();
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
  const {
    iconSize,
    fontSize,
    lineHeight,
    buttonHeight,
    iconColor,
    iconSpacing,
    textColor,
    buttonSpacing,
    text,
  } = getProps({
    theme,
    size,
    children,
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
      color={buttonColor}
      hoverColor={hoverColor}
      onClick={(): void => {
        console.log('clicked');
      }}
      disabled={isDisabled}
      activeColor={activeColor}
      buttonHeight={buttonHeight}
      buttonSpacing={buttonSpacing}
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
        iconSpacing={iconSpacing}
      >
        {text}
      </StyledBaseText>
      {Icon && iconPosition == 'right' ? <Icon size={iconSize} color={iconColor} /> : null}
    </StyledBaseButton>
  );
};

export default BaseButton;
