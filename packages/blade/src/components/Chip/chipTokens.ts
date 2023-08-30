import type { ChipGroupProps } from './ChipGroup';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken, DotNotationSpacingStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import { size } from '~tokens/global';
import type { IconProps } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

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

type ChipHorizontalPaddingTokens = {
  withoutIcon: Record<
    'left' | 'right',
    Record<NonNullable<ChipGroupProps['size']>, DotNotationSpacingStringToken>
  >;
  withIcon: Record<
    'left' | 'right',
    Record<NonNullable<ChipGroupProps['size']>, DotNotationSpacingStringToken>
  >;
};

const chipHorizontalPaddingTokens: ChipHorizontalPaddingTokens = {
  withoutIcon: {
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
  withIcon: {
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

type FeedbackActionBackgroundColors<
  T extends 'positive' | 'negative'
> = `feedback.${T}.action.background.${DotNotationColorStringToken<
  Theme['colors']['feedback'][T]['action']['background']
>}`;
type FeedbackActionBorderColors<
  T extends 'positive' | 'negative'
> = `feedback.${T}.action.border.${DotNotationColorStringToken<
  Theme['colors']['feedback'][T]['action']['border']
>}`;
type TextColorTokens = BaseTextProps['color'];
type IconColorTokens = IconProps['color'];
type ChipColorTokens = {
  text: Record<string, TextColorTokens>;
  icon: Record<string, IconColorTokens | 'brand.primary.500'>;
  background: Record<
    string,
    Record<
      string,
      | FeedbackActionBackgroundColors<'positive'>
      | FeedbackActionBackgroundColors<'negative'>
      | 'transparent'
      | 'brand.gray.a50.lowContrast'
      | 'brand.primary.300'
      | 'brand.primary.400'
    >
  >;
  border: Record<
    string,
    Record<
      string,
      | FeedbackActionBorderColors<'positive'>
      | FeedbackActionBorderColors<'negative'>
      | 'brand.gray.400.lowContrast'
      | 'brand.gray.a100.lowContrast'
      | 'brand.gray.a50.lowContrast'
      | 'brand.primary.500'
    >
  >;
};

const chipColorTokens: ChipColorTokens = {
  text: {
    unchecked: 'surface.text.subtle.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
    none: 'brand.primary.500',
    positive: 'feedback.text.positive.lowContrast',
    negative: 'feedback.text.negative.lowContrast',
  },
  icon: {
    unchecked: 'surface.text.subtle.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
    none: 'brand.primary.500',
    positive: 'feedback.icon.positive.lowContrast',
    negative: 'feedback.icon.negative.lowContrast',
  },
  background: {
    unchecked: {
      default: 'transparent',
      hover: 'brand.gray.a50.lowContrast',
      disabled: 'transparent',
    },
    none: {
      default: 'brand.primary.300',
      hover: 'brand.primary.400',
      disabled: 'brand.gray.a50.lowContrast',
    },
    positive: {
      default: 'feedback.positive.action.background.primary.default.lowContrast',
      hover: 'feedback.positive.action.background.primary.hover.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
    negative: {
      default: 'feedback.negative.action.background.primary.default.lowContrast',
      hover: 'feedback.negative.action.background.primary.hover.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
  },
  border: {
    unchecked: {
      default: 'brand.gray.400.lowContrast',
      disabled: 'brand.gray.400.lowContrast',
    },
    none: {
      default: 'brand.primary.500',
      hover: 'brand.primary.500',
      disabled: 'brand.gray.a100.lowContrast',
    },
    positive: {
      default: 'feedback.positive.action.border.primary.default.lowContrast',
      hover: 'feedback.positive.action.border.primary.hover.lowContrast',
      disabled: 'brand.gray.a100.lowContrast',
    },
    negative: {
      default: 'feedback.negative.action.border.primary.default.lowContrast',
      hover: 'feedback.negative.action.border.primary.hover.lowContrast',
      disabled: 'brand.gray.a50.lowContrast',
    },
  },
};

const getChipInputHoverTokens = (intent: ChipGroupProps['intent']): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: 'transparent',
        unchecked: 'transparent',
      },
      border: {
        checked: `colors.${chipColorTokens.border[intent || 'none'].hover}` as never,
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
  easing: 'motion.easing.standard.effective',
};

export {
  chipColorTokens,
  chipHeightTokens,
  chipGroupGapTokens,
  getChipInputHoverTokens,
  chipHorizontalPaddingTokens,
  chipTextSizes,
  chipIconSizes,
  chipMotionTokens,
};
