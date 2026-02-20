/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { makeBoxShadow } from '~utils/makeBoxShadow';
import type { ShadowLayer } from '~utils/makeBoxShadow/makeBoxShadow';
import type { Theme } from '~components/BladeProvider';

/**
 * TimePicker popup shadow layers as per Figma design
 *
 *
 */
const getTimePickerPopupBoxShadow = (theme: Theme): string => {
  const shadowLayers: ShadowLayer[] = [
    {
      x: 0,
      y: 0,
      blur: 0,
      spread: 1,
      color: theme.colors.popup.border.gray.subtle,
      inset: true,
    },
  ];
  return makeBoxShadow(shadowLayers);
};

export { getTimePickerPopupBoxShadow };
