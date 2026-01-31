import type { ElevationWithColorModes } from './types';

export const elevation: ElevationWithColorModes = {
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
      shadowColor: `hsla(217, 56%, 17%, 0.4)`,
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    midRaised: {
      elevation: 16,
      shadowColor: `hsla(217, 56%, 17%, 0.55)`,
      shadowOpacity: 0.17,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    highRaised: {
      elevation: 24,
      shadowColor: `hsla(217, 56%, 17%, 0.8)`,
      shadowOpacity: 0.16,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  },
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
      shadowColor: `hsla(217, 56%, 17%, 0.4)`,
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    midRaised: {
      elevation: 16,
      shadowColor: `hsla(217, 56%, 17%, 0.55)`,
      shadowOpacity: 0.17,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    highRaised: {
      elevation: 24,
      shadowColor: `hsla(217, 56%, 17%, 0.8)`,
      shadowOpacity: 0.16,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  },
};
