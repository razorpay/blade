import { defineComponentSlotMeta } from '../shared/slotMeta';

/** Accordion styleOverride slots. */
export type AccordionSlot = 'root' | 'item' | 'headerButton' | 'body' | 'title' | 'subtitle';

export const accordionSlotMeta = defineComponentSlotMeta<AccordionSlot>('AccordionSlot', {
  root: {
    description: 'Wrapper around every accordion item.',
    safeProperties: ['background-color', 'border-radius', 'padding'],
  },
  item: {
    description: 'A single accordion item, collapsed or expanded.',
    safeProperties: ['background-color', 'border-radius', 'padding'],
  },
  headerButton: {
    description: 'Clickable header row that toggles the item.',
    safeProperties: ['background-color', 'border-radius', 'padding'],
    unsafeProperties: ['box-shadow'],
  },
  body: {
    description: 'Expanded content region under the header.',
    safeProperties: ['color', 'background-color', 'padding'],
  },
  title: {
    description: 'Header title text.',
    safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing'],
  },
  subtitle: {
    description: 'Header subtitle text.',
    safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing'],
  },
});
