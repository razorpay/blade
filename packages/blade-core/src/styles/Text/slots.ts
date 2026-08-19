import { defineComponentSlotMeta } from '../shared/slotMeta';

export type TextSlot = 'root';

export const textSlotMeta = defineComponentSlotMeta<TextSlot>('TextSlot', {
  root: {
    description: 'The rendered text element; token color classes yield to this override.',
    safeProperties: [
      'color',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'text-transform',
    ],
  },
});
