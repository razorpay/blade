import { getContext, setContext } from 'svelte';
import type { SlotThemeMap } from '@razorpay/blade-core/styles';

/**
 * Context plumbing for the two *map-based* instance-styling options:
 *
 *  - **Option C** (scoped theme provider): the provider re-declares token CSS
 *    variables on its wrapper element, so components inherit purely via the CSS
 *    cascade — no JS lookup needed. The provider still publishes the override tree
 *    here for completeness / introspection.
 *  - **Option D** (slot-keyed theme map): components call `getSlotThemeMap()` and
 *    resolve their `themeKey` against the map (via `resolveSlotTheme`).
 *
 * Both are evaluation surfaces; the recommended path is Option B's per-instance
 * `styleOverrides` (no context required). See instance-level-styling-proposal.
 */

const SLOT_THEME_CONTEXT_KEY = 'blade-slot-theme-context';

/** Provide the Option D slot-keyed theme map to descendants. */
export function setSlotThemeContext(getMap: () => SlotThemeMap | undefined): void {
  setContext(SLOT_THEME_CONTEXT_KEY, getMap);
}

/** Read the nearest Option D slot-keyed theme map (undefined if no provider). */
export function getSlotThemeMap(): SlotThemeMap | undefined {
  const getter = getContext<(() => SlotThemeMap | undefined) | undefined>(
    SLOT_THEME_CONTEXT_KEY,
  );
  return getter?.();
}
