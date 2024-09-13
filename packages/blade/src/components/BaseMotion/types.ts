import { Variant } from 'framer-motion';

type MotionTriggersType = 'hover' | 'tap' | 'focus' | 'inView' | 'mount';

type BaseEntryExitMotionProps = {
  children: React.ReactElement;
  speed?: 'slow' | 'medium' | 'fast';
  isVisible?: boolean;
  variant?: 'in' | 'out' | 'inout';
  /**
   * @default ['mount']
   */
  motionTriggers?: MotionTriggersType[];
};

type MotionVariantsType = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionProps = {
  motionVariants: MotionVariantsType;
} & Pick<BaseEntryExitMotionProps, 'children' | 'isVisible' | 'variant' | 'motionTriggers'>;

export type { BaseEntryExitMotionProps, BaseMotionProps, MotionVariantsType, MotionTriggersType };
