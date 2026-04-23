import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import chipStyles from './chip.module.css';
// @ts-expect-error - CSS modules may not have type definitions in build
import chipGroupStyles from './chipGroup.module.css';

export type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';
export type ChipColor = 'primary' | 'positive' | 'negative';

export type ChipColorVariant =
  | 'unchecked'
  | 'primaryChecked'
  | 'positiveChecked'
  | 'negativeChecked'
  | 'uncheckedDisabled'
  | 'primaryDisabled'
  | 'positiveDisabled'
  | 'negativeDisabled';

// ── AnimatedChip (outer): border + scale animation ──

export type AnimatedChipVariants = {
  size?: ChipSize;
  colorVariant?: ChipColorVariant;
};

// Base class + shared outer border-width come from the chip module + utilities.
const animatedChipBase = [chipStyles.animatedChip, utilityClasses['border-width-thin']].join(' ');

export const animatedChipCva = cva(animatedChipBase, {
  variants: {
    size: {
      xsmall: utilityClasses['border-radius-small'],
      small: utilityClasses['border-radius-small'],
      medium: utilityClasses['border-radius-small'],
      large: utilityClasses['border-radius-medium'],
    },
    colorVariant: {
      unchecked: utilityClasses['border-interactive-border-gray-faded'],
      primaryChecked: utilityClasses['border-interactive-border-primary-default'],
      positiveChecked: utilityClasses['border-interactive-border-positive-default'],
      negativeChecked: utilityClasses['border-interactive-border-negative-default'],
      uncheckedDisabled: utilityClasses['border-interactive-border-gray-disabled'],
      primaryDisabled: utilityClasses['border-interactive-border-primary-disabled'],
      positiveDisabled: utilityClasses['border-interactive-border-positive-disabled'],
      negativeDisabled: utilityClasses['border-interactive-border-negative-disabled'],
    },
  },
  defaultVariants: {
    size: 'small',
    colorVariant: 'unchecked',
  },
});

export function getAnimatedChipClasses(props: AnimatedChipVariants): string {
  return animatedChipCva(props);
}

// ── StyledChipWrapper (inner): background + inner border + hover ──

export type ChipInnerVariants = {
  size?: ChipSize;
  colorVariant?: ChipColorVariant;
  isDisabled?: boolean;
};

export const chipInnerCva = cva(chipStyles.chipInner, {
  variants: {
    size: {
      xsmall: [chipStyles.innerXsmall, utilityClasses['border-width-thinner']].join(' '),
      small: [chipStyles.innerSmall, utilityClasses['border-width-thinner']].join(' '),
      medium: [chipStyles.innerMedium, utilityClasses['border-width-thin']].join(' '),
      large: [chipStyles.innerLarge, utilityClasses['border-width-thin']].join(' '),
    },
    colorVariant: {
      unchecked: chipStyles.innerUnchecked,
      primaryChecked: chipStyles.innerPrimaryChecked,
      positiveChecked: chipStyles.innerPositiveChecked,
      negativeChecked: chipStyles.innerNegativeChecked,
      uncheckedDisabled: [chipStyles.innerUncheckedDisabled, chipStyles.disabled].join(' '),
      primaryDisabled: [chipStyles.innerPrimaryDisabled, chipStyles.disabled].join(' '),
      positiveDisabled: [chipStyles.innerPositiveDisabled, chipStyles.disabled].join(' '),
      negativeDisabled: [chipStyles.innerNegativeDisabled, chipStyles.disabled].join(' '),
    },
    isDisabled: {
      true: chipStyles.disabled,
      false: null,
    },
  },
  defaultVariants: {
    size: 'small',
    colorVariant: 'unchecked',
    isDisabled: false,
  },
});

export function getChipInnerClasses(props: ChipInnerVariants): string {
  return chipInnerCva(props);
}

/** @deprecated Use getAnimatedChipClasses + getChipInnerClasses instead */
export function getChipClasses(props: ChipInnerVariants): string {
  return getChipInnerClasses(props);
}

export function getChipTemplateClasses(): Record<string, string> {
  return {
    chipWrapper: chipStyles.chipWrapper,
    label: chipStyles.label,
    labelDisabled: chipStyles.labelDisabled,
    srOnly: chipStyles.srOnly,
    animatedChip: chipStyles.animatedChip,
    chipInner: chipStyles.chipInner,
    pressed: chipStyles.pressed,
    chipIcon: chipStyles.chipIcon,
    chipText: chipStyles.chipText,
  };
}

