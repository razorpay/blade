import { getContext, setContext } from 'svelte';

const COLLAPSIBLE_CONTEXT_KEY = 'blade-collapsible-context';

export type CollapsibleDirection = 'bottom' | 'top';

export type CollapsibleContextState = {
  isExpanded: boolean;
  defaultIsExpanded: boolean;
  onExpandChange: (isExpanded: boolean) => void;
  direction: CollapsibleDirection;
  collapsibleBodyId: string;
};

export function setCollapsibleContext(getCtx: () => CollapsibleContextState): void {
  setContext(COLLAPSIBLE_CONTEXT_KEY, getCtx);
}

export function getCollapsibleContext(): (() => CollapsibleContextState) | undefined {
  return getContext<(() => CollapsibleContextState) | undefined>(COLLAPSIBLE_CONTEXT_KEY);
}
