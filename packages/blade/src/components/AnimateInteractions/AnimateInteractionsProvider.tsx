import React from 'react';

type AnimateInteractionsContextType = {
  isInsideAnimateInteractionsContainer: boolean;
};

const AnimateInteractionsContext = React.createContext<AnimateInteractionsContextType>({
  isInsideAnimateInteractionsContainer: false,
});

const useAnimateInteractions = (): AnimateInteractionsContextType => {
  const animateInteractionsContextValue = React.useContext(AnimateInteractionsContext);
  return animateInteractionsContextValue;
};

export { useAnimateInteractions, AnimateInteractionsContext };
