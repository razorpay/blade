import type { ElevationWithColorModes } from './types';
import { opacity } from '~tokens/index';

export const elevation: ElevationWithColorModes = {
  // color: neutral.blueGrayLight.a1106
  onLight: {
    none: {
      elevation: 0,
      shadowColor: '',
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    lowRaised: {
      elevation: 8,
      shadowColor: `hsla(200, 10%, 18%, 1)`,
      shadowOpacity: opacity[50],
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    midRaised: {
      elevation: 16,
      shadowColor: `hsla(200, 10%, 18%, 1)`,
      shadowOpacity: opacity[50],
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    highRaised: {
      elevation: 24,
      shadowColor: `hsla(200, 10%, 18%, 1)`,
      shadowOpacity: opacity[50],
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  },
  // color: neutral.black.100
  onDark: {
    none: {
      elevation: 0,
      shadowColor: '',
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    lowRaised: {
      elevation: 8,
      shadowColor: `hsla(0, 0%, 0%, 1)`,
      shadowOpacity: opacity[500],
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    midRaised: {
      elevation: 16,
      shadowColor: `hsla(0, 0%, 0%, 1)`,
      shadowOpacity: opacity[500],
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    highRaised: {
      elevation: 24,
      shadowColor: `hsla(0, 0%, 0%, 1)`,
      shadowOpacity: opacity[500],
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  },
};
