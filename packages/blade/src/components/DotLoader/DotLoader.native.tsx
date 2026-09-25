import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  dotLoaderTokens,
  dotLoaderGeometry,
  DOT_INDEXES,
  REDUCED_MOTION_LIFTED_DOT_INDEX,
} from './dotLoaderTokens';
import type { DotLoaderProps, DotLoaderSize } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const makeSizeStyles = (size: DotLoaderSize): { box: ViewStyle; dot: ViewStyle } => {
  const { boxSize, dotSize } = dotLoaderGeometry[size];

  return {
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: boxSize,
      height: boxSize,
    },
    dot: {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
    },
  } as const;
};

const stylesBySize = {
  medium: StyleSheet.create(makeSizeStyles('medium')),
  large: StyleSheet.create(makeSizeStyles('large')),
};

/**
 * Segment durations matching the web keyframes: rise to the peak, fall back to
 * rest, then hold at rest for the tail of the loop. Easing is applied per segment
 * (rather than across the whole loop) so the motion matches CSS `ease-in-out` on
 * a multi-stop keyframe animation.
 */
const riseDurationMs = dotLoaderTokens.durationMs * dotLoaderTokens.peakProgress;
const fallDurationMs =
  dotLoaderTokens.durationMs * (dotLoaderTokens.restProgress - dotLoaderTokens.peakProgress);
const holdDurationMs = dotLoaderTokens.durationMs * (1 - dotLoaderTokens.restProgress);

/**
 * A single dot. `progress` runs 0 (rest) to 1 (peak); position and opacity are
 * derived from it so the two stay in lockstep.
 */
const Dot = ({
  dotIndex,
  color,
  size,
  isReducedMotion,
}: {
  dotIndex: number;
  color: string;
  size: DotLoaderSize;
  isReducedMotion: boolean;
}): React.ReactElement => {
  const progress = useSharedValue(
    isReducedMotion && dotIndex === REDUCED_MOTION_LIFTED_DOT_INDEX ? 1 : 0,
  );

  React.useEffect(() => {
    if (isReducedMotion) {
      // Static Figma pose: outer dots at rest, middle dot held at its peak.
      cancelAnimation(progress);
      progress.value = dotIndex === REDUCED_MOTION_LIFTED_DOT_INDEX ? 1 : 0;
      return undefined;
    }

    const easing = Easing.inOut(Easing.ease);
    progress.value = withDelay(
      dotIndex * dotLoaderTokens.staggerMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: riseDurationMs, easing }),
          withTiming(0, { duration: fallDurationMs, easing }),
          withTiming(0, { duration: holdDurationMs }),
        ),
        -1,
        false,
      ),
    );

    return (): void => {
      cancelAnimation(progress);
    };
  }, [dotIndex, isReducedMotion, progress]);

  // Read outside the worklet so it captures plain numbers.
  const { lift, gap } = dotLoaderGeometry[size];

  const animatedStyle = useAnimatedStyle(() => ({
    // Up only — never below the rest line.
    transform: [{ translateY: -lift * progress.value }],
    opacity:
      dotLoaderTokens.restOpacity +
      (dotLoaderTokens.peakOpacity - dotLoaderTokens.restOpacity) * progress.value,
  }));

  return (
    <Animated.View
      style={[
        stylesBySize[size].dot,
        { backgroundColor: color },
        // RN has no `gap` on older versions; space the dots with a leading margin.
        dotIndex > 0 ? { marginLeft: gap } : null,
        animatedStyle,
      ]}
    />
  );
};

const DotLoader = ({
  color = 'interactive.icon.gray.muted',
  size = 'medium',
  accessibilityLabel,
  testID,
}: DotLoaderProps): React.ReactElement => {
  const { theme } = useTheme();
  const resolvedColor = getIn(theme.colors, color);
  const isReducedMotion = useReducedMotion();

  const accessibilityProps = accessibilityLabel
    ? ({
        accessible: true,
        accessibilityRole: 'progressbar',
        accessibilityLabel,
      } as const)
    : ({
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
      } as const);

  return (
    <View
      style={stylesBySize[size].box}
      {...accessibilityProps}
      {...metaAttribute({ name: MetaConstants.DotLoader, testID })}
    >
      {DOT_INDEXES.map((dotIndex) => (
        <Dot
          key={dotIndex}
          dotIndex={dotIndex}
          color={resolvedColor}
          size={size}
          isReducedMotion={isReducedMotion}
        />
      ))}
    </View>
  );
};

export { DotLoader };
