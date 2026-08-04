import { setContext, getContext } from 'svelte';
import type { AppBarVariant } from './types';

declare const __DEV__: boolean;

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
 * Gets the AppBar context getter for reactive reads in sub-components.
 * Call the returned function inside `$derived` so prop updates (e.g. variant) propagate.
 */
export function getAppBarContext(): () => AppBarContextType {
  return getContext<() => AppBarContextType>(APP_BAR_CONTEXT_KEY);
}

/**
 * Validates AppBar context presence, warning in non-production if used outside an AppBar.
 * Use this in sub-components that must be inside an AppBar but do not read context values.
 */
export function useAppBarContext(componentName: string): void {
  if (!getAppBarContext()) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(`[Blade]: ${componentName} cannot be used outside of AppBar component`);
    }
  }
}
