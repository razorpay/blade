import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';
import { castWebType, useTheme } from '~utils';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';

export type FadeProps = BaseMotionEntryExitProps;

export const Fade = ({
  children,
  isVisible,
  type = 'inout',
  motionTriggers = ['mount'],
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
        easings: cssBezierToMotionFn(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: makeSecondsDuration(theme.motion.duration.xquick),
        easings: cssBezierToMotionFn(castWebType(theme.motion.easing.exit)),
      },
    },
  };

  return (
    <BaseMotionEntryExit
      motionVariants={fadeVariants}
      type={type}
      children={children}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
    />
  );
};
