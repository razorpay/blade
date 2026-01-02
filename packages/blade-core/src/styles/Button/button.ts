import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './button.module.css';

export type ButtonVariants = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'transparent';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isIconOnly?: boolean;
};

export type ButtonColor = 'primary' | 'white' | 'positive' | 'negative' | 'transparent';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type ActionStatesType = 'default' | 'hover' | 'focus' | 'disabled';

/**
 * Get background color token based on variant, color, and state
 * This generates the color token string that BaseText CVA uses for colors
 */
export function getButtonBackgroundColorToken({
  variant,
  color,
  state,
  property,
}: {
  variant: ButtonVariant;
  color: ButtonColor;
  state: ActionStatesType;
  property: 'background' | 'border';
}): string {
  const _state = state === 'focus' || state === 'hover' ? 'highlighted' : state;
  const isBorder = property === 'border';

  if (color === 'white') {
    if (variant === 'primary') {
      return `interactive.${property}.staticWhite.${_state}`;
    }
    if (variant === 'secondary') {
      return isBorder
        ? 'interactive.border.staticWhite.highlighted'
        : _state === 'default'
        ? 'transparent'
        : 'interactive.background.staticWhite.faded';
    }
    if (variant === 'tertiary') {
      return `interactive.background.staticWhite.faded${
        _state === 'highlighted' ? 'Highlighted' : ''
      }`;
    }
  }

  if (color === 'transparent') {
    if (variant !== 'tertiary') {
      throw new Error(
        `Transparent color can only be used with tertiary variant but received "${variant}"`,
      );
    }
    return _state === 'default' ? 'transparent' : `interactive.${property}.gray.faded`;
  }

  if (color && color !== 'primary') {
    if (variant === 'tertiary') {
      throw new Error(
        `Tertiary variant can only be used with color: "primary" or "white" or "transparent" but received "${color}"`,
      );
    }
    if (variant === 'primary') {
      return `interactive.${property}.${color}.${_state}`;
    }
    if (variant === 'secondary') {
      return isBorder
        ? `interactive.border.${color}.default`
        : _state === 'default'
        ? `interactive.background.${color}.faded`
        : `interactive.background.${color}.fadedHighlighted`;
    }
  }

  // Base primary color
  if (variant === 'primary') {
    return `interactive.${property}.primary.${_state}`;
  }
  if (variant === 'secondary') {
    return isBorder
      ? 'interactive.border.primary.default'
      : _state === 'default'
      ? 'transparent'
      : 'interactive.background.primary.faded';
  }
  if (variant === 'tertiary') {
    return `interactive.${property}.gray.${_state}`;
  }

  return `interactive.${property}.primary.${_state}`;
}

/**
 * Get text/icon color token based on variant, color, and state
 */
export function getButtonTextColorToken({
  variant,
  color,
  state,
  property,
}: {
  variant: ButtonVariant;
  color: ButtonColor;
  state: ActionStatesType;
  property: 'icon' | 'text';
}): string {
  // Map state to color variant suffix
  const stateSuffix = state === 'disabled' ? 'disabled' : 'normal';

  if (color === 'white') {
    if (variant === 'primary') {
      return `interactive.${property}.staticBlack.${state === 'disabled' ? 'disabled' : 'muted'}`;
    }
    if (variant === 'secondary') {
      return `interactive.${property}.staticWhite.${stateSuffix}`;
    }
    if (variant === 'tertiary') {
      return `interactive.${property}.staticWhite.${stateSuffix}`;
    }
  }

  if (color === 'transparent') {
    if (variant !== 'tertiary') {
      throw new Error(
        `Transparent color can only be used with tertiary variant but received "${variant}"`,
      );
    }
    if (state === 'disabled') {
      return `interactive.${property}.gray.disabled`;
    }
    return property === 'icon' ? 'interactive.icon.gray.muted' : 'surface.text.gray.normal';
  }

  if (color && color !== 'primary') {
    if (variant === 'tertiary') {
      throw new Error(
        `Tertiary variant can only be used with color: "primary" or "white" or "transparent" but received "${color}"`,
      );
    }
    if (variant === 'primary') {
      // For disabled state, use color-specific disabled token (e.g., interactive.text.negative.disabled)
      // For normal state, use staticWhite for contrast on colored background
      if (state === 'disabled') {
        return `interactive.${property}.${color}.disabled`;
      }
      return `interactive.${property}.staticWhite.normal`;
    }
    if (variant === 'secondary') {
      return `interactive.${property}.${color}.${stateSuffix}`;
    }
  }

  // Base primary color
  if (variant === 'primary') {
    // For disabled state, use primary.disabled instead of onPrimary.disabled
    if (state === 'disabled') {
      return `interactive.${property}.primary.disabled`;
    }
    return `interactive.${property}.onPrimary.normal`;
  }
  if (variant === 'secondary') {
    return `interactive.${property}.primary.${state === 'disabled' ? 'disabled' : 'subtle'}`;
  }
  if (variant === 'tertiary') {
    return `interactive.${property}.gray.${stateSuffix}`;
  }

  return `interactive.${property}.onPrimary.${stateSuffix}`;
}

