import { defineComponentSlotMeta } from '../shared/slotMeta';

export type CardSlot = 'root';

export const cardSlotMeta = defineComponentSlotMeta<CardSlot>('CardSlot', {
  root: {
    description:
      'Card wrapper. Elevated surfaces draw their stroke as an inset shadow, so repoint the border token instead of painting a border.',
    safeProperties: ['border-radius', 'padding', 'width'],
    safeTokens: ['--interactive-border-gray-disabled'],
    unsafeProperties: ['border', 'box-shadow'],
  },
});
