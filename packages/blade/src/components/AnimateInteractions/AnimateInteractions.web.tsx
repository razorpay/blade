import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';
import { useFocusWithin } from './useFocusWithin';
import React from 'react';
import { useAnimationControls } from 'motion/react';
import type { AnimateInteractionsProps } from './types';

export const AnimateInteractions = ({
  children,
  motionTriggers = ['hover'],
}: AnimateInteractionsProps) => {
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
      <BaseMotionEnhancerBox ref={baseMotionRef} motionTriggers={motionTriggers} animate={controls}>
        {children}
      </BaseMotionEnhancerBox>
    </AnimateInteractionsContext.Provider>
  );
};
