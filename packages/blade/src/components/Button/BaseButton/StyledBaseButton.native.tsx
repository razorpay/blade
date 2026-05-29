import { Linking, Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useDerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import React from 'react';
import type { TextInput, GestureResponderEvent } from 'react-native';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { NativeBoxShadow, StyledBaseButtonProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
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

type ShadowBorders = {
  borderWidth: number;
  borderColor: string;
  borderTopWidth: number;
  borderTopColor: string;
  borderBottomWidth: number;
  borderBottomColor: string;
};

/**
 * Converts NativeBoxShadow tokens into React Native border properties.
 * Multi-layer approximation: accumulates widths from all top/bottom shadows
 * and uses the primary (first) color for each edge.
 *
 *   spread > 0  → uniform outline border
 *   y > 0       → top highlight (inner top glow)
 *   y < 0       → bottom shadow (inner bottom depth)
 */
function buildShadowBorders(shadows: NativeBoxShadow | undefined): ShadowBorders {
  let borderWidth = 0;
  let borderColor = 'transparent';
  let borderTopWidth = 0;
  let borderTopColor = 'transparent';
  let borderBottomWidth = 0;
  let borderBottomColor = 'transparent';

  for (const shadow of shadows ?? []) {
    if (shadow.spread > 0) {
      borderWidth = 1;
      borderColor = shadow.color;
    } else if (shadow.y > 0) {
      // Accumulate top shadow widths for multi-layer depth; keep first color
      borderTopWidth += shadow.y;
      if (borderTopColor === 'transparent') borderTopColor = shadow.color;
    } else if (shadow.y < 0) {
      // Accumulate bottom shadow widths for multi-layer depth; keep first color
      borderBottomWidth += Math.abs(shadow.y);
      if (borderBottomColor === 'transparent') borderBottomColor = shadow.color;
    }
  }

  return { borderWidth, borderColor, borderTopWidth, borderTopColor, borderBottomWidth, borderBottomColor };
}

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
    defaultNativeBoxShadow,
    focusNativeBoxShadow,
    ...styledProps
  },
  ref,
) => {
  const { theme } = useTheme();
  const isPressed = useSharedValue(false);
  const duration = getIn(theme.motion, motionDuration);
  const easing = getIn(theme.motion, motionEasing);

  const defaultBorders = buildShadowBorders(defaultNativeBoxShadow);
  const focusBorders = buildShadowBorders(focusNativeBoxShadow);

  // Smooth 0→1 progress value driven by press state, used for color interpolation
  const pressProgress = useDerivedValue(() =>
    withTiming(isPressed.value ? 1 : 0, { duration, easing }),
  );

  const animatedStyles = useAnimatedStyle(() => {
    const progress = pressProgress.value;

    return {
      backgroundColor: withTiming(
        isPressed.value ? focusBackgroundColor : defaultBackgroundColor,
        { duration, easing },
      ) as string,

      // Outline border (uniform, from spread shadow)
      borderWidth: defaultBorders.borderWidth,
      borderColor: interpolateColor(progress, [0, 1], [
        defaultBorders.borderColor,
        focusBorders.borderColor || defaultBorders.borderColor,
      ]),

      // Top highlight — smooth width + color transition on press
      borderTopWidth: withTiming(
        isPressed.value ? focusBorders.borderTopWidth : defaultBorders.borderTopWidth,
        { duration, easing },
      ),
      borderTopColor: interpolateColor(progress, [0, 1], [
        defaultBorders.borderTopColor,
        focusBorders.borderTopColor || defaultBorders.borderTopColor,
      ]),

      // Bottom shadow — smooth width + color transition on press
      borderBottomWidth: withTiming(
        isPressed.value ? focusBorders.borderBottomWidth : defaultBorders.borderBottomWidth,
        { duration, easing },
      ),
      borderBottomColor: interpolateColor(progress, [0, 1], [
        defaultBorders.borderBottomColor,
        focusBorders.borderBottomColor || defaultBorders.borderBottomColor,
      ]),

      // Focus ring via shadow (iOS) — appears on press
      shadowColor: focusRingColor,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: withTiming(isPressed.value ? 4 : 0, { duration, easing }),
      shadowOpacity: withTiming(isPressed.value ? 0.5 : 0, { duration, easing }),
    };
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
        return children;
      }}
    </StyledPressable>
  );
};

const StyledBaseButton = assignWithoutSideEffects(React.forwardRef(_StyledBaseButton), {
  displayName: 'StyledBaseButton',
});

export default StyledBaseButton;
