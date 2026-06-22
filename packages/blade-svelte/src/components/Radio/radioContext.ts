import { getContext, setContext } from 'svelte';
import type { RadioGroupContextType } from './types';

const RADIO_GROUP_CONTEXT_KEY = Symbol('radio-group-context');

export function setRadioGroupContext(getter: () => RadioGroupContextType): void {
  setContext(RADIO_GROUP_CONTEXT_KEY, getter);
}

export function getRadioGroupContext(): RadioGroupContextType | undefined {
  const getter = getContext<(() => RadioGroupContextType) | undefined>(RADIO_GROUP_CONTEXT_KEY);
  return getter?.();
}
