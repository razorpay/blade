/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import type { GestureResponderEvent } from 'react-native';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonTypography, ButtonBoxShadow } from './buttonTokens';
import {
  backgroundGradient,
  boxShadow,
  buttonIconOnlySizeToIconSizeMap,
  typography as buttonTypography,
  minHeight as buttonMinHeight,
  buttonSizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  buttonPadding,
  buttonIconOnlyHeightWidth,
  buttonBorderRadius,
} from './buttonTokens';
import type { BaseButtonStyleProps, IconColor } from './types';
import AnimatedButtonContent from './AnimatedButtonContent';
import { ButtonProgressLoader } from './ButtonProgressLoader';
import { getTextColorToken } from './getTextColorToken';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import getIn from '~utils/lodashButBetter/get';
import type { BaseLinkProps } from '~components/Link/BaseLink';
import type { Theme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import { isReactNative } from '~utils';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useButtonGroupContext } from '~components/ButtonGroup/ButtonGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { BaseText } from '~components/Typography/BaseText';
import { useTheme } from '~components/BladeProvider';
import { announce } from '~components/LiveAnnouncer';
import { ButtonDotLoader } from './ButtonDotLoader';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type {
  BladeElementRef,
  DataAnalyticsAttribute,
  StringChildrenType,
  TestID,
} from '~utils/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { usePrevious } from '~utils/usePrevious';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { AccessibilityProps } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import { makeSpace } from '~utils/makeSpace';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import type { BladeCommonEvents } from '~components/types';
import { throwBladeError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { Avatar, AvatarGroup } from '~components/Avatar';

/**
 * Loading behaviour of the button.
 * - `indefinite`: shows a 3-dot loader (driven by `isLoading`) that replaces all content
 * - `definite`: the button sits in its disabled/"rest" color while a left-to-right
 *   progress bar in the button's normal color fills over `loadingTimer` ms, so the button
 *   visually transitions from disabled to normal as it completes. Content stays visible.
 */
export type ButtonLoadingType = 'indefinite' | 'definite';

type ButtonAvatarBase = {
  /**
   * `alt` text for the avatar image.
   */
  alt?: string;
};

export type ButtonAvatar = ButtonAvatarBase &
  (
    | {
        /**
         * Name used to generate initials and as the image `alt` when `src` loads.
         */
        name: string;
        /**
         * Avatar image source.
         */
        src?: string;
      }
    | {
        /**
         * Name used to generate initials and as the image `alt` when `src` loads.
         */
        name?: string;
        /**
         * Avatar image source.
         */
        src: string;
      }
  );

type BaseButtonCommonProps = {
  href?: BaseLinkProps['href'];
  target?: BaseLinkProps['target'];
  rel?: BaseLinkProps['rel'];
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  id?: string;
  tabIndex?: BaseBoxProps['tabIndex'];
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onKeyDown?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  }>;
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
  type?: 'button' | 'reset' | 'submit';
  isLoading?: boolean;
  /**
   * Type of loading indicator to show.
   * - `indefinite`: 3-dot loader controlled by `isLoading`
   * - `definite`: left-to-right progress bar over `loadingTimer` ms
   * @default 'indefinite'
   */
  loadingType?: ButtonLoadingType;
  /**
   * Duration (in milliseconds) over which the `definite` progress bar fills from 0% to 100%.
   * Required when `loadingType` is `definite`.
   */
  loadingTimer?: number;
  /**
   * Called once when the `definite` progress bar reaches 100%.
   */
  onLoadingComplete?: () => void;
  /**
   * Avatars to render after the button text as an avatar group.
   * Only rendered for `large` buttons; ignored for smaller sizes.
   */
  avatars?: ButtonAvatar[];
  accessibilityProps?: Partial<AccessibilityProps>;
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?:
    | 'primary'
    | 'white'
    | 'positive'
    | 'negative'
    | 'notice'
    | 'information'
    | 'neutral'
    | 'transparent';
} & TestID &
  StyledPropsBlade &
  BladeCommonEvents;

/*
Mandatory children prop when icon is not provided
*/
type BaseButtonWithoutIconProps = BaseButtonCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
} & DataAnalyticsAttribute;

