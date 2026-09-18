import { cva } from 'class-variance-authority';

export type IconButtonEmphasis = 'subtle' | 'intense' | 'moderate';
export type IconButtonSize = 'small' | 'medium' | 'large';

export type IconButtonVariants = {
  emphasis?: IconButtonEmphasis;
  size?: IconButtonSize;
  isHighlighted?: boolean;
};

/**
 * Fixed square dimensions (px) applied to the button when `isHighlighted` is true.
 * `large` is intentionally absent — it is an invalid combination with `isHighlighted`.
 */
export const highlightedButtonSizeMap: Record<'small' | 'medium', number> = {
  small: 24,
  medium: 32,
};

/**
 * CVA-based IconButton styles.
 *
 * `size` carries no class on its own (the non-highlighted button is intrinsically
 * sized); it exists so the compound variants can pin a fixed square size when
 * `isHighlighted` is true.
 */
export const iconButtonStyles = cva('blade-icon-button', {
  variants: {
    emphasis: {
      intense: 'blade-icon-button-emphasis-intense',
      subtle: 'blade-icon-button-emphasis-subtle',
      moderate: 'blade-icon-button-emphasis-moderate',
    },
    size: {
      small: null,
      medium: null,
      large: null,
    },
    isHighlighted: {
      true: 'blade-icon-button-highlighted',
      false: null,
    },
  },
  compoundVariants: [
    // Fixed square size when highlighted (small/medium only).
    { isHighlighted: true, size: 'small', class: 'blade-icon-button-highlighted-small' },
    { isHighlighted: true, size: 'medium', class: 'blade-icon-button-highlighted-medium' },
    // Faded hover/focus background when highlighted, per emphasis.
    { isHighlighted: true, emphasis: 'intense', class: 'blade-icon-button-highlighted-intense' },
    { isHighlighted: true, emphasis: 'subtle', class: 'blade-icon-button-highlighted-subtle' },
    // Fixed square size when moderate (small/medium only).
    { emphasis: 'moderate', size: 'small', class: 'blade-icon-button-moderate-small' },
    { emphasis: 'moderate', size: 'medium', class: 'blade-icon-button-moderate-medium' },
  ],
  defaultVariants: {
    emphasis: 'intense',
    size: 'medium',
    isHighlighted: false,
  },
});

/**
 * Get all IconButton component template classes as an object.
 * Call this in Svelte components to prevent tree-shaking from removing class
 * imports that are only referenced through the CVA config.
 */
export function getIconButtonTemplateClasses(): Record<string, string> {
  return {
    iconButton: 'blade-icon-button',
    emphasisIntense: 'blade-icon-button-emphasis-intense',
    emphasisSubtle: 'blade-icon-button-emphasis-subtle',
    emphasisModerate: 'blade-icon-button-emphasis-moderate',
    moderateSmall: 'blade-icon-button-moderate-small',
    moderateMedium: 'blade-icon-button-moderate-medium',
    highlighted: 'blade-icon-button-highlighted',
    highlightedSmall: 'blade-icon-button-highlighted-small',
    highlightedMedium: 'blade-icon-button-highlighted-medium',
    highlightedIntense: 'blade-icon-button-highlighted-intense',
    highlightedSubtle: 'blade-icon-button-highlighted-subtle',
  } as const;
}

/**
 * Generate all classes for the IconButton element.
 * Single source of truth for IconButton styling — everything is class-based.
 */
export function getIconButtonClasses(props: IconButtonVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  return [iconButtonStyles(cvaProps), className].filter(Boolean).join(' ');
}
