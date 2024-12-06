import React from 'react';
import type { FadeProps } from './types';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { castWebType, useTheme } from '~utils';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { msToSeconds } from '~utils/msToSeconds';

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
        ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ...(exitDelay ? { delay: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
        duration: msToSeconds(theme.motion.duration.xquick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.exit)),
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
