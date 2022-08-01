import type { ReactElement, SyntheticEvent } from 'react';
import { useState } from 'react';
import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../../tokens/global/motion';
import type { LinkActionStates } from '../../../tokens/theme/theme';
import { makeAccessible, getIn } from '../../../utils';
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
  intent?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  onClick?: (event: SyntheticEvent) => void;
  accessibilityLabel?: string;
};

/*
  Mandatory children prop when icon is not provided
*/
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

/*
  BaseLink Props with or without an icon
*/
type BaseLinkPropsWithOrWithoutIcon = BaseLinkWithIconProps | BaseLinkWithoutIconProps;

/*
  BaseLink Props when variant is anchor
*/
type BaseLinkAnchorVariantProps = BaseLinkPropsWithOrWithoutIcon & {
  variant?: 'anchor';
  href?: string;
  target?: string;
  rel?: string;
  isDisabled?: undefined;
};

/*
  BaseLink Props when variant is button
*/
type BaseLinkButtonVariantProps = BaseLinkPropsWithOrWithoutIcon & {
  variant?: 'button';
  isDisabled?: boolean;
  href?: undefined;
  target?: undefined;
  rel?: undefined;
};

/*
  BaseLink Props when variant is anchor or button
*/
export type BaseLinkProps = BaseLinkAnchorVariantProps | BaseLinkButtonVariantProps;

type BaseLinkStyleProps = {
  as: 'a' | 'button';
  textDecorationLine: 'underline' | 'none';
  iconColor: IconProps['color'];
  iconPadding: DotNotationSpacingStringToken;
  textColor: BaseTextProps['color'];
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  cursor: CSSObject['cursor'];
  disabled: boolean;
  role: 'button' | 'link';
  defaultRel: BaseLinkProps['rel'];
};

const getColorToken = ({
  variant,
  intent,
  contrast,
  element,
  currentInteraction,
  isDisabled,
  isVisited,
}: {
  variant: BaseLinkProps['variant'];
  intent: BaseLinkProps['intent'];
  contrast: NonNullable<BaseLinkProps['contrast']>;
  element: 'icon' | 'text';
  currentInteraction: keyof LinkActionStates;
  isDisabled: boolean;
  isVisited: boolean;
}): IconProps['color'] | BaseTextProps['color'] => {
  let state = currentInteraction;
  if (isDisabled && variant == 'button') {
    state = 'disabled';
  }
  if (isVisited && variant == 'anchor' && !intent) {
    // visited state is only valid for anchor variant without any intent
    state = 'visited';
  }

  if (intent && state !== 'visited') {
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
  isVisited,
  target,
}: {
  theme: Theme;
  variant: NonNullable<BaseLinkProps['variant']>;
  currentInteraction: keyof LinkActionStates;
  children?: string;
  isDisabled: boolean;
  intent: BaseLinkProps['intent'];
  contrast: NonNullable<BaseLinkProps['contrast']>;
  isVisited: boolean;
  target: BaseLinkProps['target'];
}): BaseLinkStyleProps => {
  const isButton = variant === 'button';
  const props: BaseLinkStyleProps = {
    as: isButton ? 'button' : 'a',
    textDecorationLine: !isButton && currentInteraction !== 'default' ? 'underline' : 'none',
    iconColor: getColorToken({
      variant,
      intent,
      contrast,
      element: 'icon',
      currentInteraction,
      isDisabled,
      isVisited,
    }) as IconProps['color'],
    iconPadding: children?.trim() ? 'spacing.1' : 'spacing.0',
    textColor: getColorToken({
      variant,
      intent,
      contrast,
      element: 'text',
      currentInteraction,
      isDisabled,
      isVisited,
    }) as BaseTextProps['color'],
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    motionDuration: 'duration.2xquick',
    motionEasing: 'easing.standard.effective',
    cursor: isButton && isDisabled ? 'not-allowed' : 'pointer',
    disabled: isButton && isDisabled,
    role: isButton ? 'button' : 'link',
    defaultRel: target && target === '_blank' ? 'noreferrer noopener' : undefined,
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
  rel,
  intent,
  contrast = 'low',
  accessibilityLabel,
  ...props
}: BaseLinkProps): ReactElement => {
  const [isVisited, setIsVisited] = useState(false);
  const { currentInteraction, setCurrentInteraction, ...syntheticEvents } = useInteraction();
  const { theme } = useTheme();
  if (!Icon && !children?.trim()) {
    throw new Error(
      `[Blade: BaseLink]: At least one of icon or text is required to render a link.`,
    );
  }
  const {
    as,
    textDecorationLine,
    iconColor,
    iconPadding,
    textColor,
    focusRingColor,
    motionDuration,
    motionEasing,
    cursor,
    disabled,
    role,
    defaultRel,
  } = getProps({
    theme,
    variant,
    currentInteraction,
    children,
    isDisabled,
    intent,
    contrast,
    isVisited,
    target,
  });

  const handleOnClick = (event: SyntheticEvent): void => {
    if (!isVisited && !intent && variant === 'anchor') {
      // visited state is only valid for anchor variant without any intent
      setIsVisited(true);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <StyledBaseLink
      {...syntheticEvents}
      accessibilityProps={{ ...makeAccessible({ role, label: accessibilityLabel, disabled }) }}
      variant={variant}
      as={as}
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      onClick={handleOnClick}
      disabled={disabled}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      setCurrentInteraction={setCurrentInteraction}
      {...props}
    >
      <Box display="flex" flexDirection="row" className="content-container" alignItems="center">
        {Icon && iconPosition == 'left' ? (
          <Box paddingRight={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
        <BaseText
          textDecorationLine={textDecorationLine}
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
