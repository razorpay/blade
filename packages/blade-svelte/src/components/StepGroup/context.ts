import { getContext, setContext } from 'svelte';

const STEP_ROOT_CONTEXT_KEY = 'blade-step-group-root';
const STEP_LOCAL_CONTEXT_KEY = 'blade-step-group-local';

export type StepRootContextState = {
  size: 'medium' | 'large';
  orientation: 'horizontal' | 'vertical';
  /**
   * Registers a StepItem into the global (root-level) index.
   * Returns the total index of this item across all nested groups.
   */
  registerTotal: () => number;
  /**
   * Reactive getter for the total count of all items across nested groups.
   */
  getTotalCount: () => number;
};

export type StepLocalContextState = {
  /**
   * Nesting depth of this StepGroup (0 = top-level).
   */
  nestingLevel: number;
  /**
   * Registers a StepItem into the current group's local index.
   * Returns the local (within-group) index of this item.
   */
  registerLocal: () => number;
  /**
   * Reactive getter for the count of items in this local group.
   */
  getLocalCount: () => number;
};

export function setStepRootContext(getCtx: () => StepRootContextState): void {
  setContext(STEP_ROOT_CONTEXT_KEY, getCtx);
}

export function getStepRootContext(): (() => StepRootContextState) | undefined {
  return getContext<(() => StepRootContextState) | undefined>(STEP_ROOT_CONTEXT_KEY);
}

export function setStepLocalContext(getCtx: () => StepLocalContextState): void {
  setContext(STEP_LOCAL_CONTEXT_KEY, getCtx);
}

export function getStepLocalContext(): () => StepLocalContextState {
  return getContext<() => StepLocalContextState>(STEP_LOCAL_CONTEXT_KEY);
}
