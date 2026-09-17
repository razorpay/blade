import { cva } from 'class-variance-authority';

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

// Base class carries the shared outer border-width + the `blade-chip-animated` hook the plugin's
// sibling focus-ring selector targets. Responsive max-width (420px desktop / 280px mobile) is a
// plain mobile-first + `m:` override — no plugin needed.
const animatedChipBase =
  'blade-chip-animated flex flex-nowrap flex-row items-center justify-center text-left [text-overflow:ellipsis] w-full border-solid bg-transparent transition-transform duration-xquick ease-standard border-thin max-w-[280px] m:max-w-[420px]';

export const animatedChipCva = cva(animatedChipBase, {
  variants: {
    size: {
      xsmall: 'rounded-small',
      small: 'rounded-small',
      medium: 'rounded-small',
      large: 'rounded-medium',
    },
    colorVariant: {
      unchecked: 'border-interactive-border-gray-faded',
      primaryChecked: 'border-interactive-border-primary-default',
      positiveChecked: 'border-interactive-border-positive-default',
      negativeChecked: 'border-interactive-border-negative-default',
      uncheckedDisabled: 'border-interactive-border-gray-disabled',
      primaryDisabled: 'border-interactive-border-primary-disabled',
      positiveDisabled: 'border-interactive-border-positive-disabled',
      negativeDisabled: 'border-interactive-border-negative-disabled',
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

// `disabled` marker (pointer-events-none) is a plain utility, not a class needing its own lookup.
const disabledClass = 'pointer-events-none';

export const chipInnerCva = cva(
  'flex flex-row justify-center items-center overflow-hidden w-full border-solid border-transparent transition-colors duration-xquick ease-standard',
  {
    variants: {
      size: {
        xsmall: 'h-[24px] rounded-[calc(var(--border-radius-small)-var(--border-width-thin))] px-spacing-3 border-thinner',
        small: 'h-[28px] rounded-[calc(var(--border-radius-small)-var(--border-width-thin))] px-spacing-3 border-thinner',
        medium: 'h-[36px] rounded-[calc(var(--border-radius-small)-var(--border-width-thin))] px-spacing-4 border-thin',
        large: 'h-[48px] rounded-[calc(var(--border-radius-medium)-var(--border-width-thin))] px-spacing-5 border-thin',
      },
      colorVariant: {
        unchecked:
          'bg-surface-background-gray-intense border-transparent hover:bg-interactive-background-gray-faded',
        primaryChecked:
          'bg-interactive-background-primary-faded border-interactive-border-primary-default hover:bg-interactive-background-primary-faded-highlighted',
        positiveChecked:
          'bg-interactive-background-positive-faded border-interactive-border-positive-default hover:bg-interactive-background-positive-faded-highlighted',
        negativeChecked:
          'bg-interactive-background-negative-faded border-interactive-border-negative-default hover:bg-interactive-background-negative-faded-highlighted',
        uncheckedDisabled: `bg-transparent border-transparent ${disabledClass}`,
        primaryDisabled: `bg-interactive-background-primary-disabled border-interactive-border-primary-disabled ${disabledClass}`,
        positiveDisabled: `bg-interactive-background-positive-disabled border-interactive-border-positive-disabled ${disabledClass}`,
        negativeDisabled: `bg-interactive-background-negative-disabled border-interactive-border-negative-disabled ${disabledClass}`,
      },
      isDisabled: {
        true: disabledClass,
        false: null,
      },
    },
    defaultVariants: {
      size: 'small',
      colorVariant: 'unchecked',
      isDisabled: false,
    },
  },
);

export function getChipInnerClasses(props: ChipInnerVariants): string {
  return chipInnerCva(props);
}

export function getChipTemplateClasses(): Record<string, string> {
  return {
    chipWrapper: 'inline-flex',
    label: 'cursor-pointer w-full',
    labelDisabled: 'cursor-not-allowed',
    srOnly:
      'absolute w-[1px] h-[1px] p-spacing-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 blade-chip-sr-only',
    animatedChip: animatedChipBase,
    chipInner:
      'flex flex-row justify-center items-center overflow-hidden w-full border-solid border-transparent transition-colors duration-xquick ease-standard',
    pressed: 'scale-[0.92]',
    chipIcon: 'flex',
    chipText: 'px-spacing-2 overflow-hidden text-ellipsis whitespace-nowrap',
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

export const chipGroupFieldCva = cva('flex', {
  variants: {
    labelPosition: {
      top: 'flex-col',
      left: 'flex-row items-start gap-spacing-4',
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

export const chipGroupGapCva = cva('flex flex-row flex-wrap', {
  variants: {
    size: {
      xsmall: 'gap-x-spacing-3 gap-y-spacing-3 mb-spacing-3',
      small: 'gap-x-spacing-3 gap-y-spacing-3 mb-spacing-3',
      medium: 'gap-x-spacing-3 gap-y-spacing-4 mb-spacing-4',
      large: 'gap-x-spacing-3 gap-y-spacing-4 mb-spacing-4',
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
    chipGroupField: 'flex',
    groupLabel: 'font-text font-medium text-surface-text-gray-normal mb-spacing-3',
    labelSmall: 'text-75 leading-75',
    labelMedium: 'text-100 leading-100',
    labelLarge: 'text-200 leading-200',
    necessityRequired: "after:content-['_*'] after:text-feedback-text-negative-intense",
    necessityOptional:
      "after:content-['_(optional)'] after:text-surface-text-gray-muted after:font-regular",
    helpText: 'font-text font-regular text-75 leading-75 text-surface-text-gray-muted',
    errorText: 'font-text font-regular text-75 leading-75 text-feedback-text-negative-intense',
    srOnly:
      'absolute w-[1px] h-[1px] p-spacing-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0',
  };
}

export function getChipGroupLabelSizeClass(size: ChipSize): string {
  const map: Record<ChipSize, string> = {
    xsmall: 'text-75 leading-75',
    small: 'text-100 leading-100',
    medium: 'text-200 leading-200',
    large: 'text-200 leading-200',
  };
  return map[size];
}
