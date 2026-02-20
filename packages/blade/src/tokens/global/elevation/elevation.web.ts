import type { ElevationWithColorModes } from './types';

/** offset-x | offset-y | blur-radius | spread-radius | color, offset-x | offset-y | blur-radius | spread-radius | color */
export const elevation: ElevationWithColorModes = {
  // color: neutral.blueGrayLight.a1106
  onLight: {
    none: 'none',
    lowRaised: `0px 2px 4px 0px hsla(200, 10%, 18%, 0.06)`,
    midRaised: `0px 16px 12px 0px hsla(200, 10%, 18%, 0.06)`,
    highRaised: `0px 8px 24px -4px hsla(200, 10%, 18%, 0.06)`,
  },
  // color: neutral.black.100
  onDark: {
    none: 'none',
    lowRaised: `0px 2px 4px 0px hsla(0, 0%, 0%, 0.32)`,
    midRaised: `0px 2px 8px 0px hsla(0, 0%, 0%, 0.32)`,
    highRaised: `0px 8px 24px -4px hsla(0, 0%, 0%, 0.32)`,
  },
};
