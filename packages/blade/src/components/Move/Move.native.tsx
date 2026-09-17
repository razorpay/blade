import React from 'react';
import type { MoveProps } from './types';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { makeSpace, useTheme } from '~utils';

// The native interpreter (`baseMotionInterpreter.native.ts` → `getTiming`) expects `ease` as a
// [x1, y1, x2, y2] cubic-bezier array. On native, `theme.motion.easing.*` is an opaque
// `EasingFactoryFn` (not a `cubic-bezier(...)` string), so `cssBezierToArray(castWebType(...))`
// would crash. We mirror the token control points directly instead.
// Keep in sync with tokens/global/motion.ts (easing.entrance / easing.exit).
const ENTRANCE_EASING = [0, 0, 0.2, 1] as const; // matches easing.entrance
const EXIT_EASING = [0.17, 0, 1, 1] as const; // matches easing.exit

/**
 * ## Move
 *
 * Move is one of the motion presets that we expose from blade to help you make components appear / disappear with move
 *
 * ### Usage
 *
 * #### Move in on mount
 *
 * ```jsx
 * <Move>
 *   <Card />
 * </Move>
 * ```
 *
 * #### Conditionally move based on state
 *
 * ```jsx
 * <Move isVisible={isVisibleState}>
 *   <Card />
 * </Move>
 * ```
 */
const Move = ({
  children,
  type = 'inout',
  isVisible,
  motionTriggers,
  shouldUnmountWhenHidden,
  delay,
}: MoveProps): React.ReactElement => {
  const { theme } = useTheme();
  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const movePx = makeSpace(theme.spacing[5]);

  const moveVariants: MotionVariantsType = {
    initial: {
      opacity: 0,
      transform: `translateY(${movePx})`,
    },
    animate: {
      opacity: 1,
      transform: `translateY(${makeSpace(theme.spacing[0])})`,
      transition: {
        // We have to make sure we don't add delay prop because if we define it, it takes precedence in stagger.
        // Even setting `undefined` would break the stagger
        ...(enterDelay ? { delay: msToSeconds(theme.motion.delay[enterDelay]) } : {}),
        duration: msToSeconds(theme.motion.duration.xmoderate),
        ease: [...ENTRANCE_EASING],
      },
    },
    exit: {
      opacity: 0,
      transform: `translateY(${movePx})`,
      transition: {
        ...(exitDelay ? { delay: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
        duration: msToSeconds(theme.motion.duration.quick),
        ease: [...EXIT_EASING],
      },
    },
  };

  return (
    <BaseMotionEntryExit
      motionVariants={moveVariants}
      children={children}
      type={type}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
      shouldUnmountWhenHidden={shouldUnmountWhenHidden}
    />
  );
};

export { Move };
