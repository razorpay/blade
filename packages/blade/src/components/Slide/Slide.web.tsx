import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { castWebType, useTheme } from '~utils';
import type { SlideProps } from './types';

const getFromTransform = (direction: SlideProps['direction']): `translate${string}` => {
  if (direction === 'top') {
    return 'translateY(-100vh)';
  }

  if (direction === 'left') {
    return 'translateX(-100vw)';
  }

  if (direction === 'right') {
    return 'translateX(100vw)';
  }

  return 'translateY(100vh)';
};

export const Slide = ({
  children,
  type = 'inout',
  direction = 'bottom',
  isVisible,
  motionTriggers,
  shouldUnmountWhenHidden,
}: SlideProps) => {
  const { theme } = useTheme();

  const {
    enterTransform,
    exitTransform,
    isEnterDirectionHorizontal,
    isExitDirectionHorizontal,
  } = React.useMemo(() => {
    const enterDirection = typeof direction === 'object' ? direction.enter : direction;
    const exitDirection = typeof direction === 'object' ? direction.exit : direction;

    const enterTransform = getFromTransform(enterDirection);
    const exitTransform = getFromTransform(exitDirection);

    const isEnterDirectionHorizontal = ['left', 'right'].includes(enterDirection);
    const isExitDirectionHorizontal = ['left', 'right'].includes(exitDirection);

    return {
      enterTransform,
      exitTransform,
      isEnterDirectionHorizontal,
      isExitDirectionHorizontal,
    };
  }, [direction]);

  const moveVariants: MotionVariantsType = {
    initial: {
      // We keep element in view with opacity 0 initially so that it works with `inView` trigger as expected
      opacity: 0,
    },
    animate: {
      transform: [enterTransform, 'translateY(0%)'],
      opacity: [1, 1],
      transition: {
        duration: makeSecondsDuration(
          isEnterDirectionHorizontal
            ? theme.motion.duration.xmoderate
            : theme.motion.duration['2xgentle'],
        ),
        easings: cssBezierToMotionFn(
          isEnterDirectionHorizontal
            ? castWebType(theme.motion.easing.entrance)
            : castWebType(theme.motion.easing.emphasized),
        ),
      },
    },
    exit: {
      transform: exitTransform,
      transition: {
        duration: makeSecondsDuration(
          isExitDirectionHorizontal
            ? theme.motion.duration.moderate
            : theme.motion.duration.xgentle,
        ),
        easings: cssBezierToMotionFn(
          isExitDirectionHorizontal
            ? castWebType(theme.motion.easing.exit)
            : castWebType(theme.motion.easing.emphasized),
        ),
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
