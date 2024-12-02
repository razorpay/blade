import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
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
  delay = 'none',
}: SlideProps) => {
  const { theme } = useTheme();

  const enterDirection = typeof direction === 'object' ? direction.enter : direction;
  const exitDirection = typeof direction === 'object' ? direction.exit : direction;
  const isEnterDirectionHorizontal = ['left', 'right'].includes(enterDirection);
  const isExitDirectionHorizontal = ['left', 'right'].includes(exitDirection);

  const defaultOffset: SlideProps['fromOffset'] = isEnterDirectionHorizontal ? '100vw' : '100vh';

  const enterTransform = getFromTransform(enterDirection, fromOffset ?? defaultOffset);
  const exitTransform = getFromTransform(exitDirection, fromOffset ?? defaultOffset);

  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const moveVariants: MotionVariantsType = React.useMemo(
    () => ({
      initial: {
        // We keep element in view with opacity 0 initially so that it works with `in-view` trigger as expected
        opacity: 0,
      },
      animate: {
        transform: [enterTransform, 'translateY(0%)'],
        opacity: 1,
        transition: {
          delay: msToSeconds(theme.motion.delay[enterDelay]),
          duration: msToSeconds(
            isEnterDirectionHorizontal
              ? theme.motion.duration.xmoderate
              : theme.motion.duration['2xgentle'],
          ),
          ease: cssBezierToArray(
            isEnterDirectionHorizontal
              ? castWebType(theme.motion.easing.entrance)
              : castWebType(theme.motion.easing.emphasized),
          ),
        },
      },
      exit: {
        opacity: 0,
        transform: exitTransform,
        transition: {
          delay: msToSeconds(theme.motion.delay[exitDelay]),
          duration: msToSeconds(
            isExitDirectionHorizontal
              ? theme.motion.duration.moderate
              : theme.motion.duration.xgentle,
          ),
          ease: cssBezierToArray(
            isExitDirectionHorizontal
              ? castWebType(theme.motion.easing.exit)
              : castWebType(theme.motion.easing.emphasized),
          ),
        },
      },
    }),
    [
      enterDirection,
      exitDirection,
      isEnterDirectionHorizontal,
      isExitDirectionHorizontal,
      theme.name,
    ],
  );

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
