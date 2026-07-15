import React from 'react';
import { StaggerContext } from './StaggerProvider';
import type { StaggerProps } from './types';
import type { MotionVariantsType } from '~components/BaseMotion';
import { Box } from '~components/Box';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~utils';

/**
 * ## Stagger (native)
 *
 * framer's `staggerChildren` + `AnimatePresence` have no React Native runtime, so on native the
 * orchestration is hand-built:
 *
 * 1. Children are enumerated + indexed via `React.Children.toArray` (stable keys).
 * 2. Each child gets a per-child `{ enter, exit }` delay: `enter = enterBase + index * interval`
 *    (forward) and `exit = exitBase + (count - 1 - index) * interval` (reverse — last child leaves
 *    first, giving a natural "unwind"; web has no `staggerDirection` so it exits forward).
 * 3. Every child is wrapped in its own `StaggerContext.Provider` carrying that delay plus the
 *    shared `staggerVisibility` target. `BaseMotionBox.native` reads the context and injects the
 *    delay into the resolved `transition.delay`, adopting `staggerVisibility` as its target.
 * 4. Mount / unmount is owned by the container (mirroring `BaseMotionEntryExit.native`): on hide
 *    with `shouldUnmountWhenHidden` we keep the tree mounted, let children run their staggered
 *    exit, and unmount only after the last child's exit completes.
 *
 * Unlike other motion presets, Stagger is not an enhancer — it renders a `Box` and accepts
 * `BoxProps`. A plain `Box` is used (not `BaseMotionBox`) because the web container's own
 * orchestration variants produce no visible animation on native.
 */
const Stagger = ({
  children,
  isVisible = true,
  type = 'inout',
  shouldUnmountWhenHidden = false,
  delay,
  // `motionTriggers` has no container-level effect on native (children animate in lockstep with
  // the container's visibility), so it is intentionally not forwarded.
  motionTriggers: _motionTriggers,
  ...boxProps
}: StaggerProps): React.ReactElement | null => {
  const { theme } = useTheme();

  const [isMounted, setIsMounted] = React.useState(shouldUnmountWhenHidden ? isVisible : true);

  // Synchronous read of the latest visibility for the deferred unmount callback, guarding against
  // rapid toggles (visible → hidden → visible before the exit animation completes).
  const isVisibleRef = React.useRef(isVisible);
  isVisibleRef.current = isVisible;

  React.useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
    }
    // On hide with `shouldUnmountWhenHidden` we stay mounted until the last child's exit completes
    // (see `handleStaggerComplete`), so there is nothing to do on the falsy branch.
  }, [isVisible]);

  const childArray = React.Children.toArray(children).filter(React.isValidElement);
  const count = childArray.length;

  // `interval` mirrors web `staggerChildren`; `enterBase` / `exitBase` mirror web `delayChildren`.
  const interval = msToSeconds(theme.motion.duration['2xquick']);
  const enterDelayToken = typeof delay === 'object' ? delay.enter : delay;
  const exitDelayToken = typeof delay === 'object' ? delay.exit : delay;
  const enterBase = enterDelayToken ? msToSeconds(theme.motion.delay[enterDelayToken]) : 0;
  const exitBase = exitDelayToken ? msToSeconds(theme.motion.delay[exitDelayToken]) : 0;

  const staggerVisibility: keyof MotionVariantsType = isVisible ? 'animate' : 'exit';

  // With reverse exit, index 0 carries the largest exit delay `(count - 1) * interval`, so it is
  // the last child to finish and drives the container's deferred unmount.
  const lastStaggerChildIndex = 0;

  const handleStaggerComplete = React.useCallback(
    (targetName: keyof MotionVariantsType) => {
      if (targetName !== 'exit' || !shouldUnmountWhenHidden) return;
      // Defer to the next frame so the unmount is decoupled from the reanimated timing callback
      // (which fires on the UI thread), and re-check visibility in case it flipped back.
      requestAnimationFrame(() => {
        if (!isVisibleRef.current) {
          setIsMounted(false);
        }
      });
    },
    [shouldUnmountWhenHidden],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <Box display="flex" flexWrap="wrap" {...boxProps}>
      {childArray.map((child, index) => (
        <StaggerContext.Provider
          key={(child as React.ReactElement).key ?? index}
          value={{
            isInsideStaggerContainer: true,
            staggerType: type,
            staggerVisibility,
            staggerDelay: {
              enter: enterBase + index * interval,
              exit: exitBase + (count - 1 - index) * interval,
            },
            isLastStaggerChild: index === lastStaggerChildIndex,
            onStaggerComplete: handleStaggerComplete,
          }}
        >
          {child}
        </StaggerContext.Provider>
      ))}
    </Box>
  );
};

export { Stagger };
