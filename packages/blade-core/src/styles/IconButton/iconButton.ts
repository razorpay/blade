import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './iconButton.module.css';

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
export const iconButtonStyles = cva(styles['icon-button'], {
  variants: {
    emphasis: {
      intense: styles['emphasis-intense'],
      subtle: styles['emphasis-subtle'],
      moderate: styles['emphasis-moderate'],
    },
    size: {
      small: null,
      medium: null,
      large: null,
    },
    isHighlighted: {
      true: styles.highlighted,
      false: null,
    },
  },
  compoundVariants: [
    // Fixed square size when highlighted (small/medium only).
    { isHighlighted: true, size: 'small', class: styles['highlighted-small'] },
    { isHighlighted: true, size: 'medium', class: styles['highlighted-medium'] },
    // Faded hover/focus background when highlighted, per emphasis.
    { isHighlighted: true, emphasis: 'intense', class: styles['highlighted-intense'] },
    { isHighlighted: true, emphasis: 'subtle', class: styles['highlighted-subtle'] },
    // Fixed square size when moderate (small/medium only).
    { emphasis: 'moderate', size: 'small', class: styles['moderate-small'] },
    { emphasis: 'moderate', size: 'medium', class: styles['moderate-medium'] },
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
    iconButton: styles['icon-button'],
    emphasisIntense: styles['emphasis-intense'],
    emphasisSubtle: styles['emphasis-subtle'],
    emphasisModerate: styles['emphasis-moderate'],
    moderateSmall: styles['moderate-small'],
    moderateMedium: styles['moderate-medium'],
    highlighted: styles.highlighted,
    highlightedSmall: styles['highlighted-small'],
    highlightedMedium: styles['highlighted-medium'],
    highlightedIntense: styles['highlighted-intense'],
    highlightedSubtle: styles['highlighted-subtle'],
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
