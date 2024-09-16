import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';
import { AnimatePresence } from 'framer-motion';
import { StaggerContext } from './StaggerProvider';

export type StaggerProps = BaseMotionEntryExitProps & {
  children: React.ReactElement[] | React.ReactElement;
};

export const Stagger = ({ children, isVisible, variant = 'inout' }: StaggerProps) => {
  const staggerVariants: MotionVariantsType = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <BaseMotionBox variant={variant} motionVariants={staggerVariants}>
          <StaggerContext.Provider value={{ isInsideStaggerContainer: true }}>
            {children}
          </StaggerContext.Provider>
        </BaseMotionBox>
      ) : null}
    </AnimatePresence>
  );
};
