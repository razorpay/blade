import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';
import getIn from '../../../utils/getIn';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const StyledPressable = styled(
  Animated.createAnimatedComponent(Pressable),
)((props: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) => getBaseButtonStyles(props));

const StyledBaseButton = ({
  onClick,
  children,
  minHeight,
  spacing,
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
  theme,
  isLoading,
}: StyledBaseButtonProps): React.ReactElement => {
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
      isLoading={isLoading}
      onPress={onClick}
      style={animatedStyles}
      minHeight={minHeight}
      spacing={spacing}
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

export default StyledBaseButton;
