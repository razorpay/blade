import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';

export type FadeProps = BaseMotionEntryExitProps;

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
    <BaseMotionEntryExit
      motionVariants={fadeVariants}
      variant={variant}
      children={children}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
    />
  );
};
