import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';

export type AnimateInteractionsProps = BaseMotionEntryExitProps & {
  children: React.ReactElement[] | React.ReactElement;
};

export const AnimateInteractions = ({ children }: AnimateInteractionsProps) => {
  return (
    <AnimateInteractionsContext.Provider value={{ isInsideAnimateInteractionsContainer: true }}>
      <BaseMotionBox motionTriggers={['hover']} shouldRenderAnimationVariables>
        {children}
      </BaseMotionBox>
    </AnimateInteractionsContext.Provider>
  );
};
