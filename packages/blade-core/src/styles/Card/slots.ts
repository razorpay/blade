import { defineComponentSlotMeta } from '../shared/slotMeta';

export type CardSlot = 'root' | 'surface';

export const cardSlotMeta = defineComponentSlotMeta<CardSlot>('CardSlot', {
  root: {
    description:
      'Card wrapper. Owns interactive-state rings (selected/focused/validation) and layout (width, styled props). Elevated surfaces draw their stroke as an inset shadow, so repoint the border token here instead of painting a border — the token cascades down to the surface.',
    safeProperties: ['padding', 'width'],
    safeTokens: [
      '--interactive-border-gray-disabled',
      '--surface-border-primary-normal',
      '--surface-border-primary-muted',
      '--interactive-border-negative-default',
      '--interactive-border-positive-default',
    ],
    unsafeProperties: ['border', 'box-shadow'],
  },
  surface: {
    description:
      'Painted card surface. Owns the visible corners and background. Use for arbitrary border-radius or background that must land on the painted element (these do not inherit from the wrapper). Do not paint a border/box-shadow here — the elevation stroke lives on this layer.',
    safeProperties: ['border-radius', 'background-color', 'padding'],
    unsafeProperties: ['border', 'box-shadow'],
  },
});
