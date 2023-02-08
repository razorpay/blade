/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ReactElement, SyntheticEvent } from 'react';
import { useState } from 'react';
import type { CSSObject } from 'styled-components';
import StyledBaseLink from './StyledBaseLink';
import useInteraction from '~src/hooks/useInteraction';
import type { IconComponent, IconProps } from '~components/Icons';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import { BaseText } from '~components/Typography/BaseText';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import { makeAccessible, getIn, metaAttribute, MetaConstants } from '~utils';
import type { LinkActionStates } from '~tokens/theme/theme';
import type { DurationString, EasingString } from '~tokens/global/motion';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type BaseLinkCommonProps = {
  intent?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  contrast?: 'low' | 'high';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  onClick?: (event: SyntheticEvent) => void;
  accessibilityLabel?: string;

  /**
   * Sets the size of the link
   *
   * @default medium
   */
  size?: 'small' | 'medium';
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
  iconSize: IconProps['size'];
  iconPadding: DotNotationSpacingStringToken;
  textColor: BaseTextProps['color'];
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  cursor: CSSObject['cursor'];
  disabled: boolean;
  role: 'button' | 'link';
  defaultRel: BaseLinkProps['rel'];
  type?: 'button';
  fontSize: BaseTextProps['fontSize'];
  lineHeight: BaseTextProps['lineHeight'];
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
  size,
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
  size: 'small' | 'medium';
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
    fontSize: size === 'medium' ? 100 : 75,
    lineHeight: size === 'medium' ? 'm' : 's',
    iconSize: size,
    iconPadding: children?.trim() ? 'spacing.2' : 'spacing.0',
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
    type: isButton ? 'button' : undefined,
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
  // @ts-expect-error avoiding exposing to public
  className,
  // @ts-expect-error avoiding exposing to public
  style,
  size = 'medium',
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
    iconSize,
    fontSize,
    textColor,
    focusRingColor,
    motionDuration,
    motionEasing,
    cursor,
    disabled,
    role,
    defaultRel,
    type,
    lineHeight,
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
    size,
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
      {...metaAttribute(MetaConstants.Component, MetaConstants.Link)}
      accessibilityProps={{ ...makeAccessible({ role, label: accessibilityLabel, disabled }) }}
      variant={variant}
      as={as}
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      onClick={handleOnClick}
      disabled={disabled}
      type={type}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      setCurrentInteraction={setCurrentInteraction}
      // @ts-ignore Because we avoided exposing className to public
      className={className}
      style={style}
    >
      <Box display="flex" flexDirection="row" className="content-container" alignItems="center">
        {Icon && iconPosition == 'left' ? (
          <Box paddingRight={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size={iconSize} />
          </Box>
        ) : null}
        <BaseText
          textDecorationLine={textDecorationLine}
          color={textColor}
          fontSize={fontSize}
          lineHeight={lineHeight}
          textAlign="center"
          fontWeight="bold"
        >
          {children}
        </BaseText>
        {Icon && iconPosition == 'right' ? (
          <Box paddingLeft={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size={iconSize} />
          </Box>
        ) : null}
      </Box>
    </StyledBaseLink>
  );
};

export default BaseLink;
