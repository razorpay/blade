import React from 'react';
import { findNodeHandle, UIManager, View } from 'react-native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import type { MorphProps } from './types';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles';
import type { BoxProps } from '~components/Box';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~utils';
import { logger } from '~utils/logger';

type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  ts: number;
};

/**
 * Live window bounds for currently mounted Morphs (updated on every layout).
 * Copied into `pendingHandoffs` on unmount so the next Morph with the same
 * `layoutId` can FLIP from the previous element's position (e.g. card center → page top).
 */
const liveLayouts = new Map<string, LayoutRect>();
const pendingHandoffs = new Map<string, LayoutRect>();
// Timers for self-expiring pendingHandoffs entries, keyed by layoutId.
const handoffTimers = new Map<string, ReturnType<typeof setTimeout>>();

const HANDOFF_TTL_MS = 1500;

const measureNodeInWindow = (node: View | null, onMeasured: (rect: LayoutRect) => void): void => {
  if (!node) return;

  // Prefer UIManager + findNodeHandle — reliable for both View and host refs.
  const handle = findNodeHandle(node);
  if (handle != null && typeof UIManager.measureInWindow === 'function') {
    UIManager.measureInWindow(handle, (x, y, width, height) => {
      if (!(width > 0 && height > 0)) return;
      onMeasured({ x, y, width, height, ts: Date.now() });
    });
    return;
  }

  // Fallback: View.measure → pageX / pageY are window-relative.
  const measurable = node as View & {
    measure?: (
      cb: (x: number, y: number, w: number, h: number, pageX: number, pageY: number) => void,
    ) => void;
  };
  if (typeof measurable.measure === 'function') {
    measurable.measure((_x, _y, width, height, pageX, pageY) => {
      if (!(width > 0 && height > 0)) return;
      onMeasured({ x: pageX, y: pageY, width, height, ts: Date.now() });
    });
  }
};

/**
 * Morph (native) — approximates web framer `layout`/`layoutId` FLIP.
 *
 * MorphOnText: card heading (center) unmounts → page Display (top) mounts starting at the
 * card's window position, then animates to the top.
 */
