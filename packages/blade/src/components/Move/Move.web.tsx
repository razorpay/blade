import React from 'react';
import type { MoveProps } from './types';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType, makeSpace, useTheme } from '~utils';

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
        ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transform: `translateY(${movePx})`,
      transition: {
        ...(exitDelay ? { delay: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
        duration: msToSeconds(theme.motion.duration.quick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.exit)),
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
