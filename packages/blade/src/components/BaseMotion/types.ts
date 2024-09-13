import { Variant } from 'framer-motion';

type BaseEntryExitMotionProps = {
  children: React.ReactElement;
  speed?: 'slow' | 'medium' | 'fast';
  isVisible?: boolean;
  variant?: 'in' | 'out' | 'inout';
};

type BaseMotionBoxVariants = {
  initial: Variant;
  animate: Variant;
  exit: Variant;
};

type BaseMotionProps = {
  motionVariants: BaseMotionBoxVariants;
} & Pick<BaseEntryExitMotionProps, 'children' | 'isVisible' | 'variant'>;

export type { BaseEntryExitMotionProps, BaseMotionProps, BaseMotionBoxVariants };
