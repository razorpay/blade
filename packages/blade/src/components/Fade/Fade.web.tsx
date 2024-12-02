import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';
import { castWebType, useTheme } from '~utils';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { msToSeconds } from '~utils/msToSeconds';

export type FadeProps = BaseMotionEntryExitProps;

export const Fade = ({
  children,
  isVisible,
  type = 'inout',
  motionTriggers = ['mount'],
  shouldUnmountWhenHidden,
  delay = 'none',
}: FadeProps) => {
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
        delay: msToSeconds(theme.motion.delay[enterDelay]),
        duration: msToSeconds(theme.motion.duration.xquick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transition: {
        delay: msToSeconds(theme.motion.delay[exitDelay]),
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
