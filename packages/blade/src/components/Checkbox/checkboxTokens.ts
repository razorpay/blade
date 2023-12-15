import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import { size } from '~tokens/global';

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
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'colors.interactive.border.gray.highlighted',
      },
      background: {
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'transparent',
      },
    },
    disabled: {
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

const checkboxHoverTokens: SelectorInputHoverTokens = {
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

export { checkboxSizes, checkboxIconColors, checkboxHoverTokens };
