import type { ShadowsWithColorModes } from './types';

export const shadows: ShadowsWithColorModes = {
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
      elevation: 4,
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.12,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },
    midRaised: {
      elevation: 12,
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
    highRaised: {
      elevation: 26,
      shadowColor: 'hsla(217, 56%, 17%, 0.64)',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 18,
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
      elevation: 4,
      shadowColor: 'hsla(231, 67%, 10%, 0.64)',
      shadowOpacity: 0.12,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },
    midRaised: {
      elevation: 12,
      shadowColor: 'hsla(231, 67%, 10%, 0.64)',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
    highRaised: {
      elevation: 26,
      shadowColor: 'hsla(231, 67%, 10%, 0.64)',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 18,
      },
    },
  },
};
