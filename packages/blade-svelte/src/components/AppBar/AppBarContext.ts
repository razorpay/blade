import { setContext, getContext } from 'svelte';
import type { AppBarVariant } from './types';

const APP_BAR_CONTEXT_KEY = 'blade-app-bar-context';

type AppBarContextType = {
  variant: AppBarVariant;
};

/**
 * Sets the AppBar context with a getter function for reactivity.
 * Use this in AppBar.svelte to provide `variant` to sub-components.
 */
export function setAppBarContext(getContextValue: () => AppBarContextType): void {
  setContext(APP_BAR_CONTEXT_KEY, getContextValue);
}

/**
 * Gets the AppBar context value.
 * Returns the context value or undefined if outside an AppBar.
 */
export function getAppBarContext(): AppBarContextType | undefined {
  const getter = getContext<(() => AppBarContextType) | undefined>(APP_BAR_CONTEXT_KEY);
  return getter?.();
}

/**
 * Gets the AppBar context value, warning (on localhost) if used outside an AppBar.
 * Use this in sub-components that must be inside an AppBar.
 */
export function useAppBarContext(componentName: string): AppBarContextType {
  const context = getAppBarContext();
  if (!context) {
    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      console.error(`[Blade]: ${componentName} cannot be used outside of AppBar component`);
    }
    return { variant: 'neutral' };
  }
  return context;
}
