import React, { useEffect } from 'react';
import { Path } from 'react-native-svg';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { EasingFactoryFn, SharedValue } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DIMMED_OPACITY = 0.2;
const FULL_OPACITY = 1;

type AnimatedDonutSliceProps = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  /** Fixed start angle of the slice, in recharts degrees (CCW-positive with y flipped). */
  startAngle: number;
  /** Target end angle of the slice; the drawn arc sweeps from `startAngle` to here. */
  endAngle: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Shared 0→1 progress driving the sweep-in draw. Shared across every slice. */
  sweepProgress: SharedValue<number>;
  /** When true the slice fades to a muted opacity (another slice is active). */
  isDimmed: boolean;
  onPress?: () => void;
  /** Test ID for the slice, used for testing press interactions. */
  testID?: string;
  /** Stroke rings are non-interactive (mirrors the web pointer-events:none Pie). */
  isInteractive?: boolean;
  motionDuration: number;
  motionEasing: EasingFactoryFn;
};

/**
 * Builds an SVG path string for one annular sector (a donut slice) spanning the
 * radii `innerRadius`→`outerRadius`, sweeping from angle `a0` to `a1`.
 *
 * Angles follow the recharts convention used across the web DonutChart: degrees
 * measured counter-clockwise from the +x axis, converted to screen space with
 * `x = cx + r·cos(a)`, `y = cy − r·sin(a)`. Because slices are laid out clockwise
 * on screen (`a1 < a0`), the outer arc uses SVG sweep-flag 1 and the inner arc
 * (drawn in reverse) uses sweep-flag 0.
 *
 * Marked as a worklet so it can run on the UI thread inside `useAnimatedProps`.
 */
const getAnnularSectorPath = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  a0: number,
  a1: number,
): string => {
  'worklet';
  const sweepMag = Math.abs(a1 - a0);
  if (sweepMag <= 0.001) {
    return '';
  }

  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const outerStartX = cx + outerRadius * Math.cos(toRad(a0));
  const outerStartY = cy - outerRadius * Math.sin(toRad(a0));
  const outerEndX = cx + outerRadius * Math.cos(toRad(a1));
  const outerEndY = cy - outerRadius * Math.sin(toRad(a1));
  const innerEndX = cx + innerRadius * Math.cos(toRad(a1));
  const innerEndY = cy - innerRadius * Math.sin(toRad(a1));
  const innerStartX = cx + innerRadius * Math.cos(toRad(a0));
  const innerStartY = cy - innerRadius * Math.sin(toRad(a0));

  const largeArc = sweepMag > 180 ? 1 : 0;
  const outerSweep = a1 < a0 ? 1 : 0;
  const innerSweep = a1 < a0 ? 0 : 1;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} ${outerSweep} ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} ${innerSweep} ${innerStartX} ${innerStartY}`,
    'Z',
  ].join(' ');
};

/**
 * A single animated donut slice.
 *
 * - The sweep-in draw is produced by `useAnimatedProps` recomputing the arc `d`
 *   from the shared `sweepProgress` (mirrors recharts' mount/data-change draw-in).
 * - The highlight is an animated `opacity` (1 ↔ 0.2) — the touch equivalent of
 *   the web hover dim on non-active slices.
 *
 * A static `d`/`opacity` is also passed so the fully-drawn slice renders even in
 * environments where the reanimated driver is mocked (e.g. jest snapshots).
 */
const AnimatedDonutSlice = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  stroke,
  strokeWidth,
  sweepProgress,
  isDimmed,
  onPress,
  testID,
  isInteractive = true,
  motionDuration,
  motionEasing,
}: AnimatedDonutSliceProps): React.ReactElement => {
  const opacity = useSharedValue(FULL_OPACITY);

  useEffect(() => {
    opacity.value = withTiming(isDimmed ? DIMMED_OPACITY : FULL_OPACITY, {
      duration: motionDuration,
      easing: motionEasing,
    });
    return () => {
      cancelAnimation(opacity);
    };
  }, [isDimmed, motionDuration, motionEasing, opacity]);

  const animatedProps = useAnimatedProps(() => {
    const currentEnd = startAngle + (endAngle - startAngle) * sweepProgress.value;
    return {
      d: getAnnularSectorPath(cx, cy, innerRadius, outerRadius, startAngle, currentEnd),
      opacity: opacity.value,
    };
  });

  const staticPath = getAnnularSectorPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle);

  return (
    <AnimatedPath
      d={staticPath}
      fill={fill ?? 'transparent'}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={isDimmed ? DIMMED_OPACITY : FULL_OPACITY}
      animatedProps={animatedProps}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
    />
  );
};

export { AnimatedDonutSlice, getAnnularSectorPath };
