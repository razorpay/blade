import { getContext, setContext } from 'svelte';
import type { ChoiceEntry } from '../base/choice-list.svelte';

/** What identifies an item: its `value`, or its position among the items. */
export type AccordionValue = string | number;

/**
 * One AccordionItem, as the accordion knows it: a choice of the headless
 * choice list, whose element is the header button.
 */
export type AccordionEntry = ChoiceEntry<AccordionValue>;

/**
 * What an Accordion offers the AccordionItems inside it. `Shared` is the
 * library's own payload from accordion to item — checkout hands its class
 * parts and size — and the rune only passes it through.
 */
export interface AccordionContext<Shared> {
  readonly isDisabled: boolean;
  readonly shared: Shared;
  /** Adds an item; returns its unregister. */
  register(entry: AccordionEntry): () => void;
  /** The item's position in document order; tracked. */
  indexOf(entry: AccordionEntry): number;
  /** The header was mounted or moved: re-read document order. */
  reorder(): void;
  isExpanded(value: AccordionValue): boolean;
  /** A user press on an expandable item: opens it, or closes it when open. */
  toggle(value: AccordionValue): void;
  /** Arrows, Home and End from this item's header to another enabled one. */
  moveFocus(entry: AccordionEntry, key: string): boolean;
}

const ACCORDION = Symbol('blade-accordion');

export function provideAccordion<Shared>(
  accordion: AccordionContext<Shared>
): void {
  setContext(ACCORDION, accordion);
}

export function getAccordion<Shared>(): AccordionContext<Shared> | undefined {
  return getContext<AccordionContext<Shared> | undefined>(ACCORDION);
}
