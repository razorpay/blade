import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
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
        checked: 'colors.interactive.background.staticWhite.disabled',
        unchecked: 'colors.interactive.background.staticWhite.disabled',
      },
      border: {
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'colors.interactive.border.gray.highlighted',
      },
      background: {
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'transparent',
      },
    },
    disabled: {
      dot: {
        checked: 'colors.interactive.background.staticWhite.disabled',
        unchecked: 'colors.interactive.background.staticWhite.disabled',
      },
      border: {
        checked: 'transparent',
        unchecked: 'colors.interactive.background.gray.disabled',
      },
      background: {
        checked: 'colors.interactive.background.gray.disabled',
        unchecked: 'transparent',
      },
    },
    negative: {
      dot: {
        checked: 'colors.interactive.background.staticWhite.disabled',
        unchecked: 'colors.interactive.background.staticWhite.disabled',
      },
      border: {
        checked: 'colors.feedback.border.negative.intense',
        unchecked: 'colors.feedback.border.negative.intense',
      },
      background: {
        checked: 'colors.feedback.background.negative.intense',
        unchecked: 'colors.feedback.background.negative.subtle',
      },
    },
  },
} as const;

const radioHoverTokens: SelectorInputHoverTokens = {
  default: {
    background: {
      checked: 'colors.interactive.background.primary.highlighted',
      unchecked: 'colors.interactive.background.gray.default',
    },
    border: {
      checked: 'colors.interactive.background.primary.highlighted',
      unchecked: 'colors.interactive.border.gray.highlighted',
    },
  },
};

export { radioSizes, radioIconColors, radioHoverTokens };
