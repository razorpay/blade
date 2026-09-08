import { defineComponentSlots } from '../shared/slotMeta';

export type DividerSlot = 'root';

export const dividerSlotMeta = defineComponentSlots<DividerSlot>('DividerSlot', {
  root: true,
});
