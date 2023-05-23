import type { Theme } from '~components/BladeProvider';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { DotNotationColorStringToken } from '~src/_helpers/types';
import size from '~tokens/global/size';

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
      width: size[12],
      height: size[12],
    },
    medium: {
      width: size[16],
      height: size[16],
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

const checkboxHoverTokens: SelectorInputHoverTokens = {
  default: {
    background: {
      checked: 'colors.brand.primary.600',
      unchecked: 'colors.brand.gray.a50.lowContrast',
    },
    border: {
      checked: 'colors.brand.primary.600',
      unchecked: 'colors.brand.gray.500.lowContrast',
    },
  },
};

export { checkboxSizes, checkboxIconColors, checkboxHoverTokens };
