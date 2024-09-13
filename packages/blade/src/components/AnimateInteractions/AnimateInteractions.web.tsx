import { MotionDiv } from '~components/BaseMotion';
import type { BaseEntryExitMotionProps } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';

export type AnimateInteractionsProps = BaseEntryExitMotionProps & {
  children: React.ReactElement[] | React.ReactElement;
};

export const AnimateInteractions = ({ children }: AnimateInteractionsProps) => {
  return (
    <AnimateInteractionsContext.Provider value={{ isInsideAnimateInteractionsContainer: true }}>
      <MotionDiv initial="initial" whileHover="animate" exit="exit">
        {children}
      </MotionDiv>
    </AnimateInteractionsContext.Provider>
  );
};
