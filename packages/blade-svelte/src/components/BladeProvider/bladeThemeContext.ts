import { getContext, setContext } from 'svelte';
import type { BladeThemeContextValue } from './types';

export const BLADE_THEME_CONTEXT_KEY = 'blade-theme-context';

/**
 * Provide theme context via a getter for Svelte 5 reactivity.
 */
export function setBladeThemeContext(getContextValue: () => BladeThemeContextValue): void {
  setContext(BLADE_THEME_CONTEXT_KEY, getContextValue);
}

/**
 * Read theme context getter. Returns undefined outside BladeProvider.
 */
export function getBladeThemeContextGetter(): (() => BladeThemeContextValue) | undefined {
  return getContext<(() => BladeThemeContextValue) | undefined>(BLADE_THEME_CONTEXT_KEY);
}
