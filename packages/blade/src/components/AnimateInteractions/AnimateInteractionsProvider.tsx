import React from 'react';

type AnimateInteractionsContextType = {
  isInsideAnimateInteractionsContainer: boolean;
  /**
   * Native-only: current interaction state of the parent `AnimateInteractions` container.
   *
   * On native there is no hover / DOM focus-within, so `AnimateInteractions.native` publishes a
   * press-and-hold flag here and the shared `BaseMotion.native` engine reads it to drive every
   * `on-animate-interactions` descendant towards `'animate'` (interacting) or `'exit'` (idle).
   *
   * Web ignores this field — framer control propagation handles descendant animation there.
   */
  isInteracting?: boolean;
};

const AnimateInteractionsContext = React.createContext<AnimateInteractionsContextType>({
  isInsideAnimateInteractionsContainer: false,
  isInteracting: false,
});

const useAnimateInteractions = (): AnimateInteractionsContextType => {
  const animateInteractionsContextValue = React.useContext(AnimateInteractionsContext);
  return animateInteractionsContextValue;
};

export { useAnimateInteractions, AnimateInteractionsContext };
