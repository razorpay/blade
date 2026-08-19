import { defineComponentSlotMeta } from '../shared/slotMeta';

export type AvatarSlot = 'root';

export const avatarSlotMeta = defineComponentSlotMeta<AvatarSlot>('AvatarSlot', {
  root: {
    description: 'Avatar wrapper — squircle radius, ring and background live here.',
    safeProperties: ['border-radius', 'background-color', 'box-shadow', 'width', 'height'],
  },
});
