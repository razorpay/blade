import type { ElevationWithColorModes } from './types';

export const elevation: ElevationWithColorModes = {
  onLight: {
    none: 'none',
    /** offset-x | offset-y | blur-radius | spread-radius | color, offset-x | offset-y | blur-radius | spread-radius | color */
    lowRaised: `0px 2px 16px 0px hsla(217, 56%, 17%, 0.10)`,
    midRaised: `0px 8px 24px 0px hsla(217, 56%, 17%, 0.12)`,
    highRaised: `0px 16px 48px -4px hsla(217, 56%, 17%, 0.18)`,
  },
  onDark: {
    none: 'none',
    // @TODO: replace the values with correct dark mode values
    lowRaised: `0px 2px 16px 0px hsla(217, 56%, 17%, 0.10)`,
    midRaised: `0px 8px 24px 0px hsla(217, 56%, 17%, 0.12)`,
    highRaised: `0px 16px 48px -4px hsla(217, 56%, 17%, 0.18)`,
  },
};
