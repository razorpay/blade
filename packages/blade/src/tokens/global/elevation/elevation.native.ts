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
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    midRaised: {
      elevation: 16,
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    highRaised: {
      elevation: 28,
      shadowColor: 'hsla(217, 56%, 17%, 0.9)',
      shadowOpacity: 0.4,
      shadowRadius: 28,
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
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    midRaised: {
      elevation: 16,
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    highRaised: {
      elevation: 28,
      shadowColor: 'hsla(217, 56%, 17%, 0.9)',
      shadowOpacity: 0.4,
      shadowRadius: 28,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  },
};