/*
 Optional children prop when icon is provided
*/
type BaseButtonWithIconProps = BaseButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
} & DataAnalyticsAttribute;

/*
 With or without icon prop. We need at least an icon or a children prop present.
*/
export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;

type BaseButtonColorTokenModifiers = {
  variant: NonNullable<BaseButtonProps['variant']>;
  state: 'default' | 'hover' | 'focus' | 'disabled';
  color: BaseButtonProps['color'];
};

const getRenderElement = (href?: string): 'a' | 'button' | undefined => {
  if (isReactNative()) {
    return undefined; // as property doesn't work with react native
  }

  if (href) {
    return 'a';
  }

  return 'button';
};

export const getBackgroundColorToken = ({
  variant,
  state,
  color,
}: BaseButtonColorTokenModifiers) => {
  const _state = state === 'focus' || state === 'hover' ? 'highlighted' : state;

  // For white and transparent colors, we use 'primary' as the base color
  // since the actual token lookup uses the white/transparent specific paths
  const gradientColor = color === 'white' || color === 'transparent' || !color ? 'primary' : color;
  const tokens = backgroundGradient(gradientColor);

  if (color === 'white') {
    return tokens.white[variant][_state];
  }

  if (color === 'transparent') {
    if (variant !== 'tertiary') {
      throw new Error(
        `Transparent color can only be used with tertiary variant but received "${variant}"`,
      );
    }
    return tokens.base.transparent[_state];
  }

  if (color && color !== 'primary') {
    if (variant === 'tertiary') {
      throw new Error(
        `Tertiary variant can only be used with color: "primary" or "white" but received "${color}"`,
      );
    }
  }

  return tokens.base[variant][_state];
};

export const getBoxShadowToken = ({
  variant,
  state,
  color,
}: BaseButtonColorTokenModifiers): ButtonBoxShadow => {
  const _state = state === 'focus' || state === 'hover' ? 'highlighted' : state;
  const tokenColor = color === 'white' || color === 'transparent' || !color ? 'primary' : color;
  const tokens = boxShadow(tokenColor);

  if (color === 'white') {
    return tokens.white[variant][_state];
  }

  if (color === 'transparent') {
    if (variant !== 'tertiary') {
      throw new Error(
        `Transparent color can only be used with tertiary variant but received "${variant}"`,
      );
    }
    return tokens.base.transparent[_state];
  }

  return tokens.base[variant][_state];
};

export { getTextColorToken };

const resolveBackgroundValue = ({ theme, value }: { theme: Theme; value: string }): string => {
  if (value === 'transparent' || value.startsWith('linear-gradient')) {
    return value;
  }

  return getIn(theme.colors, value as DotNotationToken<Theme['colors']>);
};

