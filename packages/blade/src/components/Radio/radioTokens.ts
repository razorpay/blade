import type { Theme } from '~components/BladeProvider';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import { size } from '~tokens/global';

const radioSizes = {
  group: {
    gap: {
      small: {
        mobile: 'spacing.3',
        desktop: 'spacing.2',
      },
      medium: {
        mobile: 'spacing.4',
        desktop: 'spacing.3',
      },
      large: {
        mobile: 'spacing.5',
        desktop: 'spacing.4',
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
    large: {
      width: size[20],
      height: size[20],
      dotRadius: size[4],
    },
  },
} as const;

type ColorTokens = `colors.${DotNotationToken<Theme['colors']>}`;
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
        checked: 'colors.interactive.icon.onPrimary.normal',
        unchecked: 'colors.transparent',
      },
      border: {
        checked: 'colors.interactive.border.primary.default',
        unchecked: 'colors.interactive.border.gray.default',
      },
      background: {
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'colors.transparent',
      },
    },
    disabled: {
      dot: {
        checked: 'colors.interactive.icon.onPrimary.normal',
        unchecked: 'colors.interactive.icon.onPrimary.normal',
      },
      border: {
        checked: 'colors.transparent',
        unchecked: 'colors.interactive.border.gray.disabled',
      },
      background: {
        checked: 'colors.interactive.background.primary.disabled',
        unchecked: 'colors.transparent',
      },
    },
    negative: {
      dot: {
        checked: 'colors.interactive.icon.onPrimary.normal',
        unchecked: 'colors.transparent',
      },
      border: {
        checked: 'colors.interactive.border.negative.default',
        unchecked: 'colors.interactive.border.negative.default',
      },
      background: {
        checked: 'colors.interactive.background.negative.default',
        unchecked: 'colors.transparent',
      },
    },
  },
} as const;

const radioHoverTokens: SelectorInputHoverTokens = {
  default: {
    background: {
      checked: 'colors.interactive.background.primary.highlighted',
      unchecked: 'colors.interactive.background.gray.faded',
    },
    border: {
      checked: 'colors.interactive.background.primary.highlighted', // Intentionally not using border tokens here since we want to match the background color
      unchecked: 'colors.interactive.border.gray.default',
    },
  },
};

export { radioSizes, radioIconColors, radioHoverTokens };
