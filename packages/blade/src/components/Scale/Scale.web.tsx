import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';

export type ScaleProps = BaseMotionEntryExitProps;

export const Scale = ({
  children,
  isVisible,
  variant = 'inout',
  motionTriggers = ['hover'],
}: ScaleProps) => {
  const fadeVariants: MotionVariantsType = {
    initial: {},
    animate: {
      scale: '1.1',
    },
    exit: {},
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
