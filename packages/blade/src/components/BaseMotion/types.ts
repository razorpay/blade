import type { Variant } from 'motion/react';

type MotionTriggerEntryExitType = 'mount' | 'inView' | 'focus';
type MotionTriggersType = MotionTriggerEntryExitType | 'hover' | 'tap';

type MotionVariantsType = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionBoxProps = {
  children: React.ReactElement;
  speed?: 'slow' | 'medium' | 'fast';
  type?: 'in' | 'out' | 'inout';
  /**
   * @default ['mount']
   */
  motionTriggers?: MotionTriggersType[];
  motionVariants?: MotionVariantsType;
  shouldRenderAnimationVariables?: boolean;
} & Record<string, any>;

type BaseMotionEntryExitProps = Pick<
  BaseMotionBoxProps,
  'children' | 'motionVariants' | 'type' | 'speed'
> & {
  isVisible?: boolean;
  motionTriggers?: (MotionTriggerEntryExitType | 'on-animate-interactions')[];
};

export type {
  BaseMotionEntryExitProps,
  MotionVariantsType,
  MotionTriggersType,
  BaseMotionBoxProps,
};
