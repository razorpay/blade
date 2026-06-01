import { getContext, setContext } from 'svelte';

const COLLAPSIBLE_CONTEXT_KEY = 'blade-collapsible-context';

export type CollapsibleContextState = {
  isExpanded: boolean;
  toggle: () => void;
  collapsibleBodyId: string;
  isDisabled: boolean;
  size: 'large' | 'medium';
};

export function setCollapsibleContext(getCtx: () => CollapsibleContextState): void {
  setContext(COLLAPSIBLE_CONTEXT_KEY, getCtx);
}

export function getCollapsibleContext(): (() => CollapsibleContextState) | undefined {
  return getContext<(() => CollapsibleContextState) | undefined>(COLLAPSIBLE_CONTEXT_KEY);
}
