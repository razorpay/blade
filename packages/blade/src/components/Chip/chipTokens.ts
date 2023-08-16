import type { ChipProps } from './Chip';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken, DotNotationSpacingStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import { size } from '~tokens/global';
import type { IconProps } from '~components/Icons';

const chipSizes = {
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

type ChipIconColors = {
  variants: {
    default: Variant;
    disabled: Variant;
    negative: Variant;
  };
};

const chipIconColors: ChipIconColors = {
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

const chipHeightTokens: Record<NonNullable<ChipProps['size']>, number> = {
  xsmall: size[24],
  small: size[28],
  medium: size[36],
  large: size[48],
};

const chipBorderWidthTokens: Record<
  string,
  Record<NonNullable<ChipProps['size']>, number | string>
> = {
  unchecked: {
    xsmall: 'border.width.thin',
    small: 'border.width.thin',
    medium: 'border.width.thin',
    large: 'border.width.thin',
  },
  checked: {
    xsmall: 'border.width.thick',
    small: 'border.width.thick',
    // TODO: replace with border.width.thicker when available as a token
    medium: size[2],
    large: size[2],
  },
};

const horizontalPadding = {
  default: {
    xsmall: 'spacing.4',
    small: 'spacing.4',
    medium: 'spacing.6',
    large: 'spacing.7',
  },
  icon: {
    xsmall: 'spacing.4',
    small: 'spacing.4',
    medium: 'spacing.5',
    large: 'spacing.6',
  },
};

const chipColorTokens = {
  text: {
    unchecked: 'surface.text.subtle.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
    neutral: 'brand.primary.500.lowContrast',
    positive: 'feedback.text.positive.lowContrast',
    negative: 'feedback.text.negative.lowContrast',
    notice: 'feedback.text.notice.lowContrast',
    information: 'feedback.text.information.lowContrast',
  },
  background: {
    unchecked: {
      default: 'transparent',
      hover: 'brand.gray.a50.lowContrast',
      focus: 'brand.gray.a50.lowContrast',
      disabled: 'transparent',
    },
    neutral: {
      default: 'brand.primary.300',
      hover: 'brand.primary.400',
      focused: 'brand.primary.400',
      disabled: 'brand.gray.a50.lowContrast',
    },
    positive: {
      default: 'feedback.positive.action.background.primary.default.lowContrast',
      hover: 'feedback.positive.action.background.primary.positive.hover.lowContrast',
      focus: 'feedback.positive.action.background.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    negative: {
      default: 'feedback.negative.action.background.primary.default.lowContrast',
      hover: 'feedback.negative.action.background.primary.positive.hover.lowContrast',
      focus: 'feedback.negative.action.background.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    notice: {
      default: 'feedback.notice.action.background.primary.default.lowContrast',
      hover: 'feedback.notice.action.background.primary.positive.hover.lowContrast',
      focus: 'feedback.notice.action.background.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    information: {
      default: 'feedback.information.action.background.primary.default.lowContrast',
      hover: 'feedback.information.action.background.primary.positive.hover.lowContrast',
      focus: 'feedback.information.action.background.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
  },
  border: {
    unchecked: {
      default: 'brand.gray.400.lowContrast',
      disabled: 'brand.gray.400.lowContrast',
    },
    neutral: {
      default: 'brand.primary.500',
      hover: 'brand.primary.500',
      focused: 'brand.primary.500',
      disabled: 'brand.gray.a100.lowContrast',
    },
    positive: {
      default: 'feedback.positive.action.border.primary.default.lowContrast',
      hover: 'feedback.positive.action.border.primary.positive.hover.lowContrast',
      focus: 'feedback.positive.action.border.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a100.lowContrast',
    },
    negative: {
      default: 'feedback.negative.action.border.primary.default.lowContrast',
      hover: 'feedback.negative.action.border.primary.positive.hover.lowContrast',
      focus: 'feedback.negative.action.border.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    notice: {
      default: 'feedback.notice.action.border.primary.default.lowContrast',
      hover: 'feedback.notice.action.border.primary.positive.hover.lowContrast',
      focus: 'feedback.notice.action.border.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    information: {
      default: 'feedback.information.action.border.primary.default.lowContrast',
      hover: 'feedback.information.action.border.primary.positive.hover.lowContrast',
      focus: 'feedback.information.action.border.primary.positive.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
  },
  unchecked: {
    default: 'surface.text.subtle.lowContrast',
    hover: 'surface.text.subtle.lowContrast',
    focused: 'surface.text.subtle.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
  },
  neutral: {
    default: 'brand.primary.500.lowContrast',
    hover: 'brand.primary.500.lowContrast',
    focused: 'brand.primary.500.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
  },
  positive: {
    default: 'feedback.text.positive.lowContrast',
    hover: 'feedback.text.positive.lowContrast',
    focused: 'feedback.text.positive.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
  },
  negative: {
    default: 'feedback.text.negative.lowContrast',
    hover: 'feedback.text.negative.lowContrast',
    focused: 'feedback.text.negative.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
  },
  notice: {
    default: 'feedback.text.notice.lowContrast',
    hover: 'feedback.text.notice.lowContrast',
    focused: 'feedback.text.notice.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
  },
  information: {
    default: 'feedback.text.information.lowContrast',
    hover: 'feedback.text.information.lowContrast',
    focused: 'feedback.text.information.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
  },
};

const getChipHoverTokens = (variant: ChipProps['variant']): SelectorInputHoverTokens => ({
  default: {
    background: {
      checked: chipColorTokens.background[variant || 'neutral'].hover as never,
      unchecked: 'colors.brand.gray.a50.lowContrast',
    },
    border: {
      checked: chipColorTokens.border[variant || 'neutral'].hover as never,
      unchecked: 'colors.brand.gray.500.lowContrast',
    },
  },
});

const iconPadding: Record<NonNullable<ChipProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

const iconSize: Record<NonNullable<ChipProps['size']>, IconProps['size']> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

export {
  chipColorTokens,
  chipHeightTokens,
  chipBorderWidthTokens,
  chipSizes,
  chipIconColors,
  getChipHoverTokens,
  horizontalPadding,
  iconPadding,
  iconSize,
};
