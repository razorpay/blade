/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SyntheticEvent } from 'react';
import React from 'react';
import type { CSSObject } from 'styled-components';
import type { GestureResponderEvent } from 'react-native';
import StyledBaseLink from './StyledBaseLink';
import getIn from '~utils/lodashButBetter/get';
import useInteraction from '~utils/useInteraction';
import type { IconColors, IconComponent, IconProps } from '~components/Icons';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';
import type {
  DotNotationSpacingStringToken,
  StringChildrenType,
  TestID,
  BladeElementRef,
} from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { Platform } from '~utils';
import { isReactNative } from '~utils';
import type { DurationString, EasingString, FontSize, Typography } from '~tokens/global';
import type {
  BaseTextProps,
  BaseTextSizes,
  TextColors,
} from '~components/Typography/BaseText/types';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { AccessibilityProps } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeCommonEvents } from '~components/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import type { ActionStates } from '~utils/useInteraction';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type BaseLinkCommonProps = {
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  onClick?: (event: SyntheticEvent) => void;
  onBlur?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.FocusEvent<HTMLButtonElement>) => void;
  }>;
  onMouseLeave?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
  onKeyDown?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  }>;
  accessibilityProps?: Partial<AccessibilityProps>;

  /**
   * Sets the size of the link
   *
   * @default medium
   */
  size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
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
  opacity?: number;
} & TestID &
  StyledPropsBlade &
  Omit<BladeCommonEvents, 'onBlur' | 'onMouseLeave'>;

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

type LinkActionStates = ActionStates;
const getColorToken = ({
  variant,
  color,
  currentInteraction,
  isDisabled,
  element,
}: {
  variant: BaseLinkProps['variant'];
  color: BaseLinkProps['color'];
  element: 'icon' | 'text';
  currentInteraction: LinkActionStates;
  isDisabled: boolean;
}): IconColors | TextColors => {
  let state = currentInteraction;
  const map = {
    default: 'normal',
    hover: 'subtle',
    focus: 'normal',
    disabled: 'disabled',
  } as const;

  if (isDisabled && variant == 'button') {
    state = 'disabled';
  }

  if (color && color !== 'primary') {
    if (color !== 'white') {
      return `interactive.${element}.${color}.${map[state]}`;
    }
    return `interactive.${element}.staticWhite.${map[state]}`;
  }
  return `interactive.${element}.primary.${map[state]}`;
};

const getProps = ({
  theme,
  variant,
  currentInteraction,
  children,
  isDisabled,
  color,
  target,
  size,
}: {
  theme: Theme;
  variant: NonNullable<BaseLinkProps['variant']>;
  currentInteraction: LinkActionStates;
  children?: string;
  isDisabled: boolean;
  color: BaseLinkProps['color'];
  target: BaseLinkProps['target'];
  size: NonNullable<BaseLinkProps['size']>;
}): BaseLinkStyleProps => {
  const isButton = variant === 'button';
  const textSizes: {
    fontSize: Record<NonNullable<BaseLinkProps['size']>, keyof FontSize>;
    lineHeight: Record<NonNullable<BaseLinkProps['size']>, keyof Typography['lineHeights']>;
  } = {
    fontSize: {
      xsmall: 25,
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      xsmall: 25,
      small: 75,
      medium: 100,
      large: 200,
    },
  };

  const props: BaseLinkStyleProps = {
    as: isButton ? 'button' : 'a',
    textDecorationLine: !isButton && currentInteraction !== 'default' ? 'underline' : 'none',
    iconColor: getColorToken({
      variant,
      color,
      element: 'icon',
      currentInteraction,
      isDisabled,
    }) as IconProps['color'],
    fontSize: textSizes.fontSize[size],
    lineHeight: textSizes.lineHeight[size],
    iconSize: size,
    iconPadding: children?.trim() ? 'spacing.2' : 'spacing.0',
    textColor: getColorToken({
      variant,
      color,
      element: 'text',
      currentInteraction,
      isDisabled,
    }) as BaseTextProps['color'],
    focusRingColor: getIn(theme.colors, 'interactive.background.primary.faded'),
    motionDuration: 'duration.2xquick',
    motionEasing: 'easing.standard',
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
    onKeyDown,
    variant = 'anchor',
    href,
    target,
    rel,
    color = 'primary',
    opacity,
    accessibilityProps,
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
    onMouseDown,
    onMouseUp,
    ...rest
  },
  ref,
) => {
  const childrenString = getStringFromReactText(children);
  const { currentInteraction, setCurrentInteraction, ...syntheticEvents } = useInteraction();
  const { theme } = useTheme();
  if (__DEV__) {
    if (!Icon && !childrenString?.trim()) {
      throwBladeError({
        message: `At least one of icon or text is required to render a link.`,
        moduleName: 'BaseLink',
      });
    }
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
    color,
    target,
    size,
  });

  const handleOnClick = (event: SyntheticEvent): void => {
    if (onClick) {
      onClick(event);
    }
  };

  const asProp = isReactNative() ? undefined : 'span';
  return (
    <StyledBaseLink
      ref={ref as never}
      {...metaAttribute({ name: MetaConstants.Link, testID })}
      accessibilityProps={{
        ...makeAccessible({
          role,
          disabled,
          ...accessibilityProps,
        }),
      }}
      variant={variant}
      as={as}
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      onClick={handleOnClick}
      {...syntheticEvents}
      onBlur={(event: any) => {
        onBlur?.(event);
        syntheticEvents.onBlur();
      }}
      onFocus={(event: any) => {
        onFocus?.(event);
        syntheticEvents.onFocus();
      }}
      onMouseLeave={(event: any) => {
        if (onMouseLeave) {
          onMouseLeave(event);
        }
        syntheticEvents.onMouseLeave();
      }}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      disabled={disabled}
      type={type}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      setCurrentInteraction={setCurrentInteraction}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
      // @ts-ignore Because we avoided exposing className to public
      className={className}
      style={style}
      hitSlop={hitSlop}
      title={htmlTitle}
    >
      <BaseBox
        as={asProp}
        display="flex"
        flexDirection="row"
        className="content-container"
        alignItems="center"
        opacity={opacity}
      >
        {Icon && iconPosition == 'left' ? (
          <BaseBox as={asProp} paddingRight={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size={iconSize} />
          </BaseBox>
        ) : null}
        <BaseText
          as={asProp}
          textDecorationLine={textDecorationLine}
          color={textColor}
          fontSize={fontSize}
          lineHeight={lineHeight}
          textAlign="center"
          fontWeight="medium"
        >
          {children}
        </BaseText>
        {Icon && iconPosition == 'right' ? (
          <BaseBox as={asProp} paddingLeft={iconPadding} display="flex" alignItems="center">
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
