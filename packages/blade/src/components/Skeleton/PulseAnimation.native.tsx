/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import { StyleSheet } from 'react-native';
import type { SkeletonProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import type { BladeElementRef } from '~utils/types';

// Reanimated's interpolateColor doesn't support hsla(). Split into base hsl + alpha so we can animate it properly.
const parseHsla = (color: string): { base: string; alpha: number } => {
  const match = color.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+%)\s*,\s*([\d.]+%)\s*(?:,\s*([\d.]+))?\s*\)/,
  );
  if (!match) return { base: color, alpha: 1 };
  return {
    base: `hsl(${match[1]}, ${match[2]}, ${match[3]})`,
    alpha: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
};

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

const _PulseAnimation = (
  props: SkeletonProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const durationPulseOff = theme.motion.duration.xmoderate;
  const durationPulseOn = theme.motion.duration['2xgentle'];
  const totalDuration = castNativeType(makeMotionTime(durationPulseOn + durationPulseOff));
  const fadeInDuration = castNativeType(makeMotionTime(durationPulseOn));
  const easing = castNativeType(theme.motion.easing.standard);

  const grayDefault = parseHsla(theme.colors.interactive.background.gray.default);
  const grayHighlighted = parseHsla(theme.colors.interactive.background.gray.highlighted);

  const fadeIn = useSharedValue(0);
  const pulseProgress = useSharedValue(0);

  React.useEffect(() => {
    fadeIn.value = withTiming(1, { duration: fadeInDuration, easing });

    pulseProgress.value = withDelay(
      fadeInDuration,
      withRepeat(withTiming(1, { duration: totalDuration, easing }), -1, true),
    );

    return () => {
      cancelAnimation(fadeIn);
      cancelAnimation(pulseProgress);
    };
  }, [easing, fadeIn, fadeInDuration, pulseProgress, totalDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity:
      fadeIn.value *
      interpolate(pulseProgress.value, [0, 1], [grayDefault.alpha, grayHighlighted.alpha]),
    backgroundColor: grayDefault.base,
  }));

  return (
    <BaseBox ref={ref as never} {...props} style={{ overflow: 'hidden' }}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </BaseBox>
  );
};

const PulseAnimation = React.forwardRef(_PulseAnimation);

export { PulseAnimation };
