import { MotionDiv } from '~components/BaseMotion';
import type { BaseEntryExitMotionProps, MotionVariantsType } from '~components/BaseMotion';
import { AnimatePresence } from 'framer-motion';
import { StaggerContext } from './StaggerProvider';

export type StaggerProps = BaseEntryExitMotionProps & {
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
          <MotionDiv initial="initial" animate="animate" exit="exit" variants={staggerVariants}>
            {children}
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </StaggerContext.Provider>
  );
};
