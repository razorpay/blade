import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';
import sizes from '~tokens/global/sizes';

const checkboxSizes = {
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
      width: sizes[300],
      height: sizes[300],
    },
    medium: {
      width: sizes[400],
      height: sizes[400],
    },
  },
} as const;

type ColorTokens = `colors.${DotNotationColorStringToken<Theme['colors']>}` | 'transparent';
type Variant = {
  border: {
    checked: ColorTokens;
    unchecked: ColorTokens;
  };
  background: {
    checked: ColorTokens;
    unchecked: ColorTokens;
  };
};

type CheckboxIconColors = {
  variants: {
    default: Variant;
    disabled: Variant;
    negative: Variant;
  };
};

const checkboxIconColors: CheckboxIconColors = {
  variants: {
    default: {
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

export { checkboxSizes, checkboxIconColors };
