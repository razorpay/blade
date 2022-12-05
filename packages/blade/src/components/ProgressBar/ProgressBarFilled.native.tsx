import React, { useEffect } from 'react';
import styled from 'styled-components';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../BladeProvider';
import type { ProgressBarFilledProps } from './types';
import { castNativeType, getIn, makeMotionTime } from '~utils';

const AnimatedProgressBarFilled = styled(Animated.View)<
  Pick<ProgressBarFilledProps, 'backgroundColor' | 'progress'>
>(({ backgroundColor, progress }) => ({
  backgroundColor,
  width: `${progress}%`,
  height: '100%',
}));

const ProgressBarFilled = ({
  backgroundColor,
  progress,
  fillMotionDuration,
  motionEasing,
  pulseMotionDuration,
  pulseMotionDelay,
  showWaitingAnimation,
}: ProgressBarFilledProps): React.ReactElement => {
  const animatedWidth = useSharedValue(progress);
  const animatedOpacity = useSharedValue(1);
  const { theme } = useTheme();
  const easing = getIn(theme.motion, motionEasing);
  const pulseDuration =
    castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDuration))) / 2; // since we animate it with 2 steps in a sequence
  useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration: pulseDuration,
      easing,
    };
    if (showWaitingAnimation) {
      animatedOpacity.value = withDelay(
        castNativeType(makeMotionTime(getIn(theme.motion, pulseMotionDelay))),
        withRepeat(
          withSequence(
            withTiming(0.65, pulsatingAnimationTimingConfig),
            withTiming(1, pulsatingAnimationTimingConfig),
          ),
          -1,
        ),
      );
    }

    return () => {
      cancelAnimation(animatedOpacity);
    };
  }, [animatedOpacity, easing, pulseDuration, pulseMotionDelay, theme.motion]);

  useEffect(() => {
    const fillDuration = castNativeType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
    animatedWidth.value = withTiming(progress, {
      duration: fillDuration,
      easing,
    });
    return () => {
      cancelAnimation(animatedWidth);
    };
  }, [progress, animatedWidth, fillMotionDuration, motionEasing, theme.motion, easing]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
      opacity: animatedOpacity.value,
    };
  });

  return (
    <AnimatedProgressBarFilled
      style={animatedStyles}
      backgroundColor={backgroundColor}
      progress={progress}
    />
  );
};

export { ProgressBarFilled, ProgressBarFilledProps };
