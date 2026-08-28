import { defineComponentSlots } from '../shared/slotMeta';

export type TextSlot = 'root';

export const textSlotMeta = defineComponentSlots<TextSlot>('TextSlot', {
  root: true,
});
