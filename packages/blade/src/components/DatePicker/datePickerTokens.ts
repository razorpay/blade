/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { makeBoxShadow } from '~utils/makeBoxShadow';
import type { ShadowLayer } from '~utils/makeBoxShadow/makeBoxShadow';
import type { Theme } from '~components/BladeProvider';

/**
 * DatePicker popup shadow layers as per Figma design
 *
 * Consists of 2 layers:
 * 1. Thick white inset ring: 0px 0px 0px 2px (for border effect)
 * 2. Offset white inset highlight: 0px 1.5px 0px 1px (for depth)
 */
const getDatePickerPopupBoxShadow = (theme: Theme): string => {
  const shadowLayers: ShadowLayer[] = [
    // Layer 1: Thick white inset ring
    {
      x: 0,
      y: 0,
      blur: 0,
      spread: 2,
      color: theme.colors.surface.background.gray.intense,
      inset: true,
    },
    // Layer 2: Offset white inset highlight
    {
      x: 0,
      y: 1.5,
      blur: 0,
      spread: 1,
      color: theme.colors.surface.background.gray.intense,
      inset: true,
    },
  ];
  return makeBoxShadow(shadowLayers);
};

export { getDatePickerPopupBoxShadow };
