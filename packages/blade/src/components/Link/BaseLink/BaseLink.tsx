import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../../tokens/global/motion';
import type { ActionStates } from '../../../tokens/theme/theme';
import { makeAccessible } from '../../../utils';
import getIn from '../../../utils/getIn';
import type { DotNotationSpacingStringToken } from '../../../_helpers/types';
import type { Theme } from '../../BladeProvider';
import { useTheme } from '../../BladeProvider';
import Box from '../../Box';
import type { IconComponent, IconProps } from '../../Icons';
import type { BaseTextProps } from '../../Typography/BaseText';
import BaseText from '../../Typography/BaseText';
import StyledBaseLink from './StyledBaseLink';
import useInteraction from './useInteraction';

type BaseLinkCommonProps = {
  variant?: 'anchor' | 'button';
  intent?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  accessibilityLabel?: string;
};

type BaseLinkWithoutIconProps = BaseLinkCommonProps & {
  icon?: undefined;
  children: string;
};

/*
   Optional children prop when icon is provided
  */
type BaseLinkWithIconProps = BaseLinkCommonProps & {
  icon: IconComponent;
  children?: string;
};

export type BaseLinkProps = BaseLinkWithIconProps | BaseLinkWithoutIconProps;

type BaseLinkStyleProps = {
  as: 'a' | 'button';
  textDecoration: 'underline' | 'none';
  iconColor: IconProps['color'];
  iconPadding: DotNotationSpacingStringToken;
  textColor: BaseTextProps['color'];
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  cursor: CSSObject['cursor'];
  disabled: boolean;
  role: 'button' | 'link';
};

const getColorToken = ({
  variant,
  intent,
  contrast,
  element,
  currentInteraction,
  isDisabled,
}: {
  variant: BaseLinkProps['variant'];
  intent: BaseLinkProps['intent'];
  contrast: BaseLinkProps['contrast'];
  element: 'icon' | 'text';
  currentInteraction: keyof ActionStates;
  isDisabled: boolean;
}): IconProps['color'] | BaseTextProps['color'] => {
  const state = isDisabled && variant == 'button' ? 'disabled' : currentInteraction;
  if (intent && contrast) {
    return `feedback.${intent}.action.${element}.link.${state}.${contrast}Contrast`;
  }
  return `action.${element}.link.${state}`;
};

const getProps = ({
  theme,
  variant,
  currentInteraction,
  children,
  isDisabled,
  intent,
  contrast,
}: {
  theme: Theme;
  variant: NonNullable<BaseLinkProps['variant']>;
  currentInteraction: keyof ActionStates;
  children?: string;
  isDisabled: boolean;
  intent: BaseLinkProps['intent'];
  contrast: BaseLinkProps['contrast'];
}): BaseLinkStyleProps => {
  const isButton = variant === 'button';
  const props: BaseLinkStyleProps = {
    as: isButton ? 'button' : 'a',
    textDecoration: !isButton && currentInteraction !== 'default' ? 'underline' : 'none',
    iconColor: getColorToken({
      variant,
      intent,
      contrast,
      element: 'icon',
      currentInteraction,
      isDisabled,
    }) as IconProps['color'],
    iconPadding: !children?.trim() ? 'spacing.0' : 'spacing.1',
    textColor: getColorToken({
      variant,
      intent,
      contrast,
      element: 'text',
      currentInteraction,
      isDisabled,
    }) as BaseTextProps['color'],
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    motionDuration: 'duration.2xquick',
    motionEasing: 'easing.standard.effective',
    cursor: isButton && isDisabled ? 'not-allowed' : 'pointer',
    disabled: isButton && isDisabled,
    role: isButton ? 'button' : 'link',
  };

  return props;
};

const BaseLink = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  isDisabled = false,
  onClick,
  variant = 'anchor',
  href,
  target,
  intent,
  contrast = 'low',
  accessibilityLabel,
}: BaseLinkProps): ReactElement => {
  const { currentInteraction, setCurrentInteraction, ...syntheticEvents } = useInteraction();
  const { theme } = useTheme();
  if (!Icon && !children?.trim()) {
    throw new Error(
      `[Blade: BaseLink]: At least one of icon or text is required to render a link.`,
    );
  }
  const {
    as,
    textDecoration,
    iconColor,
    iconPadding,
    textColor,
    focusRingColor,
    motionDuration,
    motionEasing,
    cursor,
    disabled,
    role,
  } = getProps({
    theme,
    variant,
    currentInteraction,
    children,
    isDisabled,
    intent,
    contrast,
  });

  return (
    <StyledBaseLink
      {...syntheticEvents}
      accessibilityProps={{ ...makeAccessible({ role, label: accessibilityLabel, disabled }) }}
      variant={variant}
      as={as}
      href={href}
      target={target}
      onClick={onClick}
      disabled={disabled}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      setCurrentInteraction={setCurrentInteraction}
    >
      <Box display="flex" flexDirection="row" className="content-container" alignItems="center">
        {Icon && iconPosition == 'left' ? (
          <Box paddingRight={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
        <BaseText
          textDecorationLine={textDecoration}
          color={textColor}
          fontSize={100}
          textAlign="center"
        >
          {children}
        </BaseText>
        {Icon && iconPosition == 'right' ? (
          <Box paddingLeft={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
      </Box>
    </StyledBaseLink>
  );
};

export default BaseLink;
