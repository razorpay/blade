/**
 * BaseMotion native interpreter
 *
 * framer-motion resolves declarative `variants={{ initial, animate, exit }}` + a target state
 * name into concrete styles for free. React Native has no such runtime, so this module
 * hand-rolls a *constrained subset* of that behaviour on top of `react-native-reanimated`:
 *
 * - `resolveVariantStyle` — reads the supported animatable keys off a variant object.
 * - `parseTransform` — turns CSS transform strings (`translateY(16px)`) into RN transform values.
 * - `useAnimatedVariant` — drives a single progress shared-value per transition and interpolates
 *   from the previously resolved style to the next one.
 *
 * Only a subset of variant keys is supported (the union used by the 7 motion presets):
 * `opacity`, `scale`, `x`/`y`, `rotate`, `transform`, `backgroundColor`, `color`, `borderRadius`.
 * Unsupported keys are ignored with a dev warning so wrapper authors get feedback.
 */
import React from 'react';
import { Dimensions } from 'react-native';
import type { ViewStyle } from 'react-native';
import {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Tween } from 'framer-motion';
import type { MotionVariantsType } from './types';
import { logger } from '~utils/logger';

type ResolvedVariantStyle = {
  opacity?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
  rotate?: number;
  borderRadius?: number;
  backgroundColor?: string;
  color?: string;
};

type MotionVariant = MotionVariantsType[keyof MotionVariantsType];

const DEFAULT_DURATION_SEC = 0.3;

const SUPPORTED_VARIANT_KEYS = new Set([
  'opacity',
  'scale',
  'x',
  'y',
  'rotate',
  'transform',
  'backgroundColor',
  'color',
  'borderRadius',
  // meta keys handled elsewhere / intentionally ignored
  'transition',
  'transitionEnd',
]);

/**
 * Parses a single CSS length token into a native numeric value.
 * - `px` / unitless → the raw number
 * - `vw` / `vh` → resolved against the current window dimensions
 * - `%` → cannot be resolved to px without layout measurement, degrades to 0
 */
const parseUnit = (raw: string): number => {
  const numeric = parseFloat(raw);
  if (Number.isNaN(numeric)) return 0;
  if (raw.includes('vw')) return (numeric / 100) * Dimensions.get('window').width;
  if (raw.includes('vh')) return (numeric / 100) * Dimensions.get('window').height;
  if (raw.trim().endsWith('%')) {
    // Percentage translate is relative to the element's own size which we can't measure here.
    // `0%` maps cleanly to 0; any other percentage degrades to 0 (documented limitation).
    return 0;
  }
  return numeric;
};

/**
 * Parses a CSS transform string (or framer keyframe array) into resolved transform values.
 *
 * framer keyframe arrays (`['translateY(16px)', 'translateY(0%)']`) cannot be replayed by a
 * single-shot reanimated transition, so we use the LAST entry as the resolved target.
 */
const parseTransform = (
  transform: string | string[] | undefined,
): Pick<ResolvedVariantStyle, 'translateX' | 'translateY' | 'scale' | 'rotate'> => {
  const result: Pick<ResolvedVariantStyle, 'translateX' | 'translateY' | 'scale' | 'rotate'> = {};
  if (transform === undefined || transform === null) return result;

  const value = Array.isArray(transform) ? transform[transform.length - 1] : transform;
  if (typeof value !== 'string') return result;

  const transformRegex = /(translateX|translateY|scale|rotate)\(([^)]+)\)/g;
  let match: RegExpExecArray | null = transformRegex.exec(value);
  while (match !== null) {
    const fn = match[1];
    const raw = match[2].trim();
    if (fn === 'translateX') {
      result.translateX = parseUnit(raw);
    } else if (fn === 'translateY') {
      result.translateY = parseUnit(raw);
    } else if (fn === 'scale') {
      result.scale = parseFloat(raw);
    } else if (fn === 'rotate') {
      result.rotate = parseFloat(raw);
    }
    match = transformRegex.exec(value);
  }

  return result;
};

const resolveScalar = (value: unknown): number | undefined => {
  const resolved = Array.isArray(value) ? value[value.length - 1] : value;
  if (typeof resolved === 'number') return resolved;
  if (typeof resolved === 'string') {
    const numeric = parseFloat(resolved);
    return Number.isNaN(numeric) ? undefined : numeric;
  }
  return undefined;
};

const resolveColor = (value: unknown): string | undefined => {
  const resolved = Array.isArray(value) ? value[value.length - 1] : value;
  return typeof resolved === 'string' ? resolved : undefined;
};

/**
 * Reads the supported animatable keys off a single variant object into a flat resolved style.
 * Unsupported keys are ignored with a dev warning.
 */
const resolveVariantStyle = (variant?: MotionVariant): ResolvedVariantStyle => {
  const resolved: ResolvedVariantStyle = {};
  if (!variant) return resolved;

  const variantRecord = variant as Record<string, unknown>;

  if (variantRecord.opacity !== undefined) resolved.opacity = resolveScalar(variantRecord.opacity);
  if (variantRecord.scale !== undefined) resolved.scale = resolveScalar(variantRecord.scale);
  if (variantRecord.x !== undefined) resolved.translateX = resolveScalar(variantRecord.x);
  if (variantRecord.y !== undefined) resolved.translateY = resolveScalar(variantRecord.y);
  if (variantRecord.rotate !== undefined) resolved.rotate = resolveScalar(variantRecord.rotate);
  if (variantRecord.borderRadius !== undefined) {
    resolved.borderRadius = resolveScalar(variantRecord.borderRadius);
  }
  if (variantRecord.backgroundColor !== undefined) {
    resolved.backgroundColor = resolveColor(variantRecord.backgroundColor);
  }
  if (variantRecord.color !== undefined) resolved.color = resolveColor(variantRecord.color);
  if (variantRecord.transform !== undefined) {
    Object.assign(resolved, parseTransform(variantRecord.transform as string | string[]));
  }

  if (__DEV__) {
    Object.keys(variantRecord).forEach((key) => {
      if (!SUPPORTED_VARIANT_KEYS.has(key)) {
        logger({
          type: 'warn',
          moduleName: 'BaseMotion',
          message: `Motion variant key "${key}" is not supported on native and will be ignored.`,
        });
      }
    });
  }

  return resolved;
};

