/**
 * CSS named colours as rgb channels, for colours written by name in a class
 * (`bg-[white]`), as Tailwind v3 reads them (src/util/colorNames.js, MIT
 * licensed). Only the names the checkout writes; add one here before using
 * it in a class, or write the colour as hex.
 */
export const colorNames: Record<string, readonly [number, number, number]> = {
  white: [255, 255, 255],
};
