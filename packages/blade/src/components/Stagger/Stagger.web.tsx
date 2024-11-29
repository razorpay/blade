import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { AnimatePresence } from 'motion/react';
import { StaggerContext } from './StaggerProvider';
import { StaggerProps } from './types';
import React from 'react';

export const Stagger = ({
  children,
  isVisible = true,
  type = 'inout',
  shouldUnmountWhenHidden = false,
}: StaggerProps) => {
  // Only need AnimatePresence when we have to unmount the component
  const AnimateWrapper = shouldUnmountWhenHidden ? AnimatePresence : React.Fragment;
  // keep it always mounted when shouldUnmountWhenHidden is false
  const isMounted = shouldUnmountWhenHidden ? isVisible : true;

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
    <AnimateWrapper>
      {isMounted ? (
        <BaseMotionBox
          type={type}
          motionVariants={staggerVariants}
          {...(shouldUnmountWhenHidden
            ? {}
            : { animateVisibility: isVisible ? 'animate' : 'exit' })}
        >
          <StaggerContext.Provider value={{ isInsideStaggerContainer: true }}>
            {children}
          </StaggerContext.Provider>
        </BaseMotionBox>
      ) : null}
    </AnimateWrapper>
  );
};
