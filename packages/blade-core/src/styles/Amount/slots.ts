import { defineComponentSlotMeta } from '../shared/slotMeta';

/** `value` applies to all numeric spans (single-span, integer, decimal, minus sign). */
export type AmountSlot = 'currency' | 'value';

export const amountSlotMeta = defineComponentSlotMeta<AmountSlot>('AmountSlot', {
  currency: {
    description: 'Currency symbol / code span rendered beside the number.',
    safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing'],
  },
  value: {
    description: 'Every numeric span — single-span, integer, decimal and minus sign.',
    safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing'],
  },
});
