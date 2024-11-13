import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';
import { AnimatePresence } from 'motion/react';
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
    <StaggerContext.Provider value={{ isInsideStaggerContainer: true }}>
      <AnimatePresence>
        {isVisible ? (
          <BaseMotionBox
            shouldRenderAnimationVariables
            variant={variant}
            motionVariants={staggerVariants}
          >
            {children}
          </BaseMotionBox>
        ) : null}
      </AnimatePresence>
    </StaggerContext.Provider>
  );
};
