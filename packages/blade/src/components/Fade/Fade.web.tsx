import React from 'react';
import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseEntryExitMotionProps, MotionVariantsType } from '~components/BaseMotion';

export type FadeProps = BaseEntryExitMotionProps;

export const Fade = ({
  children,
  isVisible,
  variant = 'inout',
  motionTriggers = ['mount'],
}: FadeProps) => {
  const fadeVariants: MotionVariantsType = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <BaseMotionBox
      motionVariants={fadeVariants}
      variant={variant}
      children={children}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
    />
  );
};
