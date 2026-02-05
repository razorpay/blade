/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { makePopupBoxShadow } from '~utils';
import type { ShadowLayer } from '~utils';
import type { Theme } from '~components/BladeProvider';

/**
 * Popover shadow layers as per Figma design: _components/Popup shadow
 *
 * Consists of 2 layers:
 * 1. Drop shadow: elevation.midRaised (for elevation)
 * 2. Top highlight: inset 0px -1.5px 0px 1px (for depth)
 */
const getPopoverBoxShadow = (theme: Theme): string => {
  const shadowLayers: ShadowLayer[] = [
    // Layer 1: Top highlight for depth
    {
      x: 0,
      y: -1.5,
      blur: 0,
      spread: 1,
      color: theme.colors.surface.background.gray.intense,
      inset: true,
    },
  ];

  // Combine elevation.midRaised with additional shadow layers
  return `${theme.elevation.midRaised}, ${makePopupBoxShadow(shadowLayers)}`;
};

export { getPopoverBoxShadow };
