/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Represents a single shadow layer configuration
 * Used to create complex multi-layer shadows for popup components
 */
export type ShadowLayer = {
  /** Horizontal offset in pixels */
  x: number;
  /** Vertical offset in pixels */
  y: number;
  /** Blur radius in pixels */
  blur: number;
  /** Spread radius in pixels */
  spread: number;
  /** Color value (hex, rgb, rgba, hsla, etc.) */
  color: string;
  /** Whether this is an inset shadow */
  inset: boolean;
};

/**
 * Converts an array of shadow layer objects into a CSS box-shadow string
 *
 * @param shadowLayers - Array of shadow layer configurations
 * @returns CSS box-shadow string with multiple layers joined by commas
 *
 * @example
 * ```ts
 * const layers = [
 *   { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false },
 *   { x: 0, y: 0, blur: 0, spread: 1, color: 'rgba(255,255,255,0.5)', inset: true }
 * ];
 * const boxShadow = makePopupBoxShadow(layers);
 * // Result: "0px 2px 4px 0px rgba(0,0,0,0.1), inset 0px 0px 0px 1px rgba(255,255,255,0.5)"
 * ```
 */
export const makePopupBoxShadow = (shadowLayers: ShadowLayer[]): string => {
  return shadowLayers
    .map((layer) => {
      const inset = layer.inset ? 'inset ' : '';
      return `${inset}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${layer.color}`;
    })
    .join(', ');
};
