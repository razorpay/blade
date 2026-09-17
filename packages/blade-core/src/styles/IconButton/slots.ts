import { defineComponentSlots } from '../shared/slotMeta';

export type IconButtonSlot = 'root' | 'icon';

export const iconButtonSlotMeta = defineComponentSlots<IconButtonSlot>('IconButtonSlot', {
  root: true,
  icon: true,
});