/**
 * Get typography size mapping for buttons
 * These values correspond to BaseText utility classes
 */
export function getButtonTextSizes(): {
  fontSize: Record<'xsmall' | 'small' | 'medium' | 'large', 75 | 100 | 200>;
  lineHeight: Record<'xsmall' | 'small' | 'medium' | 'large', 75 | 100 | 200>;
} {
  return {
    fontSize: {
      xsmall: 75,
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      xsmall: 75,
      small: 75,
      medium: 100,
      large: 200,
    },
  };
}

/**
 * Get min height for buttons
 */
export function getButtonMinHeight(): Record<'xsmall' | 'small' | 'medium' | 'large', number> {
  return {
    xsmall: 28,
    small: 32,
    medium: 36,
    large: 48,
  };
}

/**
 * Get icon size mapping for buttons
 */
export function getButtonIconSize(): Record<'xsmall' | 'small' | 'medium' | 'large', 'small' | 'medium'> {
  return {
    xsmall: 'small',
    small: 'small',
    medium: 'medium',
    large: 'medium',
  } as const;
}

/**
 * Get icon-only size mapping
 */
export function getButtonIconOnlySize(): Record<'xsmall' | 'small' | 'medium' | 'large', 'medium'> {
  return {
    xsmall: 'medium',
    small: 'medium',
    medium: 'medium',
    large: 'medium',
  } as const;
}

/**
 * Get spinner size mapping for buttons
 * Maps button sizes to appropriate spinner sizes
 */
export function getButtonSpinnerSize(): Record<
  'xsmall' | 'small' | 'medium' | 'large',
  'medium' | 'large' | 'xlarge'
> {
  return {
    xsmall: 'medium',
    small: 'large',
    medium: 'large',
    large: 'xlarge',
  } as const;
}

export const buttonStyles = cva(styles.btn, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      tertiary: styles.tertiary,
    },
    color: {
      primary: styles['color-primary'],
      white: styles['color-white'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      transparent: styles['color-transparent'],
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
    isFullWidth: {
      true: utilityClasses['width-full'],
      false: '',
    },
    isIconOnly: {
      true: styles['icon-only'],
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    color: 'primary',
    size: 'medium',
    isDisabled: false,
    isFullWidth: false,
    isIconOnly: false,
  },
});

// Export content and icon classes for use in component templates
export const buttonContentClass = styles.content;
export const buttonIconClass = styles.icon;
export const loadingSpinnerClass = styles['loading-spinner'];
export const loadingClass = styles.loading;
export const animatedContentClass = styles['animated-content'];
export const pressedClass = styles.pressed;

/**
 * Get all Button component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 *
 * @example
 * const buttonClasses = getButtonTemplateClasses();
 * // Use: buttonClasses.content, buttonClasses.icon, etc.
 */
export function getButtonTemplateClasses() {
  return {
    content: buttonContentClass,
    icon: buttonIconClass,
    loadingSpinner: loadingSpinnerClass,
    loading: loadingClass,
    animatedContent: animatedContentClass,
    pressed: pressedClass,
  } as const;
}

/**
 * Generate all classes for Button component
 * This is the single source of truth for all Button styling
 * Everything is class-based - no data attributes or inline styles
 */
export function getButtonClasses(props: ButtonVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  const classes = [buttonStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
