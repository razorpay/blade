import { defineComponentSlots } from '../shared/slotMeta';

export type AppBarLeadingSlot = 'title';

export const appBarLeadingSlotMeta = defineComponentSlots<AppBarLeadingSlot>('AppBarLeadingSlot', {
  title: true,
});
