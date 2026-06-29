import type { ColorInputValue } from './types';

const DEFAULT_COLOR_VALUE: ColorInputValue = { hex: 'FFFFFF', opacity: 100 };

const HEX_REGEX = /^[0-9A-Fa-f]*$/;

const isValidHex = (value: string): boolean => HEX_REGEX.test(value) && value.length <= 6;

const isValidOpacity = (value: number): boolean =>
  Number.isInteger(value) && value >= 0 && value <= 100;

const padHexForPicker = (hex: string): string => `#${(hex || 'FFFFFF').padEnd(6, '0')}`;

export { DEFAULT_COLOR_VALUE, HEX_REGEX, isValidHex, isValidOpacity, padHexForPicker };
