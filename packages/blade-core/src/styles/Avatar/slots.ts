import { defineComponentSlots } from '../shared/slotMeta';

export type AvatarSlot = 'root';

export const avatarSlotMeta = defineComponentSlots<AvatarSlot>('AvatarSlot', {
  root: true,
});