const getProps = ({
  buttonTypographyTokens,
  childrenString,
  isDisabled,
  isDefiniteLoading,
  size,
  theme,
  variant,
  color,
  hasIcon,
}: {
  buttonTypographyTokens: ButtonTypography;
  childrenString?: string;
  isDisabled: boolean;
  isDefiniteLoading: boolean;
  hasIcon: boolean;
  theme: Theme;
  size: NonNullable<BaseButtonProps['size']>;
  variant: NonNullable<BaseButtonProps['variant']>;
  color: BaseButtonProps['color'];
}): BaseButtonStyleProps => {
  if (
    variant === 'tertiary' &&
    color !== 'primary' &&
    color !== 'white' &&
    color !== 'transparent'
  ) {
    throwBladeError({
      moduleName: 'BaseButton',
      message: `Tertiary variant can only be used with color: "primary" or "white" or "transparent" but received "${color}"`,
    });
  }

  const isIconOnly = hasIcon && (!childrenString || childrenString?.trim().length === 0);

  const getDefaultBackground = (): string => {
    return resolveBackgroundValue({
      theme,
      value: getBackgroundColorToken({ variant, color, state: 'default' }),
    });
  };

  const getBoxShadow = (
    state: 'default' | 'hover' | 'focus' | 'disabled',
    btnColor: BaseButtonProps['color'],
  ): string | undefined => {
    const shadowTokens = getBoxShadowToken({ variant, color: btnColor, state });

    if (shadowTokens.length === 0) {
      return undefined;
    }

    const shadows = shadowTokens.map((shadow) => {
      const resolvedColor = getIn(theme.colors, shadow.color);
      return `inset 0 ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${resolvedColor}`;
    });

    return shadows.join(', ');
  };

  const getNativeShadowColors = (
    btnColor: BaseButtonProps['color'],
  ): {
    shadowHighlightColor?: string;
    shadowHighlightHeight?: number;
    shadowBottomColor?: string;
    shadowBottomHeight?: number;
    shadowBorderColor?: string;
    /**
     * Border color from the highlighted/focus box-shadow tokens. Used on press
     * to match web `&:active { boxShadow: focusBoxShadow }` (e.g. secondary/
     * tertiary gray.default → gray.highlighted).
     */
    focusShadowBorderColor?: string;
    shadowRingWidth?: number;
    isShadowGradientVisible?: boolean;
  } => {
    const resolveShadowColors = (
      shadowTokens: ReturnType<typeof getBoxShadowToken>,
    ): {
      highlightColor?: string;
      bottomColor?: string;
      borderColor?: string;
      highlightHeight: number;
      bottomHeight: number;
      ringWidth: number;
    } => {
      let highlightColor: string | undefined,
        bottomColor: string | undefined,
        borderColor: string | undefined;
      let highlightHeight = 0;
      let bottomHeight = 0;
      let ringWidth = 0;

      for (const shadow of shadowTokens) {
        const resolved = getIn(theme.colors, shadow.color);
        if (shadow.y > 0 && !highlightColor) {
          highlightColor = resolved;
          highlightHeight = shadow.y;
        } else if (shadow.y < 0 && !bottomColor) {
          bottomColor = resolved;
          bottomHeight = Math.abs(shadow.y);
        } else if (shadow.spread > 0 && !borderColor) {
          borderColor = resolved;
          ringWidth = shadow.spread;
        }
      }

      return { highlightColor, bottomColor, borderColor, highlightHeight, bottomHeight, ringWidth };
    };

    const defaultColors = resolveShadowColors(
      getBoxShadowToken({ variant, color: btnColor, state: 'default' }),
    );
    if (!defaultColors.highlightColor && !defaultColors.bottomColor && !defaultColors.borderColor) {
      return {};
    }

    const focusColors = resolveShadowColors(
      getBoxShadowToken({ variant, color: btnColor, state: 'focus' }),
    );

    return {
      shadowHighlightColor: defaultColors.highlightColor,
      shadowHighlightHeight:
        defaultColors.highlightHeight !== 0 ? defaultColors.highlightHeight : undefined,
      shadowBottomColor: defaultColors.bottomColor,
      shadowBottomHeight: defaultColors.bottomHeight !== 0 ? defaultColors.bottomHeight : undefined,
      shadowBorderColor: defaultColors.borderColor,
      focusShadowBorderColor: focusColors.borderColor,
      shadowRingWidth: defaultColors.ringWidth !== 0 ? defaultColors.ringWidth : undefined,
      isShadowGradientVisible: variant === 'primary',
    };
  };

  const props: BaseButtonStyleProps = {
    iconSize: isIconOnly ? buttonIconOnlySizeToIconSizeMap[size] : buttonSizeToIconSizeMap[size],
    spinnerSize: buttonSizeToSpinnerSizeMap[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    height: isIconOnly ? buttonIconOnlyHeightWidth[size] : undefined,
    width: isIconOnly ? buttonIconOnlyHeightWidth[size] : undefined,
    iconColor: getTextColorToken({
      property: 'icon',
      variant,
      color,
      state: 'default',
    }) as IconColor,
    textColor: getTextColorToken({
      property: 'text',
      variant,
      color,
      state: 'default',
    }) as BaseTextProps['color'],
    buttonPaddingTop: isIconOnly ? makeSpace(0) : makeSpace(theme.spacing[buttonPadding[size].top]),
    buttonPaddingBottom: isIconOnly
      ? makeSpace(0)
      : makeSpace(theme.spacing[buttonPadding[size].bottom]),
    buttonPaddingLeft: isIconOnly
      ? makeSpace(0)
      : makeSpace(theme.spacing[buttonPadding[size].left]),
    buttonPaddingRight: isIconOnly
      ? makeSpace(0)
      : makeSpace(theme.spacing[buttonPadding[size].right]),
    text: childrenString?.trim(),
    defaultBackgroundColor: getDefaultBackground(),
    defaultBoxShadow: getBoxShadow('default', color),
    hoverBackgroundColor: resolveBackgroundValue({
      theme,
      value: getBackgroundColorToken({ variant, color, state: 'hover' }),
    }),
    hoverBoxShadow: getBoxShadow('hover', color),
    hoverIconColor: getIn(
      theme.colors,
      getTextColorToken({
        property: 'icon',
        variant,
        color,
        state: 'hover',
      }),
    ),
    focusBackgroundColor: resolveBackgroundValue({
      theme,
      value: getBackgroundColorToken({ variant, color, state: 'focus' }),
    }),
    focusBoxShadow: getBoxShadow('focus', color),
    focusRingColor: getIn(theme.colors, 'surface.border.primary.muted'),
    borderRadius: makeBorderSize(theme.border.radius[buttonBorderRadius[size]]),
    motionDuration: 'duration.xquick',
    motionEasing: 'easing.standard',
    ...(isReactNative() && (!isDisabled || (isDefiniteLoading && variant === 'primary'))
      ? getNativeShadowColors(color)
      : {}),
  };

  const shouldUseDisabledBackground = isDisabled && !(isDefiniteLoading && variant === 'primary');
  const shouldUseDisabledContent = isDisabled && !isDefiniteLoading;

  if (shouldUseDisabledContent) {
    props.iconColor = getTextColorToken({
      property: 'icon',
      variant,
      color,
      state: 'disabled',
    }) as IconColor;
    props.textColor = getTextColorToken({
      property: 'text',
      variant,
      color,
      state: 'disabled',
    }) as BaseTextProps['color'];
  }

  if (shouldUseDisabledBackground) {
    const disabledBackgroundColor = resolveBackgroundValue({
      theme,
      value: getBackgroundColorToken({ variant, color, state: 'disabled' }),
    });
    props.defaultBackgroundColor = disabledBackgroundColor;
    props.defaultBoxShadow = getBoxShadow('disabled', color);
    props.hoverBackgroundColor = disabledBackgroundColor;
    props.hoverBoxShadow = getBoxShadow('disabled', color);
    props.focusBackgroundColor = disabledBackgroundColor;
    props.focusBoxShadow = getBoxShadow('disabled', color);
  } else if (isDisabled) {
    props.hoverBackgroundColor = props.defaultBackgroundColor;
    props.hoverBoxShadow = props.defaultBoxShadow;
    props.focusBackgroundColor = props.defaultBackgroundColor;
    props.focusBoxShadow = props.defaultBoxShadow;
  }

  return props;
};

const ButtonContent = styled(BaseBox)<{ isHidden: boolean }>(({ isHidden }) => ({
  opacity: isHidden ? 0 : 1,
}));

const _BaseButton: React.ForwardRefRenderFunction<BladeElementRef, BaseButtonProps> = (
  {
    href,
    target,
    rel,
    tabIndex,
    id,
    variant = 'primary',
    color = 'primary',
    size = 'medium',
    icon: Icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    loadingType = 'indefinite',
    loadingTimer,
    onLoadingComplete,
    avatars,
    onClick,
    onBlur,
    onKeyDown,
    type = 'button',
    children,
    testID,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    accessibilityProps,
    onTouchEnd,
    onTouchStart,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const buttonGroupProps = useButtonGroupContext();
  const [isPressed, setIsPressed] = React.useState(false);
  const isLink = Boolean(href);
  const childrenString = getStringFromReactText(children);
  const isChildrenComponent = React.isValidElement(children);
  const buttonVariant = buttonGroupProps.variant ?? variant;
  const buttonColor = buttonGroupProps.color ?? color;
  const buttonSize = buttonGroupProps.size ?? size;
  const buttonFullWidth = buttonGroupProps.isFullWidth ?? isFullWidth;
  const isIndefiniteLoading = loadingType === 'indefinite' && isLoading;
  const isDefiniteLoadingConfigured =
    loadingType === 'definite' && typeof loadingTimer === 'number' && loadingTimer > 0;
  const [definiteLoadingRun, setDefiniteLoadingRun] = React.useState(0);
  const [completedDefiniteLoadingKey, setCompletedDefiniteLoadingKey] = React.useState<
    string | null
  >(null);
  const previousDefiniteLoadingConfigured = usePrevious(isDefiniteLoadingConfigured);
  const hasConfiguredDefiniteLoading = React.useRef(false);

  React.useEffect(() => {
    if (isDefiniteLoadingConfigured && !previousDefiniteLoadingConfigured) {
      if (hasConfiguredDefiniteLoading.current) {
        setDefiniteLoadingRun((currentRun) => currentRun + 1);
      }
      hasConfiguredDefiniteLoading.current = true;
    }
  }, [isDefiniteLoadingConfigured, previousDefiniteLoadingConfigured]);

  const definiteLoadingKey = isDefiniteLoadingConfigured
    ? `${loadingType}:${loadingTimer}:${definiteLoadingRun}`
    : null;
  const isDefiniteLoading =
    definiteLoadingKey !== null && definiteLoadingKey !== completedDefiniteLoadingKey;
  const isAnyLoading = isIndefiniteLoading || isDefiniteLoading;

  // Button cannot be disabled when its rendered as Link
  // button should be allowed to be disabled in any case...
  // either through button group or we should allow to disable an individual button
  const disabled = buttonGroupProps.isDisabled || isAnyLoading || (isDisabled && !isLink);

  if (__DEV__) {
    if (!Icon && !childrenString?.trim()) {
      throwBladeError({
        message: 'At least one of icon or text is required to render a button.',
        moduleName: 'BaseButton',
      });
    }
  }

  const prevLoading = usePrevious(isAnyLoading);

  React.useEffect(() => {
    if (isAnyLoading) announce('Started loading');

    if (!isAnyLoading && prevLoading) announce('Stopped loading');
  }, [isAnyLoading, prevLoading]);

  const handleDefiniteLoadingComplete = React.useCallback(() => {
    if (!definiteLoadingKey) return;

    setCompletedDefiniteLoadingKey(definiteLoadingKey);
    onLoadingComplete?.();
  }, [definiteLoadingKey, onLoadingComplete]);

  React.useEffect(() => {
    if (!isDefiniteLoading || typeof loadingTimer !== 'number') return undefined;

    const timerId = setTimeout(handleDefiniteLoadingComplete, loadingTimer);
    return () => clearTimeout(timerId);
  }, [handleDefiniteLoadingComplete, isDefiniteLoading, loadingTimer]);

  // Keep ButtonGroup press index in sync so border-collapse / z-index can
  // reveal this button's highlighted right edge while pressed (RN only).
  // useLayoutEffect ensures the z-index update happens before paint, keeping
  // it in sync with Reanimated's UI-thread press state change.
  React.useLayoutEffect(() => {
    if (typeof buttonGroupProps.buttonIndex !== 'number') return;
    const { buttonIndex, setPressedButtonIndex } = buttonGroupProps;
    if (isPressed) {
      setPressedButtonIndex?.(buttonIndex);
    } else {
      // Only clear if this button still owns the pressed index — otherwise a
      // multi-touch release on A would wipe B's press state.
      setPressedButtonIndex?.((prev) => (prev === buttonIndex ? null : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPressed, buttonGroupProps.buttonIndex]);

  const {
    defaultBackgroundColor,
    defaultBoxShadow,
    minHeight,
    height,
    width,
    buttonPaddingTop,
    buttonPaddingBottom,
    buttonPaddingLeft,
    buttonPaddingRight,
    focusBoxShadow,
    focusBackgroundColor,
    focusRingColor,
    fontSize,
    hoverBoxShadow,
    hoverBackgroundColor,
    hoverIconColor,
    iconColor,
    iconSize,
    spinnerSize,
    lineHeight,
    text,
    textColor,
    borderRadius,
    motionDuration,
    motionEasing,
    shadowHighlightColor,
    shadowHighlightHeight,
    shadowBottomColor,
    shadowBottomHeight,
    shadowBorderColor,
    focusShadowBorderColor,
    shadowRingWidth,
    isShadowGradientVisible,
  } = getProps({
    buttonTypographyTokens: buttonTypography,
    childrenString,
    isDisabled: disabled,
    isDefiniteLoading,
    size: buttonSize,
    variant: buttonVariant,
    theme,
    color: buttonColor,
    hasIcon: Boolean(Icon),
  });

  const progressRestColor = resolveBackgroundValue({
    theme,
    value: getBackgroundColorToken({
      variant: buttonVariant,
      color: buttonColor,
      state: 'disabled',
    }),
  });
  const progressSurfaceColor = getIn(theme.colors, 'surface.background.gray.intense');
  const isDefinitePrimaryLoading = isDefiniteLoading && buttonVariant === 'primary';
  const shouldShowAvatars =
    Boolean(avatars && avatars.length > 0) && buttonSize === 'large' && !isIndefiniteLoading;

  const renderElement = React.useMemo(() => getRenderElement(href), [href]);
  const defaultRole = isLink ? 'link' : 'button';

  // On web, ButtonGroup flattens the child buttons' border radius via CSS child
  // selectors and rounds only the outer edges using the group container's
  // `overflow: hidden` + `borderRadius`. React Native has no CSS cascade, so we
  // flatten each button's border radius to 0 here and let the group container do
  // the outer rounding — otherwise the inner (middle) buttons show rounded corners.
  // An explicit `isInsideButtonGroup` flag set by ButtonGroupContext signals we're
  // inside a group; this avoids relying on the presence of `variant` in the
  // default context.
  const isInsideRNButtonGroup = isReactNative() && Boolean(buttonGroupProps.isInsideButtonGroup);

  // buttonBorderRadiusValue flattens the base borderRadius to 0 for all buttons
  // in a group. buttonBorderRadii provides per-corner rounding for the outer
  // edges of the first/last buttons. Both are needed: the base value ensures the
  // Pressable itself is square, while borderRadii rounds only the outer corners
  // via per-corner style overrides (and feeds the SVG border overlay).
  const buttonBorderRadiusValue = isInsideRNButtonGroup ? makeBorderSize(0) : borderRadius;
  const numericButtonBorderRadius = Number(String(buttonBorderRadiusValue).replace('px', '')) || 0;

  // The group container clips with `overflow: hidden` + `borderRadius`. Since the
  // buttons are square (radius 0), the native border overlay (drawn as a square
  // ring) gets clipped at the group's rounded outer corners. To match web, round
  // only the outer corners of the first/last buttons (both the background and the
  // border overlay) so the ring follows the rounded corner instead of being cut.
  const groupCornerRadius = isInsideRNButtonGroup
    ? theme.border.radius[buttonBorderRadius[buttonSize]]
    : 0;
  const isFirstInGroup = Boolean(buttonGroupProps.isFirstInButtonGroup);
  const isLastInGroup = Boolean(buttonGroupProps.isLastInButtonGroup);
  const buttonBorderRadii = isInsideRNButtonGroup
    ? {
        topLeft: isFirstInGroup ? groupCornerRadius : 0,
        bottomLeft: isFirstInGroup ? groupCornerRadius : 0,
        topRight: isLastInGroup ? groupCornerRadius : 0,
        bottomRight: isLastInGroup ? groupCornerRadius : 0,
      }
    : undefined;

  // ButtonGroup computes isGroupBorderCollapsed based on its variant and passes it
  // through context, so BaseButton doesn't need to inspect the variant string.
  const isGroupBorderCollapsed =
    isInsideRNButtonGroup && !isFirstInGroup && Boolean(buttonGroupProps.isGroupBorderCollapsed);

  // Match web ButtonGroup: only the first child keeps the radial glow
  // (`backgroundImage: none` on `:not(:first-child)`). On native the white
  // top/left "glassy" edge also comes from the inset highlight stroke mapped
  // from box-shadow — suppress that on non-first buttons too so junctions
  // don't show a white left edge on Share/Download.
  const isNonFirstInButtonGroup = isInsideRNButtonGroup && !isFirstInGroup;
  const showShadowGradient = Boolean(isShadowGradientVisible) && !isNonFirstInButtonGroup;
  const effectiveShadowHighlightColor = isNonFirstInButtonGroup ? undefined : shadowHighlightColor;

  // Web ButtonGroup sets `flex: 1` on children when isFullWidth. On native,
  // isFullWidth alone applies `width: 100%`, which overflows in a row — use
  // flex instead so siblings share space equally.
  const isInsideFullWidthButtonGroup = isInsideRNButtonGroup && Boolean(buttonFullWidth);

  const handlePointerPressedIn = React.useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
  }, [disabled]);

  const handlePointerPressedOut = React.useCallback(() => {
    if (disabled) return;
    setIsPressed(false);
  }, [disabled]);

  const handleKeyboardPressedIn = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        setIsPressed(true);
      }
    },
    [disabled],
  );

  const handleKeyboardPressedOut = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        setIsPressed(false);
      }
    },
    [disabled],
  );

  return (
    <StyledBaseButton
      ref={ref as any}
      id={id}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore: On React Native it will always be undefined but TS doesn't understand that
      as={renderElement}
      href={href}
      target={target}
      rel={rel}
      accessibilityProps={{
        ...makeAccessible({
          ...accessibilityProps,
          role: accessibilityProps?.role ?? defaultRole,
          disabled: !isLink && disabled ? true : undefined,
          busy: isAnyLoading || undefined,
        }),
      }}
      variant={buttonVariant}
      color={buttonColor}
      size={buttonSize}
      isLoading={isAnyLoading}
      disabled={disabled}
      minHeight={minHeight}
      buttonPaddingTop={buttonPaddingTop}
      buttonPaddingBottom={buttonPaddingBottom}
      buttonPaddingLeft={buttonPaddingLeft}
      buttonPaddingRight={buttonPaddingRight}
      defaultBackgroundColor={defaultBackgroundColor}
      defaultBoxShadow={defaultBoxShadow}
      focusBoxShadow={focusBoxShadow}
      focusBackgroundColor={focusBackgroundColor}
      focusRingColor={focusRingColor}
      hoverBoxShadow={hoverBoxShadow}
      hoverBackgroundColor={hoverBackgroundColor}
      isFullWidth={buttonFullWidth}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      tabIndex={tabIndex}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      // Setting type for web fails it on native typecheck and vice versa
      onKeyDown={(event: any) => {
        handleKeyboardPressedIn(event);
        onKeyDown?.(event);
      }}
      onTouchStart={(event: React.TouchEvent) => {
        handlePointerPressedIn();
        onTouchStart?.(event);
      }}
      onTouchEnd={(event: React.TouchEvent) => {
        handlePointerPressedOut();
        onTouchEnd?.(event);
      }}
      type={type}
      borderRadius={buttonBorderRadiusValue}
      {...(buttonBorderRadii ? { borderRadii: buttonBorderRadii } : {})}
      {...(isGroupBorderCollapsed ? { isGroupBorderCollapsed } : {})}
      {...(isNonFirstInButtonGroup ? { isInsetShadowSidesFlattened: true } : {})}
      {...(isInsideFullWidthButtonGroup ? { isInsideFullWidthButtonGroup: true } : {})}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      height={height}
      width={width}
      isPressed={isPressed}
      {...(isDefiniteLoading ? { isDefiniteLoading } : {})}
      hoverIconColor={
        disabled && !isDefiniteLoading
          ? getIn(theme.colors, iconColor as DotNotationToken<Theme['colors']>)
          : hoverIconColor
      }
      onMouseDown={(event: React.MouseEvent) => {
        handlePointerPressedIn();
        onMouseDown?.(event);
      }}
      onMouseUp={handlePointerPressedOut}
      {...(!isReactNative()
        ? { onMouseOut: handlePointerPressedOut, onKeyUp: handleKeyboardPressedOut }
        : {})}
      shadowHighlightColor={effectiveShadowHighlightColor}
      shadowHighlightHeight={isNonFirstInButtonGroup ? undefined : shadowHighlightHeight}
      shadowBottomColor={shadowBottomColor}
      shadowBottomHeight={shadowBottomHeight}
      shadowBorderColor={shadowBorderColor}
      focusShadowBorderColor={focusShadowBorderColor}
      shadowRingWidth={shadowRingWidth}
      isShadowGradientVisible={showShadowGradient}
      {...metaAttribute({ name: MetaConstants.Button, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {isDefiniteLoading ? (
        <ButtonProgressLoader
          duration={loadingTimer ?? 0}
          restColor={progressRestColor}
          surfaceColor={progressSurfaceColor}
          borderRadius={numericButtonBorderRadius}
          borderRadii={buttonBorderRadii}
          frameBoxShadow={isDefinitePrimaryLoading ? defaultBoxShadow : undefined}
          shadowHighlightColor={
            isDefinitePrimaryLoading ? effectiveShadowHighlightColor : undefined
          }
          shadowHighlightHeight={isDefinitePrimaryLoading ? shadowHighlightHeight : undefined}
          shadowBottomColor={isDefinitePrimaryLoading ? shadowBottomColor : undefined}
          shadowBottomHeight={isDefinitePrimaryLoading ? shadowBottomHeight : undefined}
          shadowBorderColor={isDefinitePrimaryLoading ? shadowBorderColor : undefined}
          shadowRingWidth={isDefinitePrimaryLoading ? shadowRingWidth : undefined}
          showGradient={isDefinitePrimaryLoading ? showShadowGradient : undefined}
          isInsetShadowSidesFlattened={
            isDefinitePrimaryLoading && isNonFirstInButtonGroup ? true : undefined
          }
        />
      ) : null}
      <AnimatedButtonContent
        motionDuration={motionDuration}
        motionEasing={motionEasing}
        isPressed={isPressed}
      >
        {isIndefiniteLoading ? (
          <BaseBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top="0px"
            left="0px"
            bottom="0px"
            right="0px"
            zIndex={1}
          >
            <ButtonDotLoader
              size={spinnerSize === 'large' ? 20 : 16}
              color={(() => {
                const dotColorToken =
                  buttonVariant === 'primary' && buttonColor === 'primary'
                    ? 'interactive.icon.primary.normal'
                    : getTextColorToken({
                        property: 'icon',
                        variant: buttonVariant,
                        color: buttonColor,
                        state: 'default',
                      });

                return getIn(theme.colors, dotColorToken as DotNotationToken<Theme['colors']>);
              })()}
            />
          </BaseBox>
        ) : null}
        <ButtonContent
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          flex={1}
          isHidden={isIndefiniteLoading}
          zIndex={1}
        >
          {Icon && iconPosition == 'left' ? (
            <BaseBox display="flex" justifyContent="center" alignItems="center">
              <Icon size={iconSize} color={iconColor} />
            </BaseBox>
          ) : null}
          {text ? (
            isChildrenComponent ? (
              children
            ) : (
              <BaseText
                marginX="spacing.2"
                lineHeight={lineHeight}
                fontSize={fontSize}
                // figma and web have different font-smoothing properties
                // which causes web version of button text to look much bolder
                // than figma version. To fix this we are changing font-weight from 600 to 500
                // https://forum.figma.com/t/why-does-a-font-weight-in-figma-seem-lighter-than-the-same-weight-in-the-browser/2207
                fontWeight="medium"
                textAlign="center"
                color={textColor}
              >
                {text}
              </BaseText>
            )
          ) : null}
          {Icon && iconPosition == 'right' ? (
            <BaseBox display="flex" justifyContent="center" alignItems="center">
              <Icon size={iconSize} color={iconColor} />
            </BaseBox>
          ) : null}
          {shouldShowAvatars && avatars ? (
            <BaseBox display="flex" alignItems="center" flexShrink={0} paddingLeft="spacing.3">
              <AvatarGroup size="xsmall">
                {avatars.map((avatar, index) => (
                  <Avatar
                    key={avatar.src ?? avatar.name ?? index}
                    name={avatar.name}
                    src={avatar.src}
                    alt={avatar.src ? avatar.alt ?? avatar.name ?? 'Avatar' : avatar.alt}
                  />
                ))}
              </AvatarGroup>
            </BaseBox>
          ) : null}
        </ButtonContent>
      </AnimatedButtonContent>
    </StyledBaseButton>
  );
};

const BaseButton = assignWithoutSideEffects(React.forwardRef(_BaseButton), {
  displayName: 'BaseButton',
});

export default BaseButton;
