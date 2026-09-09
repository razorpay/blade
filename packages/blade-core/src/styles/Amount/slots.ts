import { defineComponentSlots } from '../shared/slotMeta';

/** `value` applies to all numeric spans (single-span, integer, decimal, minus sign). */
export type AmountSlot = 'currency' | 'value';

export const amountSlotMeta = defineComponentSlots<AmountSlot>('AmountSlot', {
  currency: true,
  value: true,
});
