import React from 'react';
import type { ViewStyle } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import type { MorphProps } from './types';
import { MotionDiv } from '~components/BaseMotion';
// Unsuffixed import: Metro resolves `useMemoizedStyles.native.ts`, which returns the same
// `{ backgroundColor, borderRadius }` shape (numeric radius, colour string) as the web helper.
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles';
import type { BoxProps } from '~components/Box';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~utils';

/**
 * Morph (native — DEGRADED).
 *
 * The web `Morph` builds on framer-motion's `layout`/`layoutId` FLIP + shared-element morph, which
 * has no equivalent in react-native-reanimated 3.4.2. So the native implementation is a graceful
 * degradation:
 *
 * - Safe passthrough render of the single child.
 * - A same-instance `backgroundColor`/`borderRadius`/`opacity` tween via the native BaseMotion
 *   engine (`MotionDiv` = `styled(Animated.View)`). The tween only plays when *this* instance's
 *   child props change; it cannot bridge two distinct mount/unmount elements.
 * - `layoutId` is accepted for API parity but intentionally ignored (no shared-element runtime on
 *   native). It is a legitimate web prop, so no runtime warning is emitted.
 *
 * Across `AnimatePresence` branch swaps (all current stories) native shows an instant element swap
 * rather than a geometric morph — this is the documented, expected delta, not a defect.
 */
const Morph = ({ children }: MorphProps): React.ReactElement => {
  const { theme } = useTheme();

  // Mirror the web path: pull bg/radius off the child and resolve them to concrete style values.
  const childProps = children.props as Record<string, unknown>;
  const { borderRadius, backgroundColor } = childProps;
  const cssProps = useMemoizedStyles(({
    borderRadius,
    backgroundColor,
    theme,
  } as unknown) as BoxProps & { theme: Theme });

  const toRadius = typeof cssProps.borderRadius === 'number' ? cssProps.borderRadius : undefined;
  const toColor =
    typeof cssProps.backgroundColor === 'string' ? cssProps.backgroundColor : undefined;

  const progress = useSharedValue(0);
  const fromRadius = useSharedValue(toRadius ?? 0);
  const toRadiusSV = useSharedValue(toRadius ?? 0);
  // Default the colour endpoints to the resolved target so the first frame doesn't flash from
  // `transparent` when a start colour isn't known yet.
  const fromColor = useSharedValue(toColor ?? 'transparent');
  const toColorSV = useSharedValue(toColor ?? 'transparent');

  const duration = theme.motion.duration.moderate; // ms — passed straight into `withTiming`
  // On native `theme.motion.easing.standard` is already an `EasingFactoryFn` (from `makeBezier`).
  // No `cssBezierToArray` / `msToSeconds` parsing needed (those are web-only concerns).
  const easing = theme.motion.easing.standard;

  // Re-run the tween whenever the resolved target changes (same-instance morph only).
  React.useEffect(() => {
    fromRadius.value = toRadiusSV.value;
    toRadiusSV.value = toRadius ?? fromRadius.value;
    fromColor.value = toColorSV.value;
    toColorSV.value = toColor ?? fromColor.value;
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toColor, toRadius]);

  const animatedStyle = useAnimatedStyle(() => {
    const style: ViewStyle = { opacity: 1 };
    if (toColor !== undefined) {
      style.backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        [fromColor.value, toColorSV.value],
      );
    }
    if (toRadius !== undefined) {
      style.borderRadius =
        fromRadius.value + (toRadiusSV.value - fromRadius.value) * progress.value;
    }
    return style;
  });

  // Strip bg/radius from the child so they animate on the wrapper (mirrors web moving them into
  // framer's `animate`), avoiding a double-applied value on both child and wrapper.
  const child = React.cloneElement(children, {
    backgroundColor: undefined,
    borderRadius: undefined,
  });

  return <MotionDiv style={animatedStyle}>{child}</MotionDiv>;
};

export { Morph };
