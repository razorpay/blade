import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { AnimatePresence } from 'motion/react';
import { StaggerContext } from './StaggerProvider';
import { StaggerProps } from './types';
import React from 'react';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~utils';

export const Stagger = ({
  children,
  isVisible = true,
  type = 'inout',
  shouldUnmountWhenHidden = false,
  delay = 'none',
}: StaggerProps) => {
  const { theme } = useTheme();

  // Only need AnimatePresence when we have to unmount the component
  const AnimateWrapper = shouldUnmountWhenHidden ? AnimatePresence : React.Fragment;
  // keep it always mounted when shouldUnmountWhenHidden is false
  const isMounted = shouldUnmountWhenHidden ? isVisible : true;

  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const staggerVariants: MotionVariantsType = {
    initial: {},
    animate: {
      transition: {
        delay: msToSeconds(theme.motion.delay[enterDelay]),
        staggerChildren: msToSeconds(theme.motion.duration['2xquick']),
      },
    },
    exit: {
      transition: {
        delay: msToSeconds(theme.motion.delay[exitDelay]),
        staggerChildren: msToSeconds(theme.motion.duration['2xquick']),
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
