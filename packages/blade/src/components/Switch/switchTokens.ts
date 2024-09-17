import { size } from '~tokens/global';

const switchSizes = {
  track: {
    desktop: {
      small: {
        width: size[28],
        height: 'spacing.5',
      },
      medium: {
        width: size[36],
        height: 'spacing.6',
      },
    },
    mobile: {
      small: {
        width: size[36],
        height: 'spacing.6',
      },
      medium: {
        width: size[44],
        height: 'spacing.7',
      },
    },
  },
  thumb: {
    desktop: {
      small: {
        width: 'spacing.4',
        height: 'spacing.4',
      },
      medium: {
        width: 'spacing.5',
        height: 'spacing.5',
      },
    },
    mobile: {
      small: {
        width: 'spacing.5',
        height: 'spacing.5',
      },
      medium: {
        width: 'spacing.6',
        height: 'spacing.6',
      },
    },
  },
} as const;

const switchColors = {
  track: {
    default: {
      background: {
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'colors.interactive.background.gray.default',
      },
    },
    disabled: {
      background: {
        checked: 'colors.interactive.background.primary.faded',
        unchecked: 'colors.interactive.background.gray.disabled',
      },
    },
  },
  thumb: {
    default: {
      background: 'colors.interactive.background.staticWhite.default',
    },
    disabled: {
      background: 'colors.interactive.background.staticWhite.disabled',
    },
  },
  thumbIcon: {
    default: {
      fill: 'colors.interactive.icon.staticBlack.normal',
    },
    disabled: {
      fill: 'colors.interactive.icon.staticBlack.disabled',
    },
  },
} as const;

const switchMotion = {
  easing: {
    thumb: 'motion.easing.standard',
    thumbIcon: 'motion.easing.standard',
    track: 'motion.easing.standard',
  },
  duration: {
    thumb: 'motion.duration.quick',
    thumbIcon: 'motion.duration.quick',
    track: 'motion.duration.quick',
  },
} as const;

const switchHoverTokens = {
  default: {
    background: {
      checked: 'colors.interactive.background.primary.highlighted',
      unchecked: 'colors.interactive.background.gray.highlighted',
    },
  },
} as const;

export { switchColors, switchSizes, switchHoverTokens, switchMotion };
