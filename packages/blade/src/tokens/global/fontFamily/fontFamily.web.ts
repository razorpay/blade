import type { FontFamily } from './types';

// Fallbacks here are defined in `packages/blade/fonts.css`
export const fontFamily: FontFamily = {
  text: '"Inter", "Inter Fallback Arial", Arial',
  heading: '"TASA Orbiter", "TASA Orbiter Fallback Arial", Arial',
  code: '"Menlo", San Francisco Mono, Courier New, Roboto Mono, monospace',
  // Reserved for `<Heading size="2xlarge" isSerif />`. Georgia is the closest metric match to PT Serif.
  serif: '"PT Serif", "PT Serif Fallback Georgia", Georgia, serif',
};
