import { defineComponentSlots } from '../shared/slotMeta';

export type CardSlot = 'root' | 'surface';

export const cardSlotMeta = defineComponentSlots<CardSlot>('CardSlot', {
  root: true,
  surface: true,
});
