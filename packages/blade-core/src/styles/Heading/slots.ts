import { defineComponentSlots } from '../shared/slotMeta';

export type HeadingSlot = 'root';

export const headingSlotMeta = defineComponentSlots<HeadingSlot>('HeadingSlot', {
  root: true,
});
