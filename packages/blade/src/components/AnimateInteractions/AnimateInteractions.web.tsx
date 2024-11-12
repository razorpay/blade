import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';

export type AnimateInteractionsProps = BaseMotionEntryExitProps & {
  children: React.ReactElement[] | React.ReactElement;
};

export const AnimateInteractions = ({ children }: AnimateInteractionsProps) => {
  return (
    <AnimateInteractionsContext.Provider value={{ isInsideAnimateInteractionsContainer: true }}>
      <BaseMotionEnhancerBox motionTriggers={['hover', 'focus']} shouldRenderAnimationVariables>
        {children}
      </BaseMotionEnhancerBox>
    </AnimateInteractionsContext.Provider>
  );
};
