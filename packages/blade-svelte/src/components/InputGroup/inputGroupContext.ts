import { getContext, setContext } from 'svelte';
import type { InputGroupContextType } from './types';

const INPUT_GROUP_CONTEXT_KEY = Symbol('input-group-context');

/**
 * Provide the InputGroup context. Pass a getter so consumers stay reactive to
 * the group's `size`/`isDisabled` prop changes (mirrors `checkboxContext.ts`).
 */
export function setInputGroupContext(getter: () => InputGroupContextType): void {
  setContext(INPUT_GROUP_CONTEXT_KEY, getter);
}

/**
 * Read the InputGroup context. Returns `undefined` for standalone inputs (not
 * inside an `InputGroup`), so callers fall back to their own props.
 */
export function getInputGroupContext(): InputGroupContextType | undefined {
  const getter = getContext<(() => InputGroupContextType) | undefined>(INPUT_GROUP_CONTEXT_KEY);
  return getter?.();
}
