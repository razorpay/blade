import { Variant } from 'framer-motion';

type MotionTriggersType = 'hover' | 'tap' | 'focus' | 'inView' | 'mount';

type MotionVariantsType = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionBoxProps = {
  children: React.ReactElement;
  speed?: 'slow' | 'medium' | 'fast';
  variant?: 'in' | 'out' | 'inout';
  /**
   * @default ['mount']
   */
  motionTriggers?: MotionTriggersType[];
  motionVariants?: MotionVariantsType;
} & Record<string, any>;

type BaseMotionEntryExitProps = Pick<
  BaseMotionBoxProps,
  'children' | 'motionTriggers' | 'motionVariants' | 'variant' | 'speed'
> & { isVisible?: boolean };

export type {
  BaseMotionEntryExitProps,
  MotionVariantsType,
  MotionTriggersType,
  BaseMotionBoxProps,
};
