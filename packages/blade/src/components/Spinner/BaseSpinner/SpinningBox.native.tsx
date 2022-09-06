import React from 'react';
import type { EasingFunctionFactory } from 'react-native-reanimated';
import Animated, {
  withTiming,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import { motion as spinnerMotion } from './spinnerTokens';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeMotionTime } from '~utils';
import Box from '~components/Box';

const SpinningBox = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { theme } = useTheme();
  const duration = (makeMotionTime(
    getIn(theme.motion, spinnerMotion.duration),
  ) as unknown) as number;
  const easing = getIn(theme.motion, spinnerMotion.easing) as EasingFunctionFactory;

  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing,
      }),
      -1,
    );
    return (): void => {
      cancelAnimation(rotation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box alignSelf="center">
      <Animated.View style={animatedStyles}>{children}</Animated.View>
    </Box>
  );
};

export { SpinningBox };
