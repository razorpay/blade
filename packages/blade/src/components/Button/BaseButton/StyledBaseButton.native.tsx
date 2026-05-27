import { Linking, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';
import React from 'react';
import type { TextInput, GestureResponderEvent } from 'react-native';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
import type { ButtonBoxShadow } from './buttonTokens';
import getIn from '~utils/lodashButBetter/get';
import { useStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { logger } from '~utils/logger';
import { castNativeType } from '~utils';

const StyledPressable = styled(Animated.createAnimatedComponent(Pressable))<
  Omit<StyledBaseButtonProps, 'accessibilityProps'>
>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  // boxShadow with inset values is not supported in React Native (css-to-react-native
  // cannot parse multiple inset shadows), so we exclude it from native styles.
  const { boxShadow: _boxShadow, ...nativeButtonStyles } = getStyledBaseButtonStyles(props);

  return {
    ...nativeButtonStyles,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    ...styledPropsCSSObject,
  };
});

const resolveShadowBorders = (
  shadowTokens: ButtonBoxShadow | undefined,
  theme: Theme,
): {
  borderWidth: number;
  borderColor: string;
  borderTopWidth: number;
  borderTopColor: string;
  borderBottomWidth: number;
  borderBottomColor: string;
} => {
  const transparent = 'transparent';
  const defaults = {
    borderWidth: 0,
    borderColor: transparent,
    borderTopWidth: 0,
    borderTopColor: transparent,
    borderBottomWidth: 0,
    borderBottomColor: transparent,
  };

  if (!shadowTokens || shadowTokens.length === 0) return defaults;

  let hasBottomShadow = false;

  for (const shadow of shadowTokens) {
    const color = getIn(theme.colors, shadow.color) as string;
    if (shadow.spread > 0 && shadow.y === 0) {
      defaults.borderWidth = shadow.spread;
      defaults.borderColor = color;
    } else if (shadow.y > 0) {
      // Top inner highlight — use a more visible white overlay
      defaults.borderTopWidth = Math.abs(shadow.y);
      defaults.borderTopColor = 'rgba(255,255,255,0.35)';
    } else if (shadow.y < 0 && !hasBottomShadow) {
      // Bottom inner shadow — use a more visible dark overlay, take first one only
      defaults.borderBottomWidth = Math.abs(shadow.y);
      defaults.borderBottomColor = 'rgba(0,0,0,0.2)';
      hasBottomShadow = true;
    }
  }

  return defaults;
};

const ButtonShadowOverlay = ({
  shadowTokens,
  borderRadius,
}: {
  shadowTokens: ButtonBoxShadow | undefined;
  borderRadius: string;
}): React.ReactElement | null => {
  const { theme } = useTheme();

  if (!shadowTokens || shadowTokens.length === 0) return null;

  const borders = resolveShadowBorders(shadowTokens, theme);
  const radius = parseFloat(borderRadius) || 0;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: radius,
        borderTopWidth: Math.max(borders.borderTopWidth, borders.borderWidth),
        borderTopColor:
          borders.borderTopColor !== 'transparent' ? borders.borderTopColor : borders.borderColor,
        borderBottomWidth: Math.max(borders.borderBottomWidth, borders.borderWidth),
        borderBottomColor:
          borders.borderBottomColor !== 'transparent'
            ? borders.borderBottomColor
            : borders.borderColor,
        borderLeftWidth: borders.borderWidth,
        borderLeftColor: borders.borderColor,
        borderRightWidth: borders.borderWidth,
        borderRightColor: borders.borderColor,
      }}
    />
  );
};

const openURL = async (href: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(href);
    if (canOpen) {
      await Linking.openURL(href);
    }
  } catch {
    if (__DEV__) {
      logger({
        type: 'warn',
        message: `Could not open the link "href=${href}"`,
        moduleName: 'BaseButton',
      });
    }
  }
};

const _StyledBaseButton: React.ForwardRefRenderFunction<TextInput, StyledBaseButtonProps> = (
  {
    onClick,
    href,
    onBlur,
    onKeyDown,
    children,
    variant,
    minHeight,
    buttonPaddingTop,
    buttonPaddingBottom,
    buttonPaddingLeft,
    buttonPaddingRight,
    isFullWidth,
    disabled,
    defaultBackgroundColor,
    defaultBorderColor,
    hoverBackgroundColor,
    focusBackgroundColor,
    focusRingColor,
    hoverBorderColor,
    focusBorderColor,
    borderWidth,
    borderRadius,
    motionDuration,
    motionEasing,
    isLoading,
    accessibilityProps,
    testID,
    onTouchStart,
    onTouchEnd,
    onPointerEnter,
    onPointerDown,
    onFocus,
    defaultShadowTokens,
    focusShadowTokens,
    ...styledProps
  },
  ref,
) => {
  const { theme } = useTheme();
  const isPressed = useSharedValue(false);
  const duration = getIn(theme.motion, motionDuration);
  const easing = getIn(theme.motion, motionEasing);

  const animatedStyles = useAnimatedStyle(() => {
    const styles: {
      backgroundColor: string;
      borderColor?: string;
    } = {
      backgroundColor: withTiming(isPressed.value ? focusBackgroundColor : defaultBackgroundColor, {
        duration,
        easing,
      }) as string,
    };

    if (variant !== 'tertiary' && defaultBorderColor && focusBorderColor) {
      styles.borderColor = withTiming(isPressed.value ? focusBorderColor : defaultBorderColor, {
        duration,
        easing,
      }) as string;
    }

    return styles;
  });

  const handleOnPress = (event: GestureResponderEvent): void => {
    if (href) {
      void openURL(href);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <StyledPressable
      {...styledProps}
      {...accessibilityProps}
      ref={ref}
      role="button"
      onTouchStart={castNativeType(onTouchStart)}
      onTouchEnd={castNativeType(onTouchEnd)}
      onPointerEnter={castNativeType(onPointerEnter)}
      onPointerDown={castNativeType(onPointerDown)}
      onFocus={castNativeType(onFocus)}
      isLoading={isLoading}
      onPress={handleOnPress}
      style={animatedStyles}
      minHeight={minHeight}
      buttonPaddingTop={buttonPaddingTop}
      buttonPaddingBottom={buttonPaddingBottom}
      buttonPaddingLeft={buttonPaddingLeft}
      buttonPaddingRight={buttonPaddingRight}
      isFullWidth={isFullWidth}
      disabled={disabled}
      defaultBackgroundColor={defaultBackgroundColor}
      defaultBorderColor={defaultBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      focusBackgroundColor={focusBackgroundColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      focusBorderColor={focusBorderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      testID={testID}
    >
      {/* eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error */}
      {/* @ts-ignore */}
      {({ pressed }): React.ReactNode => {
        isPressed.value = pressed;
        return (
          <>
            {children}
            <ButtonShadowOverlay
              shadowTokens={pressed ? focusShadowTokens : defaultShadowTokens}
              borderRadius={borderRadius}
            />
          </>
        );
      }}
    </StyledPressable>
  );
};

const StyledBaseButton = assignWithoutSideEffects(React.forwardRef(_StyledBaseButton), {
  displayName: 'StyledBaseButton',
});

export default StyledBaseButton;
