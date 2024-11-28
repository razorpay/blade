import React from 'react';
import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
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
    initial: {},
    animate: {
      scale:
        isHighlighted || !isControlledHighlighted
          ? variant === 'scale-up'
            ? 1.05
            : 0.98
          : undefined,
      transition: {
        duration: makeSecondsDuration(theme.motion.duration.gentle),
        ease: cssBezierToMotionFn(castWebType(theme.motion.easing.standard)),
      },
    },
    exit: {},
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
