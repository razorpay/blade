import React from 'react';
import type { FadeProps } from './types';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { useTheme } from '~utils';
import { msToSeconds } from '~utils/msToSeconds';

/**
 * On native, `theme.motion.easing.*` resolves to a reanimated `EasingFactoryFn` (not a
 * `cubic-bezier(...)` string), so the web approach of `cssBezierToArray(castWebType(...))` would
 * crash. Instead we supply `ease` as the 4-number bezier control-point array that the native
 * interpreter's `getTiming` feeds into `Easing.bezier(...ease)`.
 *
 * These arrays mirror the exact control points of the `entrance` / `exit` easing tokens defined in
 * `~tokens/global/motion`:
 * - entrance → `cubic-bezier(0, 0, 0.2, 1)`
 * - exit     → `cubic-bezier(0.17, 0, 1, 1)`
 *
 * **Sync risk:** These are hardcoded duplicates of the token values. If the token definitions
 * change, these arrays must be updated manually. The same pattern exists in `Move.native.tsx`
 * and `Scale.native.tsx`. There is currently no automated sync mechanism — a unit test should be
 * added to assert these arrays match the token definitions.
 */
const ENTRANCE_EASING: [number, number, number, number] = [0, 0, 0.2, 1];
const EXIT_EASING: [number, number, number, number] = [0.17, 0, 1, 1];

/**
 * ## Fade
 *
 * Fade is one of the motion presets that we expose from blade to help you fade in / fade out components easily.
 *
 * ### Usage
 *
 * #### Fade in on mount
 *
 * ```jsx
 * <Fade>
 *   <Card />
 * </Fade>
 * ```
 *
 * #### Conditionally fade based on state
 *
 * ```jsx
 * <Fade isVisible={isVisibleState}>
 *   <Card />
 * </Fade>
 * ```
 */
const Fade = ({
  children,
  isVisible,
  type = 'inout',
  motionTriggers = ['mount'],
  shouldUnmountWhenHidden,
  delay,
}: FadeProps): React.ReactElement => {
  const { theme } = useTheme();
  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const fadeVariants: MotionVariantsType = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        // We have to make sure we don't add delay prop because if we define it, it takes precedence in stagger.
        // Even setting `undefined` would break the stagger
        ...(enterDelay ? { delay: msToSeconds(theme.motion.delay[enterDelay]) } : {}),
        duration: msToSeconds(theme.motion.duration.xquick),
        ease: ENTRANCE_EASING,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ...(exitDelay ? { delay: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
        duration: msToSeconds(theme.motion.duration.xquick),
        ease: EXIT_EASING,
      },
    },
  };

  return (
    <BaseMotionEntryExit
      motionVariants={fadeVariants}
      type={type}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
      shouldUnmountWhenHidden={shouldUnmountWhenHidden}
      children={children}
    />
  );
};

export { Fade };
