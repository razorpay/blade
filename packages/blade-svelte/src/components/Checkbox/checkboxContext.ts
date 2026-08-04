import { getContext, setContext } from 'svelte';
import type { CheckboxGroupContextType } from './types';

const CHECKBOX_GROUP_CONTEXT_KEY = Symbol('checkbox-group-context');

export function setCheckboxGroupContext(getter: () => CheckboxGroupContextType): void {
  setContext(CHECKBOX_GROUP_CONTEXT_KEY, getter);
}

export function getCheckboxGroupContext(): CheckboxGroupContextType | undefined {
  const getter = getContext<(() => CheckboxGroupContextType) | undefined>(
    CHECKBOX_GROUP_CONTEXT_KEY,
  );
  return getter?.();
}
