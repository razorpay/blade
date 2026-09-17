import { defineComponentSlots } from '../shared/slotMeta';

export type ButtonSlot = 'root' | 'icon' | 'text';

export const buttonSlotMeta = defineComponentSlots<ButtonSlot>('ButtonSlot', {
  root: true,
  icon: true,
  text: true,
});
