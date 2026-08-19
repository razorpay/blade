import { defineComponentSlotMeta } from '../shared/slotMeta';
import { SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES } from './brandCssVars';

export type ButtonSlot = 'root' | 'icon' | 'text';

export const buttonSlotMeta = defineComponentSlotMeta<ButtonSlot>('ButtonSlot', {
  root: {
    description: 'The button element itself — fill, stroke and every interactive state.',
    safeProperties: ['border-radius', 'padding', 'width', 'background-image', 'letter-spacing'],
    safeTokens: SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES,
    unsafeProperties: ['background-color', 'box-shadow', 'border-color'],
  },
  icon: {
    description: 'Wrapper around the leading/trailing icon; the svg paints with `currentColor`.',
    safeProperties: ['color', 'width', 'height'],
  },
  text: {
    description: 'Label text inside the button; inherits `currentColor` once overridden.',
    safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing', 'text-transform'],
  },
});
