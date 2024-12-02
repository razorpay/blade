import React from 'react';
import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType, useTheme } from '~utils';
import type { ScaleProps } from './types';

export const Scale = ({
  children,
  isHighlighted,
  type = 'inout',
  variant = 'scale-up',
  motionTriggers,
}: ScaleProps) => {
  const isControlledHighlighted = typeof isHighlighted === 'boolean';
  const defaultMotionTriggers = isControlledHighlighted ? ['mount' as const] : ['hover' as const];
  const { theme } = useTheme();

  const fadeVariants: MotionVariantsType = {
    initial: {
      scale: 1,
    },
    animate: {
      scale:
        isHighlighted || !isControlledHighlighted
          ? variant === 'scale-up'
            ? 1.05
            : 0.98
          : undefined,
      transition: {
        duration: msToSeconds(theme.motion.duration.moderate),
        ease: cssBezierToArray(castWebType(theme.motion.easing.standard)),
      },
    },
    exit: {
      scale: 1,
    },
  };

  return (
    <BaseMotionEnhancerBox
      motionVariants={fadeVariants}
      type={type}
      children={children}
      motionTriggers={motionTriggers ?? defaultMotionTriggers}
    />
  );
};
