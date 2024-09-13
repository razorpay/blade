import { Variant } from 'framer-motion';

type BaseEntryExitMotionProps = {
  children: React.ReactElement;
  speed?: 'slow' | 'medium' | 'fast';
  isVisible?: boolean;
  variant?: 'in' | 'out' | 'inout';
};

type MotionVariantsType = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionProps = {
  motionVariants: MotionVariantsType;
} & Pick<BaseEntryExitMotionProps, 'children' | 'isVisible' | 'variant'>;

export type { BaseEntryExitMotionProps, BaseMotionProps, MotionVariantsType };
