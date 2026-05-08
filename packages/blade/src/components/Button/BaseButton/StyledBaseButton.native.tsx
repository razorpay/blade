import { Linking, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';
import React from 'react';
import type { TextInput, GestureResponderEvent } from 'react-native';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
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

  return {
    ...getStyledBaseButtonStyles(props),
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
    ...styledProps
  },
  ref,
) => {
  const { theme } = useTheme();
  const isPressed = useSharedValue(false);
  const duration = getIn(theme.motion, motionDuration);
  const easing = getIn(theme.motion, motionEasing);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isPressed.value ? focusBackgroundColor : defaultBackgroundColor, {
        duration,
        easing,
      }),
      ...(variant !== 'tertiary' && {
        borderColor: withTiming(isPressed.value ? focusBorderColor : defaultBorderColor, {
          duration,
          easing,
        }),
      }),
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
