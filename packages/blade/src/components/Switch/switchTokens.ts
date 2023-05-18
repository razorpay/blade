import size from '~tokens/global/size';

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

const switchIconColors = {
  variants: {
    default: {
      background: {
        checked: 'colors.brand.primary.500',
        unchecked: 'colors.brand.gray.500.lowContrast',
      },
    },
    disabled: {
      background: {
        checked: 'colors.brand.gray.a100.lowContrast',
        unchecked: 'transparent',
      },
    },
    hover: {
      background: {
        checked: 'colors.brand.primary.600',
        unchecked: 'colors.brand.gray.600.lowContrast',
      },
    },
    focus: {
      background: {
        checked: 'colors.brand.primary.600',
        unchecked: 'colors.brand.gray.600.lowContrast',
      },
    },
  },
} as const;

export { switchIconColors, switchSizes };
