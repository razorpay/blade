import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';
import { size } from '~tokens/global';

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
      width: size[12],
      height: size[12],
      dotRadius: size[2],
    },
    medium: {
      width: size[16],
      height: size[16],
      dotRadius: size[3],
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
