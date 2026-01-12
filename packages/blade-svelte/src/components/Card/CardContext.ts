import { getContext, setContext } from 'svelte';

type CardContextType = {
  size: 'large' | 'medium';
};

const CARD_CONTEXT_KEY = Symbol('card-context');

export function setCardContext(context: CardContextType): void {
  setContext(CARD_CONTEXT_KEY, context);
}

export function getCardContext(): CardContextType | undefined {
  return getContext(CARD_CONTEXT_KEY);
}

export function useVerifyInsideCard(componentName: string): void {
  const context = getCardContext();
  if (!context) {
    if (import.meta.env.DEV) {
      console.error(
        `[Blade: ${componentName}]: ${componentName} must be used inside Card component.`,
      );
    }
  }
}
