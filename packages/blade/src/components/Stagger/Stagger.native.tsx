import React from 'react';
import { StaggerContext } from './StaggerProvider';
import type { StaggerProps } from './types';
import type { MotionVariantsType } from '~components/BaseMotion';
import { Box } from '~components/Box';
import { useTheme } from '~utils';

type VisibilityTarget = Extract<keyof MotionVariantsType, 'animate' | 'exit'>;

/**
 * `React.Children.toArray` does **not** flatten Fragments (React 18). Storybook args and many
 * call sites wrap stagger children in `<>...</>`, which would otherwise yield `count === 1` and
 * one shared context — every child then animates in lockstep. Recurse into Fragments so each
 * motion preset gets its own delay / visibility target.
 */
const flattenStaggerChildren = (nodes: React.ReactNode): React.ReactElement[] => {
  const result: React.ReactElement[] = [];
  React.Children.forEach(nodes, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === React.Fragment) {
      result.push(
        ...flattenStaggerChildren((child.props as { children?: React.ReactNode }).children),
      );
      return;
    }
    result.push(child);
  });
  return result;
};

/**
 * ## Stagger (native)
 *
 * framer's `staggerChildren` has no React Native runtime. Native orchestration:
 *
 * 1. Enumerate children (flattening Fragments) with `flattenStaggerChildren`.
 * 2. Keep a per-child visibility target (`animate` | `exit`). When container `isVisible` flips,
 *    update those targets one-by-one via `setTimeout` (forward on enter and exit, matching web).
 * 3. Each child reads its target as `staggerVisibility` from context — the same signal that
 *    already drives show/hide correctly. Animation delay stays 0; the cascade is *when* the
 *    target flips, not a reanimated `withDelay`.
 *
 * Unlike other motion presets, Stagger is not an enhancer — it renders a `Box` and accepts
 * `BoxProps`.
 */
const Stagger = ({
  children,
  isVisible = true,
  type = 'inout',
  shouldUnmountWhenHidden = false,
  delay,
  motionTriggers: _motionTriggers,
  ...boxProps
}: StaggerProps): React.ReactElement | null => {
  const { theme } = useTheme();

  const childArray = flattenStaggerChildren(children);
  const count = childArray.length;

  // Milliseconds — theme motion tokens are already ms on native.
  // Match web `staggerChildren: duration['2xquick']` (80ms).
  const intervalMs = theme.motion.duration['2xquick'];
  const enterDelayToken = typeof delay === 'object' ? delay.enter : delay;
  const exitDelayToken = typeof delay === 'object' ? delay.exit : delay;
  const enterBaseMs = enterDelayToken ? theme.motion.delay[enterDelayToken] : 0;
  const exitBaseMs = exitDelayToken ? theme.motion.delay[exitDelayToken] : 0;
  const exitAnimationMs = theme.motion.duration.xquick;

  const [isMounted, setIsMounted] = React.useState(shouldUnmountWhenHidden ? isVisible : true);
  // Start in `exit` so the first enter also cascades (same as web mount stagger).
  const [childTargets, setChildTargets] = React.useState<VisibilityTarget[]>(() =>
    Array.from({ length: count }, () => 'exit'),
  );

  const isVisibleRef = React.useRef(isVisible);
  isVisibleRef.current = isVisible;

  React.useEffect(() => {
    setChildTargets((prev) => {
      if (prev.length === count) return prev;
      return Array.from({ length: count }, (_, i) => prev[i] ?? 'exit');
    });
  }, [count]);

  React.useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (isVisible) {
      setIsMounted(true);
      for (let index = 0; index < count; index += 1) {
        const waitMs = enterBaseMs + index * intervalMs;
        timeouts.push(
          setTimeout(() => {
            setChildTargets((prev) => {
              if (prev[index] === 'animate') return prev;
              const next = [...prev];
              next[index] = 'animate';
              return next;
            });
          }, waitMs),
        );
      }
    } else {
      // Forward exit (index 0 first) — matches web framer `staggerChildren` (no reverse).
      for (let index = 0; index < count; index += 1) {
        const waitMs = exitBaseMs + index * intervalMs;
        timeouts.push(
          setTimeout(() => {
            setChildTargets((prev) => {
              if (prev[index] === 'exit') return prev;
              const next = [...prev];
              next[index] = 'exit';
              return next;
            });
          }, waitMs),
        );
      }

      if (shouldUnmountWhenHidden) {
        const totalExitMs = exitBaseMs + Math.max(count - 1, 0) * intervalMs + exitAnimationMs;
        timeouts.push(
          setTimeout(() => {
            if (!isVisibleRef.current) {
              setIsMounted(false);
            }
          }, totalExitMs),
        );
      }
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [
    isVisible,
    count,
    enterBaseMs,
    exitBaseMs,
    intervalMs,
    exitAnimationMs,
    shouldUnmountWhenHidden,
  ]);

  if (!isMounted) {
    return null;
  }

  return (
    <Box display="flex" flexWrap="wrap" {...boxProps}>
      {childArray.map((child, index) => (
        <StaggerContext.Provider
          key={child.key ?? index}
          value={{
            isInsideStaggerContainer: true,
            staggerType: type,
            // Per-child target — flipped on a timer. No staggerDelay: animation starts immediately
            // when this target changes, which is what produces the visible cascade.
            staggerVisibility: childTargets[index] ?? 'exit',
          }}
        >
          {child}
        </StaggerContext.Provider>
      ))}
    </Box>
  );
};

export { Stagger };
