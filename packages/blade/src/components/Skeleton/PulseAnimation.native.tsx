/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import Animated, {
  cancelAnimation,
  interpolateColor,
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

const hslaToRgba = (color: string): string => {
  const match = color.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)/,
  );
  if (!match) return color;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return `rgba(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}, ${a})`;
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

  const grayDefault = hslaToRgba(theme.colors.interactive.background.gray.default);
  const grayHighlighted = hslaToRgba(theme.colors.interactive.background.gray.highlighted);

  const opacity = useSharedValue(0);
  const pulseProgress = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: fadeInDuration, easing });

    pulseProgress.value = withDelay(
      fadeInDuration,
      withRepeat(withTiming(1, { duration: totalDuration, easing }), -1, true),
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(pulseProgress);
    };
  }, [easing, fadeInDuration, opacity, pulseProgress, totalDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: interpolateColor(
      pulseProgress.value,
      [0, 1],
      [grayDefault, grayHighlighted],
    ),
  }));

  return (
    <BaseBox ref={ref as never} {...props} style={{ overflow: 'hidden' }}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </BaseBox>
  );
};

const PulseAnimation = React.forwardRef(_PulseAnimation);

export { PulseAnimation };
