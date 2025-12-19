import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './baseLink.module.css';

export type BaseLinkVariants = {
  variant?: 'anchor' | 'button';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
};

// Color and interaction types for color token generation
export type LinkColor =
  | 'primary'
  | 'white'
  | 'positive'
  | 'negative'
  | 'notice'
  | 'information'
  | 'neutral';

export type LinkVariant = 'anchor' | 'button';

export type ActionStatesType = 'default' | 'hover' | 'focus' | 'disabled';
export type ColorType = 'normal' | 'subtle' | 'disabled';

/**
 * Get color token based on state, variant, color, and element type
 * This generates the color token string that BaseText CVA uses for colors
 */
export function getLinkColorToken({
  variant,
  color,
  currentInteraction,
  isDisabled,
  element,
}: {
  variant: LinkVariant;
  color: LinkColor;
  currentInteraction: ActionStatesType;
  isDisabled: boolean;
  element: 'icon' | 'text';
}): string {
  let state = currentInteraction;
  const map: Record<ActionStatesType, ColorType> = {
    default: 'normal',
    hover: 'subtle',
    focus: 'normal',
    disabled: 'disabled',
  };

  const stateKey = map[state];

  if (isDisabled && variant === 'button') {
    state = 'disabled';
  }

  if (color && color !== 'primary') {
    if (color !== 'white') {
      return `interactive.${element}.${color}.${stateKey}`;
    }
    return `interactive.${element}.staticWhite.${stateKey}`;
  }
  return `interactive.${element}.primary.${stateKey}`;
}

/**
 * Get text size mapping for fontSize and lineHeight
 * These values correspond to BaseText utility classes (font-size-25, font-size-75, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 */
export function getLinkTextSizes() {
  return {
    fontSize: {
      xsmall: 25,
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      xsmall: 25,
      small: 75,
      medium: 100,
      large: 200,
    },
  };
}

export const baseLinkStyles = cva(styles.base, {
  variants: {
    variant: {
      anchor: styles.anchor,
      button: styles.button,
    },
    size: {
      xsmall: styles.xsmall,
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    isDisabled: {
      true: utilityClasses['cursor-not-allowed'],
      false: utilityClasses['cursor-pointer'],
    },
  },
  defaultVariants: {
    variant: 'anchor',
    size: 'medium',
    isDisabled: false,
  },
});

// Export content and icon classes for use in component templates
export const baseLinkContentClass = styles.content;
export const baseLinkIconClass = styles.icon;

/**
 * Generate all classes for BaseLink component
 * This is the single source of truth for all BaseLink styling
 * Everything is class-based - no data attributes or inline styles
 */
export function getBaseLinkClasses(props: BaseLinkVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  const classes = [baseLinkStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
