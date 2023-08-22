import type { ChipGroupProps } from './ChipGroup';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken, DotNotationSpacingStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import { size } from '~tokens/global';
import type { IconProps } from '~components/Icons';

const chipGroupGapTokens = {
  xsmall: {
    right: 'spacing.3',
    bottom: 'spacing.3',
  },
  small: {
    right: 'spacing.3',
    bottom: 'spacing.3',
  },
  medium: {
    right: 'spacing.3',
    bottom: 'spacing.4',
  },
  large: {
    right: 'spacing.3',
    bottom: 'spacing.4',
  },
} as const;

const chipHeightTokens: Record<NonNullable<ChipGroupProps['size']>, number> = {
  xsmall: size[24],
  small: size[28],
  medium: size[36],
  large: size[48],
};

const chipBorderWidthTokens: Record<
  string,
  Record<NonNullable<ChipGroupProps['size']>, number | string>
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

type ChipHorizontalPaddingTokens = {
  default: Record<
    'left' | 'right',
    Record<NonNullable<ChipGroupProps['size']>, DotNotationSpacingStringToken>
  >;
  icon: Record<
    'left' | 'right',
    Record<NonNullable<ChipGroupProps['size']>, DotNotationSpacingStringToken>
  >;
};

const chipHorizontalPaddingTokens: ChipHorizontalPaddingTokens = {
  default: {
    left: {
      xsmall: 'spacing.4',
      small: 'spacing.4',
      medium: 'spacing.6',
      large: 'spacing.7',
    },
    right: {
      xsmall: 'spacing.4',
      small: 'spacing.4',
      medium: 'spacing.6',
      large: 'spacing.7',
    },
  },
  icon: {
    left: {
      xsmall: 'spacing.4',
      small: 'spacing.4',
      medium: 'spacing.5',
      large: 'spacing.6',
    },
    right: {
      xsmall: 'spacing.4',
      small: 'spacing.4',
      medium: 'spacing.6',
      large: 'spacing.7',
    },
  },
};

type ColorTokens = `${DotNotationColorStringToken<Theme['colors']>}` | 'transparent';

type ChipColorTokens = {
  text: Record<string, ColorTokens>;
  background: Record<string, Record<string, ColorTokens>>;
  border: Record<string, Record<string, ColorTokens>>;
};

const chipColorTokens: ChipColorTokens = {
  text: {
    unchecked: 'surface.text.subtle.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
    neutral: 'brand.primary.500',
    positive: 'feedback.text.positive.lowContrast',
    negative: 'feedback.text.negative.lowContrast',
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
      hover: 'feedback.positive.action.background.primary.hover.lowContrast',
      focus: 'feedback.positive.action.background.primary.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    negative: {
      default: 'feedback.negative.action.background.primary.default.lowContrast',
      hover: 'feedback.negative.action.background.primary.hover.lowContrast',
      focus: 'feedback.negative.action.background.primary.focus.lowContrast',
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
      hover: 'feedback.positive.action.border.primary.hover.lowContrast',
      focus: 'feedback.positive.action.border.primary.focus.lowContrast',
      disabled: 'brand.gray.a100.lowContrast',
    },
    negative: {
      default: 'feedback.negative.action.border.primary.default.lowContrast',
      hover: 'feedback.negative.action.border.primary.hover.lowContrast',
      focus: 'feedback.negative.action.border.primary.focus.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
  },
};

const getChipHoverTokens = (intent: ChipGroupProps['intent']): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: `colors.${chipColorTokens.background[intent || 'neutral'].hover}` as never,
        unchecked: 'colors.brand.gray.a50.lowContrast',
      },
      border: {
        checked: `colors.${chipColorTokens.border[intent || 'neutral'].hover}` as never,
        unchecked: 'colors.brand.gray.500.lowContrast',
      },
    },
  };
};

const chipIconSizes: Record<NonNullable<ChipGroupProps['size']>, IconProps['size']> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const chipTextSizes = {
  xsmall: {
    variant: 'body',
    size: 'small',
  },
  small: {
    variant: 'body',
    size: 'medium',
  },
  medium: {
    variant: 'body',
    size: 'large',
  },
  large: {
    variant: 'body',
    size: 'large',
  },
} as const;

const chipMotionTokens = {
  duration: 'motion.duration.xquick',
  timingFunction: 'motion.easing.standard.effective',
};

export {
  chipColorTokens,
  chipHeightTokens,
  chipBorderWidthTokens,
  chipGroupGapTokens,
  getChipHoverTokens,
  chipHorizontalPaddingTokens,
  chipTextSizes,
  chipIconSizes,
  chipMotionTokens,
};
