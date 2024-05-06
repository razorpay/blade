import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import React from 'react';
import type { TextInput } from 'react-native';
import type { AnimatedButtonContentProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';

const AnimatedButtonContent: React.ForwardRefRenderFunction<
  TextInput,
  AnimatedButtonContentProps & { children: React.ReactNode }
> = ({ motionDuration, motionEasing, children, isPressed }) => {
  const { theme } = useTheme();
  const duration = getIn(theme.motion, motionDuration);
  const easing = getIn(theme.motion, motionEasing);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(isPressed ? 0.95 : 1, {
            duration,
            easing,
          }),
        },
      ],
    };
  }, [isPressed]);

  return <Animated.View style={animatedStyles}>{children}</Animated.View>;
};

export default AnimatedButtonContent;
