import type { ColorInputValue } from './types';

const DEFAULT_COLOR_VALUE: ColorInputValue = { hex: '#FFFFFF', opacity: 100 };

/** Accepts exactly 6 valid hex characters — used to determine when to commit the color model */
const isValidHex = (value: string): boolean => /^[0-9A-Fa-f]{6}$/.test(value);

/** Accepts 1–5 valid hex characters — used to allow progressive typing without blocking */
const isPartialHex = (value: string): boolean => /^[0-9A-Fa-f]{1,5}$/.test(value);

const isValidOpacity = (value: number): boolean =>
  Number.isInteger(value) && value >= 0 && value <= 100;

/** Pads a short hex string to 6 chars using padEnd so partial values extend right-to-left
 *  (e.g. 'F' → '#F00000' dark red), reflecting the user's left-to-right input direction.
 *  Accepts hex with or without '#' prefix. */
const padHexForPicker = (hex: string): string => {
  const stripped = hex.startsWith('#') ? hex.slice(1) : hex;
  return `#${(stripped || 'FFFFFF').padEnd(6, '0')}`;
};

export { DEFAULT_COLOR_VALUE, isValidHex, isPartialHex, isValidOpacity, padHexForPicker };
