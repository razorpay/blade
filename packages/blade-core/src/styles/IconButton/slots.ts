import { defineComponentSlotMeta } from '../shared/slotMeta';

export type IconButtonSlot = 'root' | 'icon';

export const iconButtonSlotMeta = defineComponentSlotMeta<IconButtonSlot>('IconButtonSlot', {
  root: {
    description: 'The button element wrapping the icon — hit area and focus ring.',
    safeProperties: ['border-radius', 'padding', 'width', 'height'],
    unsafeProperties: ['background-color'],
  },
  icon: {
    description: 'Icon wrapper; size the svg here and let it paint with `currentColor`.',
    safeProperties: ['color', 'width', 'height'],
  },
});
