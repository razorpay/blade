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
import type { SkeletonProps } from './Skeleton';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

const AnimatedBox = Animated.createAnimatedComponent(BaseBox);

const PulseAnimation = ({
  contrast,
  ...props
}: { contrast: 'low' | 'high' } & SkeletonProps): React.ReactElement => {
  const { theme } = useTheme();
  const duration = castNativeType(makeMotionTime(theme.motion.duration['2xgentle']));
  const easing = castNativeType(theme.motion.easing.standard.revealing);
  const progress = useSharedValue(0);

  //Trigger pulsating animation
  React.useEffect(() => {
    const pulsatingAnimationTimingConfig = {
      duration,
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
  }, [progress, duration, easing, theme]);

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [1, 0],
        [
          theme.colors.brand.gray[300][`${contrast}Contrast`],
          theme.colors.brand.gray[400][`${contrast}Contrast`],
        ],
      ),
    };
  });

  return <AnimatedBox style={pulseAnimatedStyle} {...props} />;
};

export { PulseAnimation };
