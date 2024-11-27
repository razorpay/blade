import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';
import React from 'react';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { castWebType, makeSpace, useTheme } from '~utils';

export type MoveProps = BaseMotionEntryExitProps;

export const Move = ({
  children,
  type = 'inout',
  isVisible,
  motionTriggers,
  shouldUnmountWhenHidden,
}: MoveProps) => {
  const { theme } = useTheme();

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
        duration: makeSecondsDuration(theme.motion.duration.xmoderate),
        easings: cssBezierToMotionFn(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transform: `translateY(${movePx})`,
      transition: {
        duration: makeSecondsDuration(theme.motion.duration.quick),
        easings: cssBezierToMotionFn(castWebType(theme.motion.easing.exit)),
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
