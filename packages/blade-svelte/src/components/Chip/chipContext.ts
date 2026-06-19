import { getContext, setContext } from 'svelte';
import type { ChipGroupContextType } from './types';

const CHIP_GROUP_CONTEXT_KEY = Symbol('chip-group-context');

export function setChipGroupContext(getter: () => ChipGroupContextType): void {
  setContext(CHIP_GROUP_CONTEXT_KEY, getter);
}

export function getChipGroupContext(): ChipGroupContextType | undefined {
  const getter = getContext<(() => ChipGroupContextType) | undefined>(CHIP_GROUP_CONTEXT_KEY);
  return getter?.();
}
