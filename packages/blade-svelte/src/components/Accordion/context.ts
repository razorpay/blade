import { getContext, setContext } from 'svelte';
import type { AccordionVariantType } from './types';

const ACCORDION_CONTEXT_KEY = 'blade-accordion-context';
const ACCORDION_ITEM_CONTEXT_KEY = 'blade-accordion-item-context';

export type AccordionContextState = {
  expandedIndex: number | undefined;
  onExpandChange: (index: number) => void;
  showNumberPrefix: boolean;
  variant: AccordionVariantType;
  numberOfItems: number;
  size: 'large' | 'medium';
  registerItem: () => number;
};

export type AccordionItemContextState = {
  index: number | undefined;
  isDisabled: boolean;
  isExpanded: boolean;
  toggle: () => void;
  collapsibleBodyId: string;
};

export function setAccordionContext(getCtx: () => AccordionContextState): void {
  setContext(ACCORDION_CONTEXT_KEY, getCtx);
}

export function getAccordionContext(): () => AccordionContextState {
  return getContext<() => AccordionContextState>(ACCORDION_CONTEXT_KEY);
}

export function setAccordionItemContext(getCtx: () => AccordionItemContextState): void {
  setContext(ACCORDION_ITEM_CONTEXT_KEY, getCtx);
}

export function getAccordionItemContext(): () => AccordionItemContextState {
  return getContext<() => AccordionItemContextState>(ACCORDION_ITEM_CONTEXT_KEY);
}
