import { opacity } from '~tokens/index';
import type { ElevationWithColorModes } from './types';

/** offset-x | offset-y | blur-radius | spread-radius | color, offset-x | offset-y | blur-radius | spread-radius | color */
export const elevation: ElevationWithColorModes = {
  // color: neutral.blueGrayLight.a1106
  onLight: {
    none: 'none',
    lowRaised: `0px 2px 4px 0px hsla(200, 10%, 18%, ${opacity[50]})`,
    midRaised: `0px 2px 8px 0px hsla(200, 10%, 18%, ${opacity[50]})`,
    highRaised: `0px 8px 24px -4px hsla(200, 10%, 18%, ${opacity[50]})`,
  },
  // color: neutral.black.100
  onDark: {
    none: 'none',
    lowRaised: `0px 2px 4px 0px hsla(0, 0%, 0%, ${opacity[500]})`,
    midRaised: `0px 2px 8px 0px hsla(0, 0%, 0%, ${opacity[500]})`,
    highRaised: `0px 8px 24px -4px hsla(0, 0%, 0%, ${opacity[500]})`,
  },
};
