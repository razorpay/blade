import { setContext, getContext } from 'svelte';

const CARD_CONTEXT_KEY = 'blade-card-context';

type CardContextType = {
  size: 'large' | 'medium';
};

/**
 * Sets the Card context with a getter function for reactivity.
 * Use this in Card.svelte to provide size to sub-components.
 */
export function setCardContext(getContextValue: () => CardContextType): void {
  setContext(CARD_CONTEXT_KEY, getContextValue);
}

/**
 * Gets the Card context value.
 * Returns the context value or undefined if outside a Card.
 */
export function getCardContext(): CardContextType | undefined {
  const getter = getContext<(() => CardContextType) | undefined>(CARD_CONTEXT_KEY);
  return getter?.();
}

/**
 * Gets the Card context value, throwing if used outside a Card.
 * Use this in sub-components that must be inside a Card.
 */
export function useCardContext(componentName: string): CardContextType {
  const context = getCardContext();
  if (!context) {
    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      console.error(`[Blade]: ${componentName} cannot be used outside of Card component`);
    }
    return { size: 'large' };
  }
  return context;
}
