/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SyntheticEvent } from 'react';
import React, { useState } from 'react';
import type { CSSObject } from 'styled-components';
import StyledBaseLink from './StyledBaseLink';
import useInteraction from '~src/hooks/useInteraction';
import type { IconComponent, IconProps } from '~components/Icons';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';
import type {
  DotNotationSpacingStringToken,
  StringChildrenType,
  TestID,
} from '~src/_helpers/types';
import {
  makeAccessible,
  getIn,
  metaAttribute,
  MetaConstants,
  assignWithoutSideEffects,
} from '~utils';
import type { LinkActionStates } from '~tokens/theme/theme';
import type { DurationString, EasingString, FontSize, Typography } from '~tokens/global';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TooltipTriggerProps } from '~components/Tooltip/types';
import type { BladeElementRef } from '~src/hooks/types';

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
  size?: 'small' | 'medium' | 'large';
  /**
   * Defines how far your touch can start away from the link. This is a react-native only prop and has no effect on web.
   */
  hitSlop?:
    | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      }
    | number;
  /**
   * The title of the link which is displayed as a tooltip. This is a web only prop and has no effect on react-native.
   */
  htmlTitle?: string;
} & TestID &
  StyledPropsBlade &
  TooltipTriggerProps;

/*
  Mandatory children prop when icon is not provided
*/
type BaseLinkWithoutIconProps = BaseLinkCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

/*
  Optional children prop when icon is provided
*/
type BaseLinkWithIconProps = BaseLinkCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
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
  size: NonNullable<BaseLinkProps['size']>;
}): BaseLinkStyleProps => {
  const isButton = variant === 'button';
  const textSizes: {
    fontSize: Record<NonNullable<BaseLinkProps['size']>, keyof FontSize>;
    lineHeight: Record<NonNullable<BaseLinkProps['size']>, keyof Typography['lineHeights']>;
  } = {
    fontSize: {
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      small: 50,
      medium: 100,
      large: 300,
    },
  };

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
    fontSize: textSizes.fontSize[size],
    lineHeight: textSizes.lineHeight[size],
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

const _BaseLink: React.ForwardRefRenderFunction<BladeElementRef, BaseLinkProps> = (
  {
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
    testID,
    hitSlop,
    htmlTitle,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...styledProps
  },
  ref,
) => {
  const [isVisited, setIsVisited] = useState(false);
  const childrenString = getStringFromReactText(children);
  const { currentInteraction, setCurrentInteraction, ...syntheticEvents } = useInteraction();
  const { theme } = useTheme();
  if (!Icon && !childrenString?.trim()) {
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
    children: childrenString,
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
      ref={ref as never}
      // TODO Check if this is overriden
      {...syntheticEvents}
      {...metaAttribute({ name: MetaConstants.Link, testID })}
      accessibilityProps={{ ...makeAccessible({ role, label: accessibilityLabel, disabled }) }}
      variant={variant}
      as={as}
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      onClick={handleOnClick}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled}
      type={type}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      setCurrentInteraction={setCurrentInteraction}
      {...styledProps}
      // @ts-ignore Because we avoided exposing className to public
      className={className}
      style={style}
      hitSlop={hitSlop}
      title={htmlTitle}
    >
      <BaseBox display="flex" flexDirection="row" className="content-container" alignItems="center">
        {Icon && iconPosition == 'left' ? (
          <BaseBox paddingRight={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size={iconSize} />
          </BaseBox>
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
          <BaseBox paddingLeft={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size={iconSize} />
          </BaseBox>
        ) : null}
      </BaseBox>
    </StyledBaseLink>
  );
};

const BaseLink = assignWithoutSideEffects(React.forwardRef(_BaseLink), {
  displayName: 'BaseLink',
  componentId: 'BaseLink',
});

export default BaseLink;
