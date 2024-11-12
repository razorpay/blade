import React from 'react';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';

export type ScaleProps = Omit<BaseMotionEntryExitProps, 'isVisible'> & {
  isScaled?: boolean;
};

export const Scale = ({ children, isScaled, variant = 'inout', motionTriggers }: ScaleProps) => {
  const isControlledScale = typeof isScaled === 'boolean';
  const defaultMotionTriggers = isControlledScale ? ['mount' as const] : ['hover' as const];

  const fadeVariants: MotionVariantsType = {
    initial: {},
    animate: {
      scale: isScaled || !isControlledScale ? '1.1' : undefined,
    },
    exit: {},
  };

  return (
    <BaseMotionEntryExit
      motionVariants={fadeVariants}
      variant={variant}
      children={children}
      isVisible={true}
      motionTriggers={motionTriggers ?? defaultMotionTriggers}
    />
  );
};
