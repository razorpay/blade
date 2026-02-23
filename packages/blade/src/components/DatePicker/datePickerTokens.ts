/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { makePopupBoxShadow } from '~utils';
import type { ShadowLayer } from '~utils/makePopupBoxShadow';
import type { Theme } from '~components/BladeProvider';

/**
 * DatePicker popup shadow layers as per Figma design
 *
 */
const getDatePickerPopupBoxShadow = (theme: Theme): string => {
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
  return makePopupBoxShadow(shadowLayers);
};

export { getDatePickerPopupBoxShadow };
