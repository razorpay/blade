/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import type { SkeletonProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import type { BladeElementRef } from '~utils/types';

const AnimatedBox = Animated.createAnimatedComponent(BaseBox);

const _PulseAnimation = (
  props: SkeletonProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const durationPluseOff = theme.motion.duration.xmoderate;
  const durationPluseOn = theme.motion.duration['2xgentle'];
  const totalDuration = castNativeType(makeMotionTime(durationPluseOn + durationPluseOff));
  const easing = castNativeType(theme.motion.easing.emphasized);
  const progress = useSharedValue(0);

  const fadeIn = () => {
    'worklet';
    const animations = {
      opacity: withTiming(1, { duration: totalDuration, easing }),
    };
    const initialValues = {
      opacity: 0,
    };
    return {
      initialValues,
      animations,
    };
  };

  // Trigger pulsating animation
  React.useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration: totalDuration,
      easing,
    };
    progress.value = withRepeat(
      withSequence(
        withTiming(0, pulsatingAnimationTimingConfig),
        withTiming(1, pulsatingAnimationTimingConfig),
      ),
      -1,
      true,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [easing, progress, totalDuration]);

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [1, 0],
        [
          theme.colors.interactive.background.gray.highlighted,
          theme.colors.interactive.background.gray.default,
        ],
      ),
    };
  });

  return <AnimatedBox ref={ref as never} entering={fadeIn} style={pulseAnimatedStyle} {...props} />;
};

const PulseAnimation = React.forwardRef(_PulseAnimation);

export { PulseAnimation };
