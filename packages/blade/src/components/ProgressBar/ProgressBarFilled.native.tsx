import React, { useEffect } from 'react';
import styled from 'styled-components';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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
  fillMotionEasing,
}: ProgressBarFilledProps): React.ReactElement => {
  const animatedWidth = useSharedValue(progress);
  const { theme } = useTheme();
  useEffect(() => {
    const duration = castNativeType(makeMotionTime(getIn(theme.motion, fillMotionDuration)));
    const easing = getIn(theme.motion, fillMotionEasing);
    animatedWidth.value = withTiming(progress, {
      duration,
      easing,
    });
  }, [progress, animatedWidth, fillMotionDuration, fillMotionEasing, theme.motion]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
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
