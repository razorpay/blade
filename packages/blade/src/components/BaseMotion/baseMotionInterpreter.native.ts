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
import { Dimensions, useWindowDimensions } from 'react-native';
import type { ViewStyle } from 'react-native';
import {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { EasingFunction, EasingFunctionFactory } from 'react-native-reanimated';
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

const SUPPORTED_TRANSFORM_FUNCTIONS = new Set(['translateX', 'translateY', 'scale', 'rotate']);

type WindowDimensions = { width: number; height: number };

const getWindowDimensions = (): WindowDimensions => Dimensions.get('window');

/**
 * Parses a single CSS length token into a native numeric value.
 * - `px` / unitless → the raw number
 * - `vw` / `vh` → resolved against the current window dimensions
 * - `%` → cannot be resolved to px without layout measurement, degrades to 0
 *
 * Accepts an optional `dimensions` parameter so callers with fresh `useWindowDimensions`
 * values can avoid stale reads after orientation changes.
 */
const parseUnit = (raw: string, dimensions?: WindowDimensions): number => {
  const numeric = parseFloat(raw);
  if (Number.isNaN(numeric)) return 0;
  const dims = dimensions ?? getWindowDimensions();
  if (raw.includes('vw')) return (numeric / 100) * dims.width;
  if (raw.includes('vh')) return (numeric / 100) * dims.height;
  if (raw.trim().endsWith('%')) {
    // Percentage translate is relative to the element's own size which we can't measure here.
    // `0%` maps cleanly to 0; any other percentage degrades to 0 (documented limitation).
    if (__DEV__ && numeric !== 0) {
      logger({
        type: 'warn',
        moduleName: 'BaseMotion',
        message:
          `Percentage-based transform value "${raw}" is not supported on native (cannot resolve ` +
          'to px without layout measurement). It degrades to 0. Use absolute units (px) or ' +
          'vw/vh instead.',
      });
    }
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
  dimensions?: WindowDimensions,
): Pick<ResolvedVariantStyle, 'translateX' | 'translateY' | 'scale' | 'rotate'> => {
  const result: Pick<ResolvedVariantStyle, 'translateX' | 'translateY' | 'scale' | 'rotate'> = {};
  if (transform === undefined || transform === null) return result;

  const value = Array.isArray(transform) ? transform[transform.length - 1] : transform;
  if (Array.isArray(transform) && transform.length > 1 && __DEV__) {
    logger({
      type: 'warn',
      moduleName: 'BaseMotion',
      message:
        `Framer keyframe arrays (length ${transform.length}) are not supported on native — ` +
        'multi-step keyframe animations will appear as a single-step transition to the last ' +
        'keyframe value. This is a known Phase 1 limitation.',
    });
  }
  if (typeof value !== 'string') return result;

  const transformRegex = /(\w+)\(([^)]+)\)/g;
  let match: RegExpExecArray | null = transformRegex.exec(value);
  while (match !== null) {
    const fn = match[1];
    const raw = match[2].trim();
    if (fn === 'translateX') {
      result.translateX = parseUnit(raw, dimensions);
    } else if (fn === 'translateY') {
      result.translateY = parseUnit(raw, dimensions);
    } else if (fn === 'scale') {
      result.scale = parseFloat(raw);
    } else if (fn === 'rotate') {
      result.rotate = parseFloat(raw);
    } else if (__DEV__ && !SUPPORTED_TRANSFORM_FUNCTIONS.has(fn)) {
      logger({
        type: 'warn',
        moduleName: 'BaseMotion',
        message:
          `Transform function "${fn}" is not supported on native and will be silently dropped. ` +
          'Supported functions: translateX, translateY, scale, rotate.',
      });
    }
    match = transformRegex.exec(value);
  }

  return result;
};

const resolveScalar = (value: unknown): number | undefined => {
  const resolved = Array.isArray(value) ? value[value.length - 1] : value;
  if (typeof resolved === 'number') return resolved;
  if (typeof resolved === 'string') {
    return parseUnit(resolved);
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
const resolveVariantStyle = (
  variant?: MotionVariant,
  dimensions?: WindowDimensions,
): ResolvedVariantStyle => {
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
  if (variantRecord.color !== undefined) {
    resolved.color = resolveColor(variantRecord.color);
    if (__DEV__) {
      logger({
        type: 'warn',
        moduleName: 'BaseMotion',
        message:
          'Motion variant key "color" is not supported on native View components (it is a TextStyle-only property). ' +
          'The color animation will be silently ignored. This is a known Phase 1 limitation — ' +
          'color animation for text-bearing children will be addressed in the wrapper batch.',
      });
    }
  }
  if (variantRecord.transform !== undefined) {
    Object.assign(
      resolved,
      parseTransform(variantRecord.transform as string | string[], dimensions),
    );
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

type ReanimatedEasing = EasingFunction | EasingFunctionFactory;

/**
 * Converts a framer `transition` (seconds + bezier array) into reanimated `withTiming` config.
 *
 * `transition.delay` (framer, seconds) is surfaced as `delay` (ms) so callers can wrap the
 * `withTiming` in reanimated's `withDelay`. Presets that never set a delay resolve to `0`, which
 * makes `withDelay(0, …)` a no-op — keeping existing (non-delayed) behaviour intact while enabling
 * both standalone `<Fade delay />` and Stagger's per-child offset.
 */
const getTiming = (
  transition?: Tween,
): { duration: number; easing: ReanimatedEasing; delay: number } => {
  const durationSec =
    typeof transition?.duration === 'number' ? transition.duration : DEFAULT_DURATION_SEC;
  const ease = transition?.ease;
  let easing: ReanimatedEasing;
  if (Array.isArray(ease) && ease.length === 4 && ease.every((v) => typeof v === 'number')) {
    const [x1, y1, x2, y2] = (ease as unknown) as number[];
    easing = Easing.bezier(x1, y1, x2, y2);
  } else {
    easing = Easing.ease;
  }

  // `delay` is a valid framer transition option but is not declared on the narrower `Tween` type,
  // so we read it through a cast.
  const transitionDelay = (transition as (Tween & { delay?: number }) | undefined)?.delay;
  const delaySec = typeof transitionDelay === 'number' ? transitionDelay : 0;

  return { duration: durationSec * 1000, easing, delay: delaySec * 1000 };
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
    // `color` is a TextStyle-only property in React Native — it is silently ignored by RN's
    // View component (unlike web CSS where `color` cascades to children). This value is
    // intentionally resolved and included here so that the wrapper batch can forward it to
    // child Text components (e.g., via context or a nested styled Text). A __DEV__ warning is
    // emitted in `resolveVariantStyle` when the `color` variant key is used.
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
 *
 * Uses a ref to track the latest `variants` so that the animated-style worklet always reads
 * current values without adding `variants` to the effect dependency array (which would cause
 * unnecessary re-runs on every parent render).
 */
const useAnimatedVariant = ({
  variants,
  targetName,
  onAnimationComplete,
}: UseAnimatedVariantArgs): ReturnType<typeof useAnimatedStyle> => {
  const dimensions = useWindowDimensions();
  const fromStyle = useSharedValue<ResolvedVariantStyle>(
    resolveVariantStyle(variants?.initial, dimensions),
  );
  const toStyle = useSharedValue<ResolvedVariantStyle>(
    resolveVariantStyle(variants?.[targetName], dimensions),
  );
  const progress = useSharedValue(0);
  const previousTargetRef = React.useRef<keyof MotionVariantsType>('initial');

  // Keep a ref to the latest variants so the effect closure always sees fresh values without
  // needing to add `variants` to the dependency array.
  const variantsRef = React.useRef(variants);
  variantsRef.current = variants;

  // If variants were undefined on mount and become defined later, re-initialise shared values.
  React.useEffect(() => {
    if (variants && (!fromStyle.value || !toStyle.value)) {
      fromStyle.value = resolveVariantStyle(variants?.initial, dimensions);
      toStyle.value = resolveVariantStyle(variants?.[targetName], dimensions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  React.useEffect(() => {
    if (previousTargetRef.current === targetName) return;

    const currentVariants = variantsRef.current;
    const targetVariant = currentVariants?.[targetName];
    fromStyle.value = resolveVariantStyle(currentVariants?.[previousTargetRef.current], dimensions);
    toStyle.value = resolveVariantStyle(targetVariant, dimensions);
    previousTargetRef.current = targetName;

    const { duration, easing, delay } = getTiming(targetVariant?.transition);
    progress.value = 0;
    // `withDelay(0, …)` is equivalent to the bare `withTiming`, so non-delayed presets are
    // unaffected; a positive delay holds the element at its `from` style before animating.
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)(targetName);
        }
      }),
    );
    // Only re-run when the resolved target changes. Shared values are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetName]);

  return useAnimatedStyle(() => interpolateVariant(fromStyle.value, toStyle.value, progress.value));
};

export { resolveVariantStyle, parseTransform, parseUnit, getTiming, useAnimatedVariant };
export type { ResolvedVariantStyle };
