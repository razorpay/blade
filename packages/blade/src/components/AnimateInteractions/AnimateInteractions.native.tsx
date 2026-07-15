import React from 'react';
import { Pressable } from 'react-native';
import { AnimateInteractionsContext } from './AnimateInteractionsProvider';
import type { AnimateInteractionsProps } from './types';

/**
 * ## AnimateInteractions (native)
 *
 * AnimateInteractions is the utility preset that animates children when the parent is interacted
 * with — the CSS `.parent:hover .child {}` analogue.
 *
 * On web this is driven by hover / focus-within (framer control propagation). Touch devices have
 * neither hover nor DOM focus-within, so the closest analogue is **press-and-hold**: children
 * animate while the parent is pressed (`onPressIn` → `'animate'`, `onPressOut` → `'exit'`), exactly
 * mirroring web `onFocusWithin`/`onBlurWithin`.
 *
 * The parent does not self-animate. It publishes the interaction state through
 * `AnimateInteractionsContext`; the shared `BaseMotion.native` engine reads `isInteracting` to
 * drive every `on-animate-interactions` descendant. `motionTriggers` (hover / focus) is accepted
 * for API parity but has no native meaning and is intentionally ignored.
 *
 * ### Usage
 *
 * ```jsx
 * <AnimateInteractions> // <-- press-and-hold this
 *  <Box>
 *    <Move motionTriggers={['on-animate-interactions']}> // <-- this animates in
 *      <Box />
 *    </Move>
 *  </Box>
 * </AnimateInteractions>
 * ```
 */
const AnimateInteractions = ({
  children,
  // Accepted for cross-platform API parity; hover / focus don't exist on touch devices so this is
  // intentionally ignored on native.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  motionTriggers = ['hover'],
}: AnimateInteractionsProps): React.ReactElement => {
  const [isInteracting, setIsInteracting] = React.useState(false);

  return (
    <AnimateInteractionsContext.Provider
      value={{ isInsideAnimateInteractionsContainer: true, isInteracting }}
    >
      <Pressable
        onPressIn={() => setIsInteracting(true)}
        onPressOut={() => setIsInteracting(false)}
      >
        {children}
      </Pressable>
    </AnimateInteractionsContext.Provider>
  );
};

export { AnimateInteractions };
