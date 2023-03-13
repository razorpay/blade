import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';
import React from 'react';
import type { TextInput } from 'react-native';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
import { getIn } from '~utils';
import { useTheme } from '~components/BladeProvider';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const StyledPressable = styled(Animated.createAnimatedComponent(Pressable))<
  Omit<StyledBaseButtonProps, 'accessibilityProps'>
>((props) => ({
  ...getStyledBaseButtonStyles(props),
  alignSelf: 'center',
}));

const _StyledBaseButton: React.ForwardRefRenderFunction<BladeElementRef, StyledBaseButtonProps> = (
  {
    onClick,
    children,
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
    activeBackgroundColor,
    focusBackgroundColor,
    focusRingColor,
    hoverBorderColor,
    activeBorderColor,
    focusBorderColor,
    borderWidth,
    borderRadius,
    motionDuration,
    motionEasing,
    isLoading,
    accessibilityProps,
  },
  ref,
) => {
  const { theme } = useTheme();
  const isPressed = useSharedValue(false);
  const duration = getIn(theme.motion, motionDuration);
  const easing = getIn(theme.motion, motionEasing);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isPressed.value ? activeBackgroundColor : defaultBackgroundColor,
        {
          duration,
          easing,
        },
      ),
      borderColor: withTiming(isPressed.value ? activeBorderColor : defaultBorderColor, {
        duration,
        easing,
      }),
    };
  });

  return (
    <StyledPressable
      {...accessibilityProps}
      ref={ref as React.RefObject<TextInput>}
      isLoading={isLoading}
      onPress={onClick}
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
      activeBackgroundColor={activeBackgroundColor}
      focusBackgroundColor={focusBackgroundColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      activeBorderColor={activeBorderColor}
      focusBorderColor={focusBorderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
    >
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
