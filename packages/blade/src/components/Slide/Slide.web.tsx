import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { castWebType, useTheme } from '~utils';
import type { SlideProps } from './types';

const getFromTransform = (
  direction: SlideProps['direction'],
  fromOffset: SlideProps['fromOffset'],
): `translate${string}` => {
  if (direction === 'top') {
    return `translateY(-${fromOffset})`;
  }

  if (direction === 'left') {
    return `translateX(-${fromOffset})`;
  }

  if (direction === 'right') {
    return `translateX(${fromOffset})`;
  }

  return `translateY(${fromOffset})`;
};

export const Slide = ({
  children,
  type = 'inout',
  direction = 'bottom',
  isVisible,
  motionTriggers,
  shouldUnmountWhenHidden,
  fromOffset,
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

    const isEnterDirectionHorizontal = ['left', 'right'].includes(enterDirection);
    const isExitDirectionHorizontal = ['left', 'right'].includes(exitDirection);

    const defaultOffset: SlideProps['fromOffset'] = isEnterDirectionHorizontal ? '100vw' : '100vh';

    const enterTransform = getFromTransform(enterDirection, fromOffset ?? defaultOffset);
    const exitTransform = getFromTransform(exitDirection, fromOffset ?? defaultOffset);

    return {
      enterTransform,
      exitTransform,
      isEnterDirectionHorizontal,
      isExitDirectionHorizontal,
    };
  }, [direction, fromOffset]);

  const moveVariants: MotionVariantsType = {
    initial: {
      transform: enterTransform,
    },
    animate: {
      transform: [enterTransform, 'translateY(0%)'],
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
