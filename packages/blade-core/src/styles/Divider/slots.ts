import { defineComponentSlotMeta } from '../shared/slotMeta';

export type DividerSlot = 'root';

export const dividerSlotMeta = defineComponentSlotMeta<DividerSlot>('DividerSlot', {
  root: {
    description: 'The rule itself — a filled element, so its color is `background-color`.',
    safeProperties: ['background-color', 'height', 'width', 'margin', 'border-radius'],
  },
});
