import type { Theme } from '~components/BladeProvider';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { DotNotationColorStringToken } from '~src/_helpers/types';
import size from '~tokens/global/size';

type ColorTokens = `colors.${DotNotationColorStringToken<Theme['colors']>}` | 'transparent';
type State = {
  checked: ColorTokens;
  unchecked: ColorTokens;
};
type SwitchColors = {
  track: Record<'default' | 'disabled', Record<string, State>>;
  thumb: Record<'default' | 'disabled', Record<string, ColorTokens>>;
  thumbIcon: Record<'default' | 'disabled', Record<string, ColorTokens>>;
};

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

const switchColors: SwitchColors = {
  track: {
    default: {
      background: {
        checked: 'colors.brand.primary.500',
        unchecked: 'colors.brand.gray.500.lowContrast',
      },
    },
    disabled: {
      background: {
        checked: 'colors.brand.primary.400',
        unchecked: 'colors.brand.gray.a100.lowContrast',
      },
    },
  },
  thumb: {
    default: {
      background: 'colors.brand.gray.200.lowContrast',
    },
    disabled: {
      background: 'colors.brand.gray.700.highContrast',
    },
  },
  thumbIcon: {
    default: {
      fill: 'colors.brand.gray.200.highContrast',
    },
    disabled: {
      fill: 'colors.surface.text.placeholder.lowContrast',
    },
  },
};

const switchHoverTokens: SelectorInputHoverTokens = {
  default: {
    background: {
      checked: 'colors.brand.primary.600',
      unchecked: 'colors.brand.gray.600.lowContrast',
    },
  },
};

export { switchColors, switchSizes, switchHoverTokens };
