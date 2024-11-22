import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';
import { useFocusWithin } from './useFocusWithin';
import React from 'react';
import { useAnimationControls } from 'motion/react';

export type AnimateInteractionsProps = BaseMotionEntryExitProps & {
  children: React.ReactElement[] | React.ReactElement;
};

export const AnimateInteractions = ({ children, motionTriggers }: AnimateInteractionsProps) => {
  const baseMotionRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();

  useFocusWithin(baseMotionRef, {
    onFocusWithin: () => {
      controls.start('animate');
    },
    onBlurWithin: () => {
      controls.start('exit');
    },
  });

  return (
    <AnimateInteractionsContext.Provider value={{ isInsideAnimateInteractionsContainer: true }}>
      <BaseMotionBox
        ref={baseMotionRef}
        motionTriggers={motionTriggers}
        shouldRenderAnimationVariables
        animate={controls}
      >
        {children}
      </BaseMotionBox>
    </AnimateInteractionsContext.Provider>
  );
};
