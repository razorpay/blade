import type { ChipGroupProps } from './ChipGroup';
import type { ChipBorderColors, ChipBackgroundColors } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { IconProps } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { DurationString, EasingString } from '~tokens/global';
import { size } from '~tokens/global';

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

const chipGroupLabelSizeTokens = {
  xsmall: 'small',
  small: 'medium',
  medium: 'large',
  large: 'large',
} as const;

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

type TextColorTokens = BaseTextProps['color'];
type IconColorTokens = IconProps['color'];
type ChipColorTokens = {
  text: Record<string, TextColorTokens>;
  icon: Record<string, IconColorTokens>;
  background: Record<string, Record<string, ChipBackgroundColors>>;
  border: Record<string, Record<string, ChipBorderColors>>;
};

const chipColorTokens: ChipColorTokens = {
  text: {
    unchecked: 'interactive.text.gray.subtle',
    disabled: 'interactive.text.gray.disabled',
    primary: 'interactive.text.primary.normal',
    positive: 'interactive.text.positive.normal',
    negative: 'interactive.text.negative.normal',
  },
  icon: {
    unchecked: 'interactive.icon.gray.subtle',
    disabled: 'interactive.icon.gray.disabled',
    primary: 'interactive.icon.primary.normal',
    positive: 'interactive.icon.positive.normal',
    negative: 'interactive.icon.negative.normal',
  },
  background: {
    unchecked: {
      default: 'surface.background.gray.intense',
      hover: 'interactive.background.gray.faded',
      disabled: 'transparent',
    },
    primary: {
      default: 'interactive.background.primary.faded',
      hover: 'interactive.background.primary.fadedHighlighted',
      disabled: 'interactive.background.primary.disabled',
    },
    positive: {
      default: 'interactive.background.positive.faded',
      hover: 'interactive.background.positive.fadedHighlighted',
      disabled: 'interactive.background.positive.disabled',
    },
    negative: {
      default: 'interactive.background.negative.faded',
      hover: 'interactive.background.negative.fadedHighlighted',
      disabled: 'interactive.background.negative.disabled',
    },
  },
  border: {
    unchecked: {
      default: 'interactive.border.gray.faded',
      hover: 'interactive.border.gray.faded',
      disabled: 'interactive.border.gray.disabled',
    },
    primary: {
      default: 'interactive.border.primary.default',
      hover: 'interactive.border.primary.default',
      disabled: 'interactive.border.primary.disabled',
    },
    positive: {
      default: 'interactive.border.positive.default',
      hover: 'interactive.border.positive.default',
      disabled: 'interactive.border.positive.disabled',
    },
    negative: {
      default: 'interactive.border.negative.default',
      hover: 'interactive.border.negative.default',
      disabled: 'interactive.border.negative.disabled',
    },
  },
};

const getChipInputHoverTokens = (color: ChipGroupProps['color']): SelectorInputHoverTokens => {
  return {
    default: {
      background: {
        checked: 'colors.transparent',
        unchecked: 'colors.transparent',
      },
      border: {
        checked: `colors.${chipColorTokens.border[color || 'default'].hover}` as never,
        unchecked: 'colors.interactive.border.gray.faded',
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

const chipMotionTokens: Record<'duration' | 'easing', DurationString | EasingString> = {
  duration: 'duration.xquick',
  easing: 'easing.standard',
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
  chipGroupLabelSizeTokens,
};