const Morph = ({ children, layoutId }: MorphProps): React.ReactElement => {
  const { theme } = useTheme();
  const measureRef = React.useRef<View>(null);
  const lastKnownLayout = React.useRef<LayoutRect | null>(null);
  const incomingHandoff = React.useRef<LayoutRect | null>(null);
  const hasPlayedHandoff = React.useRef(false);
  const rafIdRef = React.useRef<number | null>(null);

  // Guard: Morph expects a single React element child (e.g. <Box>) so it can read
  // borderRadius/backgroundColor from props and clone it. Strings, numbers, arrays,
  // fragments, or null are not valid — render them as-is without animation.
  if (!React.isValidElement(children)) {
    return <>{children}</>;
  }

  const childProps = children.props as Record<string, unknown>;
  const rawBorderRadius = childProps.borderRadius;
  const rawBackgroundColor = childProps.backgroundColor;
  const cssProps = useMemoizedStyles(({
    borderRadius: rawBorderRadius,
    backgroundColor: rawBackgroundColor,
    theme,
  } as unknown) as BoxProps & { theme: Theme });

  const toRadius = typeof cssProps.borderRadius === 'number' ? cssProps.borderRadius : undefined;
  const toColor =
    typeof cssProps.backgroundColor === 'string' ? cssProps.backgroundColor : undefined;

  const progress = useSharedValue(0);
  const fromRadius = useSharedValue(toRadius ?? 0);
  const toRadiusSV = useSharedValue(toRadius ?? 0);
  const fromColor = useSharedValue(toColor ?? 'transparent');
  const toColorSV = useSharedValue(toColor ?? 'transparent');

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  // Hidden until we know whether to FLIP from a previous layoutId instance.
  const opacity = useSharedValue(0);

  const duration = theme.motion.duration.gentle ?? theme.motion.duration.moderate;
  const easing = theme.motion.easing.standard;
  const timingConfig = React.useMemo(() => ({ duration, easing }), [duration, easing]);

  // Grab any pending handoff synchronously before paint of children that replace us.
  React.useLayoutEffect(() => {
    const prev = pendingHandoffs.get(layoutId);
    if (prev && Date.now() - prev.ts < HANDOFF_TTL_MS) {
      pendingHandoffs.delete(layoutId);
      // Clear any pending self-expiry timer since we consumed the entry.
      const timer = handoffTimers.get(layoutId);
      if (timer) {
        clearTimeout(timer);
        handoffTimers.delete(layoutId);
      }
      incomingHandoff.current = prev;
      if (__DEV__) {
        logger({
          moduleName: 'Morph',
          type: 'log',
          message: `consumed handoff for "${layoutId}" from y=${Math.round(prev.y)}`,
        });
      }
    }

    return () => {
      const live = liveLayouts.get(layoutId) ?? lastKnownLayout.current;
      if (live) {
        pendingHandoffs.set(layoutId, { ...live, ts: Date.now() });
        // Self-expiry: if no subsequent Morph with the same layoutId consumes this
        // entry within the TTL, clean it up to prevent unbounded Map growth.
        const existingTimer = handoffTimers.get(layoutId);
        if (existingTimer) clearTimeout(existingTimer);
        handoffTimers.set(
          layoutId,
          setTimeout(() => {
            pendingHandoffs.delete(layoutId);
            handoffTimers.delete(layoutId);
          }, HANDOFF_TTL_MS),
        );
        if (__DEV__) {
          logger({
            moduleName: 'Morph',
            type: 'log',
            message: `stashed handoff for "${layoutId}" at y=${Math.round(live.y)}`,
          });
        }
      }
      liveLayouts.delete(layoutId);
    };
  }, [layoutId]);

  const playHandoffIfNeeded = React.useCallback(
    (current: LayoutRect): void => {
      lastKnownLayout.current = current;
      liveLayouts.set(layoutId, current);

      if (hasPlayedHandoff.current) return;

      const prev = incomingHandoff.current;
      if (prev && prev.width > 0 && prev.height > 0) {
        // Strict Mode guard: in dev, React mounts → unmounts → remounts. The cleanup
        // stashes the live layout into pendingHandoffs, and the second mount consumes
        // it — causing a spurious self-FLIP. Skip if the incoming handoff dimensions
        // match the current element's dimensions (same element, not a true handoff).
        const isSameElement =
          Math.abs(prev.width - current.width) < 1 &&
          Math.abs(prev.height - current.height) < 1 &&
          Math.abs(prev.x - current.x) < 1 &&
          Math.abs(prev.y - current.y) < 1;
        if (isSameElement) {
          incomingHandoff.current = null;
          hasPlayedHandoff.current = true;
          opacity.value = withTiming(1, { duration: theme.motion.duration.xquick, easing });
          return;
        }

        hasPlayedHandoff.current = true;
        incomingHandoff.current = null;

        const startTX = prev.x + prev.width / 2 - (current.x + current.width / 2);
        const startTY = prev.y + prev.height / 2 - (current.y + current.height / 2);
        const startSX = Math.max(0.01, prev.width / current.width);
        const startSY = Math.max(0.01, prev.height / current.height);

        if (__DEV__) {
          logger({
            moduleName: 'Morph',
            type: 'log',
            message: `FLIP "${layoutId}" Δy=${Math.round(startTY)} scale=${startSX.toFixed(2)}`,
          });
        }

        // Pose at previous element (center of card) first…
        translateX.value = startTX;
        translateY.value = startTY;
        scaleX.value = startSX;
        scaleY.value = startSY;
        opacity.value = 1;

        // …then animate to natural layout (top).
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          translateX.value = withTiming(0, timingConfig);
          translateY.value = withTiming(0, timingConfig);
          scaleX.value = withTiming(1, timingConfig);
          scaleY.value = withTiming(1, timingConfig);
        });
        return;
      }

      // Cold mount — fade in at natural position.
      hasPlayedHandoff.current = true;
      opacity.value = withTiming(1, { duration: theme.motion.duration.xquick, easing });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutId, timingConfig, theme.motion.duration.xquick, easing],
  );

  React.useEffect(() => {
    fromRadius.value = toRadiusSV.value;
    toRadiusSV.value = toRadius ?? fromRadius.value;
    fromColor.value = toColorSV.value;
    toColorSV.value = toColor ?? fromColor.value;
    progress.value = 0;
    progress.value = withTiming(1, timingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toColor, toRadius]);

  const onLayout = React.useCallback(
    (_e: LayoutChangeEvent) => {
      measureNodeInWindow(measureRef.current, playHandoffIfNeeded);
    },
    [playHandoffIfNeeded],
  );

  // Retry measure — first onLayout can run before text has intrinsic size.
  React.useEffect(() => {
    const ids = [32, 100, 250].map((ms) =>
      setTimeout(() => {
        if (!hasPlayedHandoff.current) {
          measureNodeInWindow(measureRef.current, playHandoffIfNeeded);
        }
      }, ms),
    );
    // Safety-net: if all measurement attempts fail (off-screen, zero size, unresponsive
    // bridge), unconditionally reveal the element so it doesn't stay invisible forever.
    const safetyNetId = setTimeout(() => {
      if (!hasPlayedHandoff.current) {
        hasPlayedHandoff.current = true;
        opacity.value = withTiming(1, { duration: theme.motion.duration.xquick, easing });
        if (__DEV__) {
          logger({
            moduleName: 'Morph',
            type: 'warn',
            message: `safety-net timeout fired for "${layoutId}" — revealing without FLIP`,
          });
        }
      }
    }, 500);
    return () => {
      ids.forEach(clearTimeout);
      clearTimeout(safetyNetId);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [playHandoffIfNeeded]);

  const animatedStyle = useAnimatedStyle(() => {
    const style: ViewStyle = {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
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

  const child = React.cloneElement(children, {
    backgroundColor: undefined,
    borderRadius: undefined,
  } as Partial<Record<string, undefined>> & React.Attributes);

  return (
    // Outer RN View owns measurement; inner Reanimated view owns the FLIP transform.
    <View ref={measureRef} collapsable={false} onLayout={onLayout} style={{ alignSelf: 'center' }}>
      <Animated.View style={animatedStyle}>{child}</Animated.View>
    </View>
  );
};

export { Morph };
