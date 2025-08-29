import { default as React } from 'react';
type AnimateInteractionsContextType = {
    isInsideAnimateInteractionsContainer: boolean;
};
declare const AnimateInteractionsContext: React.Context<AnimateInteractionsContextType>;
declare const useAnimateInteractions: () => AnimateInteractionsContextType;
export { useAnimateInteractions, AnimateInteractionsContext };