/**
 * Converts a framer `transition` (seconds + bezier array) into reanimated `withTiming` config.
 */
const getTiming = (transition?: Tween) => {
  const durationSec =
    typeof transition?.duration === 'number' ? transition.duration : DEFAULT_DURATION_SEC;
  const ease = transition?.ease as unknown;
  const isBezierArray =
    Array.isArray(ease) && ease.length === 4 && ease.every((value) => typeof value === 'number');
  const easing = isBezierArray
    ? Easing.bezier(
        (ease as number[])[0],
        (ease as number[])[1],
        (ease as number[])[2],
        (ease as number[])[3],
      )
    : Easing.ease;

  return { duration: durationSec * 1000, easing };
};

const lerp = (from: number, to: number, progress: number): number => {
  'worklet';
  return from + (to - from) * progress;
};

/**
 * Worklet that interpolates every supported property from the `from` resolved style to the `to`
 * resolved style by the given progress (0 → 1).
 */
const interpolateVariant = (
  from: ResolvedVariantStyle,
  to: ResolvedVariantStyle,
  progress: number,
): ViewStyle => {
  'worklet';
  const style: ViewStyle = {};
  const transform: ViewStyle['transform'] = [];

  if (from.opacity !== undefined || to.opacity !== undefined) {
    style.opacity = lerp(from.opacity ?? 1, to.opacity ?? 1, progress);
  }

  if (from.scale !== undefined || to.scale !== undefined) {
    transform.push({ scale: lerp(from.scale ?? 1, to.scale ?? 1, progress) });
  }

  if (from.translateX !== undefined || to.translateX !== undefined) {
    transform.push({ translateX: lerp(from.translateX ?? 0, to.translateX ?? 0, progress) });
  }

  if (from.translateY !== undefined || to.translateY !== undefined) {
    transform.push({ translateY: lerp(from.translateY ?? 0, to.translateY ?? 0, progress) });
  }

  if (from.rotate !== undefined || to.rotate !== undefined) {
    transform.push({ rotate: `${lerp(from.rotate ?? 0, to.rotate ?? 0, progress)}deg` });
  }

  if (transform.length > 0) {
    style.transform = transform;
  }

  if (from.borderRadius !== undefined || to.borderRadius !== undefined) {
    const fromRadius = from.borderRadius ?? to.borderRadius ?? 0;
    const toRadius = to.borderRadius ?? from.borderRadius ?? 0;
    style.borderRadius = lerp(fromRadius, toRadius, progress);
  }

  if (to.backgroundColor !== undefined) {
    style.backgroundColor =
      from.backgroundColor !== undefined
        ? interpolateColor(progress, [0, 1], [from.backgroundColor, to.backgroundColor])
        : to.backgroundColor;
  }

  if (to.color !== undefined) {
    // `color` is not a ViewStyle key but is applied for text-bearing children; cast intentionally.
    (style as ViewStyle & { color?: string }).color =
      from.color !== undefined
        ? interpolateColor(progress, [0, 1], [from.color, to.color])
        : to.color;
  }

  return style;
};

type UseAnimatedVariantArgs = {
  variants?: MotionVariantsType;
  /** Current declarative target state: `'initial' | 'animate' | 'exit'`. */
  targetName: keyof MotionVariantsType;
  /** Fired (on the JS thread) when the transition to `targetName` completes uninterrupted. */
  onAnimationComplete?: (targetName: keyof MotionVariantsType) => void;
};

/**
 * Drives one progress shared-value per transition. On `targetName` change it interpolates from the
 * previously resolved style to the newly resolved one using the target variant's transition.
 */
const useAnimatedVariant = ({
  variants,
  targetName,
  onAnimationComplete,
}: UseAnimatedVariantArgs): ReturnType<typeof useAnimatedStyle> => {
  const fromStyle = useSharedValue<ResolvedVariantStyle>(resolveVariantStyle(variants?.initial));
  const toStyle = useSharedValue<ResolvedVariantStyle>(resolveVariantStyle(variants?.[targetName]));
  const progress = useSharedValue(0);
  const previousTargetRef = React.useRef<keyof MotionVariantsType>('initial');

  React.useEffect(() => {
    if (previousTargetRef.current === targetName) return;

    const targetVariant = variants?.[targetName];
    fromStyle.value = resolveVariantStyle(variants?.[previousTargetRef.current]);
    toStyle.value = resolveVariantStyle(targetVariant);
    previousTargetRef.current = targetName;

    const { duration, easing } = getTiming(targetVariant?.transition);
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing }, (finished) => {
      if (finished && onAnimationComplete) {
        runOnJS(onAnimationComplete)(targetName);
      }
    });
    // Only re-run when the resolved target changes. Shared values are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetName]);

  return useAnimatedStyle(() =>
    interpolateVariant(fromStyle.value, toStyle.value, progress.value),
  );
};

export { resolveVariantStyle, parseTransform, useAnimatedVariant };
export type { ResolvedVariantStyle };