export function getChipColorVariant(
  isChecked: boolean,
  color: ChipColor | undefined,
  isDisabled: boolean,
): ChipColorVariant {
  if (isDisabled) {
    if (!isChecked) return 'uncheckedDisabled';
    switch (color) {
      case 'primary':
        return 'primaryDisabled';
      case 'positive':
        return 'positiveDisabled';
      case 'negative':
        return 'negativeDisabled';
      default:
        return 'uncheckedDisabled';
    }
  }
  if (!isChecked) return 'unchecked';
  switch (color) {
    case 'primary':
      return 'primaryChecked';
    case 'positive':
      return 'positiveChecked';
    case 'negative':
      return 'negativeChecked';
    default:
      return 'unchecked';
  }
}

export function getChipTextColorToken(
  isChecked: boolean,
  color: ChipColor | undefined,
  isDisabled: boolean,
): string {
  if (isDisabled) return 'interactive.text.gray.disabled';
  if (isChecked && color) return `interactive.text.${color}.normal`;
  return 'interactive.text.gray.subtle';
}

export function getChipIconColorToken(
  isChecked: boolean,
  color: ChipColor | undefined,
  isDisabled: boolean,
): string {
  if (isDisabled) return 'interactive.icon.gray.disabled';
  if (isChecked && color) return `interactive.icon.${color}.normal`;
  return 'interactive.icon.gray.subtle';
}

export function getChipTextSizes(): {
  fontSize: Record<ChipSize, 75 | 100 | 200>;
  lineHeight: Record<ChipSize, 75 | 100 | 200>;
  letterSpacing: Record<ChipSize, 25 | 50>;
} {
  return {
    fontSize: { xsmall: 75, small: 100, medium: 200, large: 200 },
    lineHeight: { xsmall: 75, small: 100, medium: 200, large: 200 },
    letterSpacing: { xsmall: 50, small: 50, medium: 25, large: 25 },
  };
}

export function getChipIconSizes(): Record<ChipSize, 'small' | 'medium' | 'large'> {
  return { xsmall: 'small', small: 'small', medium: 'medium', large: 'large' };
}

// ── ChipGroup styles ──

export type ChipGroupVariants = {
  size?: ChipSize;
  labelPosition?: 'top' | 'left';
};

export const chipGroupFieldCva = cva(chipGroupStyles.chipGroupField, {
  variants: {
    labelPosition: {
      top: chipGroupStyles.labelTop,
      left: chipGroupStyles.labelLeft,
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

export const chipGroupGapCva = cva(chipGroupStyles.chipsContainer, {
  variants: {
    size: {
      xsmall: chipGroupStyles.gapXsmall,
      small: chipGroupStyles.gapSmall,
      medium: chipGroupStyles.gapMedium,
      large: chipGroupStyles.gapLarge,
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

export function getChipGroupFieldClasses(props: { labelPosition?: 'top' | 'left' }): string {
  return chipGroupFieldCva(props);
}

export function getChipGroupGapClasses(props: { size?: ChipSize }): string {
  return chipGroupGapCva(props);
}

export function getChipGroupTemplateClasses(): Record<string, string> {
  return {
    chipGroupField: chipGroupStyles.chipGroupField,
    groupLabel: chipGroupStyles.groupLabel,
    labelSmall: chipGroupStyles.labelSmall,
    labelMedium: chipGroupStyles.labelMedium,
    labelLarge: chipGroupStyles.labelLarge,
    necessityRequired: chipGroupStyles.necessityRequired,
    necessityOptional: chipGroupStyles.necessityOptional,
    helpText: chipGroupStyles.helpText,
    errorText: chipGroupStyles.errorText,
    srOnly: chipGroupStyles.srOnly,
  };
}

export function getChipGroupLabelSizeClass(
  size: ChipSize,
): string {
  const map: Record<ChipSize, string> = {
    xsmall: chipGroupStyles.labelSmall,
    small: chipGroupStyles.labelMedium,
    medium: chipGroupStyles.labelLarge,
    large: chipGroupStyles.labelLarge,
  };
  return map[size];
}
