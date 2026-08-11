import { defineComponentSlotMeta } from '../shared/slotMeta';

export type AppBarLeadingSlot = 'title';

export const appBarLeadingSlotMeta = defineComponentSlotMeta<AppBarLeadingSlot>(
  'AppBarLeadingSlot',
  {
    title: {
      description: 'Merchant / page title text in the app bar leading block.',
      safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing', 'text-transform'],
    },
  },
);
