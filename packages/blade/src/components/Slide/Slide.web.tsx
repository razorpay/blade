import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { castWebType, useTheme } from '~utils';

export type SlideProps = BaseMotionEntryExitProps & {
  direction?: 'top' | 'right' | 'bottom' | 'left';
};

const getFromTransform = (direction: SlideProps['direction']): `translate${string}` => {
  if (direction === 'top') {
    return 'translateY(-100vh)';
  }

  if (direction === 'left') {
    return 'translateX(-100vh)';
  }

  if (direction === 'right') {
    return 'translateX(100vh)';
  }

  return 'translateY(100vh)';
};

export const Slide = ({
  children,
  type = 'inout',
  direction = 'bottom',
  isVisible,
  motionTriggers,
}: SlideProps) => {
  const { theme } = useTheme();

  const { transformFrom, isDirectionLeftOrRight } = React.useMemo(() => {
    const transformFrom = getFromTransform(direction);
    const isDirectionLeftOrRight = ['left', 'right'].includes(direction);

    return {
      transformFrom,
      isDirectionLeftOrRight,
    };
  }, [direction]);

  const moveVariants: MotionVariantsType = {
    initial: {
      transform: transformFrom,
    },
    animate: {
      transform: 'translateY(0%)',
      transition: {
        duration: makeSecondsDuration(
          isDirectionLeftOrRight
            ? theme.motion.duration.xmoderate
            : theme.motion.duration['2xgentle'],
        ),
        easings: cssBezierToMotionFn(
          isDirectionLeftOrRight
            ? castWebType(theme.motion.easing.entrance)
            : castWebType(theme.motion.easing.emphasized),
        ),
      },
    },
    exit: {
      transform: transformFrom,
      transition: {
        duration: makeSecondsDuration(
          isDirectionLeftOrRight ? theme.motion.duration.moderate : theme.motion.duration.xgentle,
        ),
        easings: cssBezierToMotionFn(
          isDirectionLeftOrRight
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
    />
  );
};
