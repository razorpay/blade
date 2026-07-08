import type { ColorInputValue } from './types';

const DEFAULT_COLOR_VALUE: ColorInputValue = { hex: '#FFFFFF', opacity: 100 };

/** Accepts exactly 6 valid hex characters — used to determine when to commit the color model */
const isValidHex = (value: string): boolean => /^[0-9A-Fa-f]{6}$/.test(value);

/** Accepts 1–5 valid hex characters — used to allow progressive typing without blocking */
const isPartialHex = (value: string): boolean => /^[0-9A-Fa-f]{1,5}$/.test(value);

const isValidOpacity = (value: number): boolean =>
  Number.isInteger(value) && value >= 0 && value <= 100;

/** Pads a short hex string to 6 chars using padStart so partial values trend toward black (#000001)
 *  rather than producing unexpected hues (padEnd would give #100000 for '1').
 *  Accepts hex with or without '#' prefix. */
const padHexForPicker = (hex: string): string => {
  const stripped = hex.startsWith('#') ? hex.slice(1) : hex;
  return `#${(stripped || 'FFFFFF').padStart(6, '0')}`;
};

export { DEFAULT_COLOR_VALUE, isValidHex, isPartialHex, isValidOpacity, padHexForPicker };
