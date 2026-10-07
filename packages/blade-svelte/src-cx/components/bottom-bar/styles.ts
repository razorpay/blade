import type { Snippet } from 'svelte';

/** The parts of a BottomBar. */
export interface BottomBarClasses {
  /** The bar: `class` from the caller lands here (and its positioning). */
  root: string;
}

// Blade DSL's Bottom Bar (Figma, its _Bottom Dock): the intense gray surface
// with the muted top border and the upward Bottom Nav shadow, 4px in above
// and at the sides. Figma ends it in an iPhone home-indicator strip; here the
// bottom padding is the device's own safe area, never less than the 4px of
// the other sides. Positioning is the consumer's.
const ROOT =
  'flex w-full flex-col border-t-thin border-solid border-surface-gray-muted bg-surface-gray-intense shadow-bottomBar px-1 pt-1 [padding-bottom:max(0.25rem,env(safe-area-inset-bottom))]';

export function resolveBottomBar(): BottomBarClasses {
  return { root: ROOT };
}

/**
 * A bar along the bottom edge: a container for bottom navigation or actions.
 * It doesn't position itself; fix it where the app needs it through `class`.
 */
export interface BottomBarBehaviourProps {
  testID?: string;
  class?: string;
  /** The bar's content: navigation items, actions. */
  children: Snippet;
}
