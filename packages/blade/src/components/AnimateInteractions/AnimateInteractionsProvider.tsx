import React from 'react';

const AnimateInteractionsContext = React.createContext({
  isInsideAnimateInteractionsContainer: false,
});

const useAnimateInteractions = () => {
  const animateInteractionsContextValue = React.useContext(AnimateInteractionsContext);
  return animateInteractionsContextValue;
};

export { useAnimateInteractions, AnimateInteractionsContext };
