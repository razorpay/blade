import React from 'react';
import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseMotionBoxProps, MotionVariantsType } from '~components/BaseMotion';
import { makeSecondsDuration } from '~utils/makeSecondsDuration';
import { cssBezierToMotionFn } from '~utils/cssBezierToMotionFn';
import { castWebType, useTheme } from '~utils';

export type ScaleProps = {
  isHighlighted?: boolean;
  variant?: 'scale-up' | 'scale-down';
  type?: BaseMotionBoxProps['type'];
  motionTriggers?: BaseMotionBoxProps['motionTriggers'];
  children: BaseMotionBoxProps['children'];
};

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
        easings: cssBezierToMotionFn(castWebType(theme.motion.easing.standard)),
      },
    },
    exit: {},
  };

  return (
    <BaseMotionBox
      motionVariants={fadeVariants}
      type={type}
      children={children}
      motionTriggers={motionTriggers ?? defaultMotionTriggers}
    />
  );
};
