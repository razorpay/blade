import { defineComponentSlotMeta } from '../shared/slotMeta';

export type HeadingSlot = 'root';

export const headingSlotMeta = defineComponentSlotMeta<HeadingSlot>('HeadingSlot', {
  root: {
    description: 'The rendered heading element; token color classes yield to this override.',
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
