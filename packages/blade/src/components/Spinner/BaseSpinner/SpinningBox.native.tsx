import getIn from 'lodash/get';
import React from 'react';
import type { EasingFactoryFn } from 'react-native-reanimated';
import Animated, {
  withTiming,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import { motion as spinnerMotion } from './spinnerTokens';
import { useTheme } from '~components/BladeProvider';
import { castNativeType } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';

const SpinningBox = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { theme } = useTheme();
  const duration = castNativeType(makeMotionTime(getIn(theme.motion, spinnerMotion.duration)));
  const easing = getIn(theme.motion, spinnerMotion.easing) as EasingFactoryFn;

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
  }, [duration, easing, rotation]);

  return (
    <BaseBox alignSelf="center">
      <Animated.View style={animatedStyles}>{children}</Animated.View>
    </BaseBox>
  );
};

export { SpinningBox };
