import { getContext, setContext } from 'svelte';
import type { ChipGroupContextType } from './types';

const CHIP_GROUP_CONTEXT_KEY = Symbol('ChipGroupContext');

/**
 * Set the ChipGroup context with a getter function for reactivity.
 * Called from ChipGroup to provide reactive state to child Chips.
 *
 * We pass a getter function so that child components always read the
 * latest derived context value (Svelte context values are not reactive by default).
 */
export function setChipGroupContext(getContextValue: () => ChipGroupContextType): void {
  setContext(CHIP_GROUP_CONTEXT_KEY, getContextValue);
}

/**
 * Get the ChipGroup context value.
 * Called from Chip to read state provided by ChipGroup.
 * Returns an empty object if not inside a ChipGroup.
 */
export function getChipGroupContext(): () => ChipGroupContextType {
  const getter = getContext<(() => ChipGroupContextType) | undefined>(CHIP_GROUP_CONTEXT_KEY);
  if (getter) return getter;
  return () => ({} as ChipGroupContextType);
}
