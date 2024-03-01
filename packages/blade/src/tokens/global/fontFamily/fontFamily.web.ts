import type { FontFamily } from './types';

// Fallbacks here are defined in `packages/blade/fonts.css`
export const fontFamily: FontFamily = {
  text: '"Inter", var(--blade-inter-fallback), Arial',
  heading: '"TASA Orbiter", var(--blade-tasa-orbiter-fallback), Arial',
  code: '"Menlo", San Francisco Mono, Courier New, Roboto Mono, monospace',
};
