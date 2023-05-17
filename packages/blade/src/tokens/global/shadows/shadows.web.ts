import type { ShadowsWithColorModes } from './types';

export const shadows: ShadowsWithColorModes = {
  onLight: {
    none: 'none',
    /** offset-x | offset-y | blur-radius | spread-radius | color, offset-x | offset-y | blur-radius | spread-radius | color */
    lowRaised: `0 4px 8px -2px hsla(217, 56%, 17%, 0.1), 0 2px 4px -2px hsla(217, 56%, 17%, 0.06)`,
    midRaised: `0 12px 16px -4px hsla(217, 56%, 17%, 0.08), 0 4px 6px -2px hsla(217, 56%, 17%, 0.03)`,
    highRaised: `0 24px 48px -12px hsla(217, 56%, 17%, 0.18)`,
  },
  onDark: {
    none: 'none',
    // @TODO: replace the values with correct dark mode values
    lowRaised: `0 4px 8px -2px hsla(231, 67%, 10%, 0.10), 0 2px 4px -2px hsla(231, 67%, 10%, 0.06)`,
    midRaised: `0 12px 16px -4px hsla(231, 67%, 10%, 0.08), 0 4px 6px -2px hsla(231, 67%, 10%, 0.03)`,
    highRaised: `0 24px 48px -12px hsla(231, 67%, 10%, 0.18)`,
  },
};
