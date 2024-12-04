import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';
import { useFocusWithin } from './useFocusWithin';
import React from 'react';
import { useAnimation } from 'framer-motion';
import type { AnimateInteractionsProps } from './types';

/**
 * ## AnimateInteractions
 *
 * AnimateInteractions is the utility preset that we offer to help you animate children when the parent is interacted.
 *
 * This is in a way equivalent to following CSS-
 * ```css
 * .parent:hover .child { }
 * ```
 *
 * ### Usage
 *
 * ```jsx
 * <AnimateInteractions
 *    motionTriggers={['hover']}
 *  > // <-- When this is hovered
 *  <Box>
 *    <Move
 *      motionTriggers={['on-animate-interactions']}
 *    > // <-- this animates in
 *      <Box />
 *    </Move>
 *  </Box>
 * </AnimateInteractions>
 * ```
 */
const AnimateInteractions = ({
  children,
  motionTriggers = ['hover'],
}: AnimateInteractionsProps) => {
  const baseMotionRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

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

export { AnimateInteractions };
