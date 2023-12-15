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
> = `feedback.${T}.action.background.primary.${DotNotationColorStringToken<
  Theme['colors']['feedback'][T]['action']['background']['primary']
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
  icon: Record<string, IconColorTokens | 'interactive.background.primary.default'>;
  background: Record<
    string,
    Record<
      string,
      | FeedbackActionBackgroundColors<'positive'>
      | FeedbackActionBackgroundColors<'negative'>
      | 'transparent'
      | 'interactive.background.gray.default'
      | 'interactive.background.primary.disabled'
      | 'interactive.background.primary.faded'
    >
  >;
  border: Record<
    string,
    Record<
      string,
      | FeedbackActionBorderColors<'positive'>
      | FeedbackActionBorderColors<'negative'>
      | 'interactive.border.gray.faded'
      | 'interactive.background.gray.disabled'
      | 'interactive.background.gray.default'
      | 'interactive.background.primary.default'
    >
  >;
};

const chipColorTokens: ChipColorTokens = {
  text: {
    unchecked: 'surface.text.gray.subtle',
    disabled: 'surface.text.gray.disabled',
    default: 'interactive.text.primary.normal',
    positive: 'feedback.text.positive.intense',
    negative: 'feedback.text.negative.intense',
  },
  icon: {
    unchecked: 'surface.text.gray.subtle',
    disabled: 'surface.text.gray.disabled',
    default: 'interactive.icon.primary.normal',
    positive: 'feedback.icon.positive.intense',
    negative: 'feedback.icon.negative.intense',
  },
  background: {
    unchecked: {
      default: 'transparent',
      hover: 'interactive.background.gray.default',
      disabled: 'transparent',
    },
    default: {
      default: 'interactive.background.primary.disabled',
      hover: 'interactive.background.primary.faded',
      disabled: 'interactive.background.gray.default',
    },
    positive: {
      default: 'interactive.background.positive.faded',
      hover: 'interactive.background.positive.faded',
      disabled: 'interactive.background.gray.default',
    },
    negative: {
      default: 'interactive.background.negative.faded',
      hover: 'interactive.background.negative.faded',
      disabled: 'interactive.background.gray.default',
    },
  },
  border: {
    unchecked: {
      default: 'interactive.border.gray.faded',
      disabled: 'interactive.border.gray.faded',
    },
    default: {
      default: 'interactive.background.primary.default',
      hover: 'interactive.background.primary.default',
      disabled: 'interactive.background.gray.disabled',
    },
    positive: {
      default: 'interactive.border.positive.faded',
      hover: 'interactive.border.positive.faded',
      disabled: 'interactive.background.gray.disabled',
    },
    negative: {
      default: 'interactive.border.negative.faded',
      hover: 'interactive.border.negative.faded',
      disabled: 'interactive.background.gray.default',
    },
  },
};

const getChipInputHoverTokens = (color: ChipGroupProps['color']): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: 'transparent',
        unchecked: 'transparent',
      },
      border: {
        checked: `colors.${chipColorTokens.border[color || 'default'].hover}` as never,
        unchecked: 'colors.interactive.border.gray.highlighted',
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
