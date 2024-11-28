import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { castWebType, useTheme } from '~utils';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import type { FadeProps } from './types';

export const Fade = ({
  children,
  isVisible,
  type = 'inout',
  motionTriggers = ['mount'],
  shouldUnmountWhenHidden,
}: FadeProps) => {
  const { theme } = useTheme();

  const fadeVariants: MotionVariantsType = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: makeSecondsDuration(theme.motion.duration.xquick),
        ease: cssBezierToMotionFn(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: makeSecondsDuration(theme.motion.duration.xquick),
        ease: cssBezierToMotionFn(castWebType(theme.motion.easing.exit)),
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
