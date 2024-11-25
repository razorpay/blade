import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { AnimatePresence } from 'motion/react';
import { StaggerContext } from './StaggerProvider';
import { StaggerProps } from './types';

export const Stagger = ({ children, isVisible, type = 'inout' }: StaggerProps) => {
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
        <BaseMotionBox shouldRenderAnimationVariables type={type} motionVariants={staggerVariants}>
          <StaggerContext.Provider value={{ isInsideStaggerContainer: true }}>
            {children}
          </StaggerContext.Provider>
        </BaseMotionBox>
      ) : null}
    </AnimatePresence>
  );
};
