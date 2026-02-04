/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Theme } from '~components/BladeProvider';

type ShadowLayer = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
};

/**
 * Converts an array of shadow layer objects into a CSS box-shadow string
 *
 * @param shadowLayers - Array of shadow layer configurations
 * @returns CSS box-shadow string with multiple layers joined by commas
 */
const shadowLayersToBoxShadow = (shadowLayers: ShadowLayer[]): string => {
  return shadowLayers
    .map((layer) => {
      const inset = layer.inset ? 'inset ' : '';
      return `${inset}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${layer.color}`;
    })
    .join(', ');
};

/**
 * Popover shadow layers as per Figma design: _components/Popup shadow
 *
 * Consists of 3 layers:
 * 1. Drop shadow: 0px 12px 16px 0px elevation.midRaised
 * 2. Inner border: inset 0px 0px 0px 1px
 * 3. Top highlight: inset 0px -1.5px 0px 1px
 */
const getPopoverBoxShadow = (theme: Theme): string => {
  const shadowLayers = [
    // Layer 1: Drop shadow for elevation
    {
      x: 0,
      y: 12,
      blur: 16,
      spread: 0,
      color: 'hsla(200, 10%, 18%, 0.06)',
      inset: false,
    },

    // Layer 2: Top highlight for depth
    {
      x: 0,
      y: -1.5,
      blur: 0,
      spread: 1,
      color: theme.colors.surface.background.gray.intense,
      inset: true,
    },
  ];

  return shadowLayersToBoxShadow(shadowLayers);
};

export { getPopoverBoxShadow };
