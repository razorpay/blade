import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';

export type AnimateInteractionsProps = BaseMotionEntryExitProps & {
  children: React.ReactElement[] | React.ReactElement;
};

export const AnimateInteractions = ({ children }: AnimateInteractionsProps) => {
  return (
    <BaseMotionBox motionTriggers={['hover']}>
      <AnimateInteractionsContext.Provider value={{ isInsideAnimateInteractionsContainer: true }}>
        {children}
      </AnimateInteractionsContext.Provider>
    </BaseMotionBox>
  );
};
