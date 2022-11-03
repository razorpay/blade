import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

const radioSizes = {
  group: {
    gap: {
      small: {
        mobile: 'spacing.2',
        desktop: 'spacing.0',
      },
      medium: {
        mobile: 'spacing.3',
        desktop: 'spacing.2',
      },
    },
  },
  icon: {
    small: {
      width: 12,
      height: 12,
      dotRadius: 2,
    },
    medium: {
      width: 16,
      height: 16,
      dotRadius: 3,
    },
  },
} as const;

type ColorTokens = `colors.${DotNotationColorStringToken<Theme['colors']>}` | 'transparent';
type Variant = {
  dot: {
    checked: ColorTokens;
    unchecked: ColorTokens;
  };
  border: {
    checked: ColorTokens;
    unchecked: ColorTokens;
  };
  background: {
    checked: ColorTokens;
    unchecked: ColorTokens;
  };
};

type RadioIconColors = {
  variants: {
    default: Variant;
    disabled: Variant;
    negative: Variant;
  };
};

const radioIconColors: RadioIconColors = {
  variants: {
    default: {
      dot: {
        checked: 'colors.brand.gray.200.lowContrast',
        unchecked: 'colors.brand.gray.200.lowContrast',
      },
      border: {
        checked: 'colors.brand.primary.500',
        unchecked: 'colors.brand.gray.500.lowContrast',
      },
      background: {
        checked: 'colors.brand.primary.500',
        unchecked: 'transparent',
      },
    },
    disabled: {
      dot: {
        checked: 'colors.brand.gray.200.lowContrast',
        unchecked: 'colors.brand.gray.200.lowContrast',
      },
      border: {
        checked: 'transparent',
        unchecked: 'colors.brand.gray.a100.lowContrast',
      },
      background: {
        checked: 'colors.brand.gray.a100.lowContrast',
        unchecked: 'transparent',
      },
    },
    negative: {
      dot: {
        checked: 'colors.brand.gray.200.lowContrast',
        unchecked: 'colors.brand.gray.200.lowContrast',
      },
      border: {
        checked: 'colors.feedback.border.negative.highContrast',
        unchecked: 'colors.feedback.border.negative.highContrast',
      },
      background: {
        checked: 'colors.feedback.background.negative.highContrast',
        unchecked: 'colors.feedback.background.negative.lowContrast',
      },
    },
  },
} as const;

export { radioSizes, radioIconColors };
