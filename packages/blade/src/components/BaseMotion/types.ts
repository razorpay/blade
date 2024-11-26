import type { Variant } from 'motion/react';

type MotionTriggerEntryExitType = 'mount' | 'inView' | 'focus' | 'on-animate-interactions';
type MotionTriggersType = MotionTriggerEntryExitType | 'hover' | 'tap';

type MotionVariantsType = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionBoxProps = {
  children: React.ReactElement;
  type?: 'in' | 'out' | 'inout';
  /**
   * @default ['mount']
   */
  motionTriggers?: MotionTriggersType[];
  motionVariants?: MotionVariantsType;
  shouldRenderAnimationVariables?: boolean;
} & Record<string, any>;

type BaseMotionEntryExitProps = Pick<BaseMotionBoxProps, 'children' | 'motionVariants' | 'type'> & {
  isVisible?: boolean;
  motionTriggers?: MotionTriggerEntryExitType[];
};

type MotionMeta = {
  innerRef: React.Ref<HTMLElement>;
  isEnhanced: boolean;
};

type MotionMetaProp = {
  _motionMeta?: MotionMeta;
};

export type {
  BaseMotionEntryExitProps,
  MotionVariantsType,
  MotionTriggersType,
  BaseMotionBoxProps,
  MotionMeta,
  MotionMetaProp,
};
