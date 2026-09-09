import { defineComponentSlots } from '../shared/slotMeta';

/** Accordion styleOverride slots. */
export type AccordionSlot = 'root' | 'item' | 'headerButton' | 'body' | 'title' | 'subtitle';

export const accordionSlotMeta = defineComponentSlots<AccordionSlot>('AccordionSlot', {
  root: true,
  item: true,
  headerButton: true,
  body: true,
  title: true,
  subtitle: true,
});
