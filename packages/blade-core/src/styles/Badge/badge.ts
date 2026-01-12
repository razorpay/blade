import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './badge.module.css';

export type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';
export type BadgeColor = 'neutral' | 'information' | 'negative' | 'notice' | 'positive' | 'primary';
export type BadgeEmphasis = 'subtle' | 'intense';

export type BadgeVariants = {
  size?: BadgeSize;
  color?: BadgeColor;
  emphasis?: BadgeEmphasis;
  hasIcon?: boolean;
};

type ColorProps = {
  iconColor: string;
  textColor: string;
  backgroundColor: string;
};

/**
 * Get color props for Badge based on color and emphasis
 * Returns the color token paths for text, icon, and background
 */
export function getBadgeColorProps({
  color,
  emphasis,
}: {
  color: BadgeColor;
  emphasis: BadgeEmphasis;
}): ColorProps {
  const props: ColorProps = {
    iconColor: 'feedback.icon.neutral.intense',
    textColor: 'feedback.text.neutral.intense',
    backgroundColor: 'feedback.background.neutral.subtle',
  };

  if (color === 'primary') {
    // primary color badge
    props.textColor =
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.primary.normal';
    props.iconColor =
      emphasis === 'intense' ? 'surface.icon.staticWhite.normal' : 'surface.icon.primary.normal';
    props.backgroundColor = `surface.background.primary.${emphasis}`;
  } else {
    // feedback colors badge
    props.textColor =
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : `feedback.text.${color}.intense`;
    props.iconColor =
      emphasis === 'intense' ? 'surface.icon.staticWhite.normal' : `feedback.icon.${color}.intense`;
    props.backgroundColor = `feedback.background.${color}.${emphasis}`;
  }

  return props;
}

/**
 * Get text size for Badge based on badge size
 * Returns variant and size for Text component
 */
export function getBadgeTextSize(size: BadgeSize): {
  variant: 'body';
  size: 'xsmall' | 'small';
} {
  const badgeTextSizes = {
    xsmall: { variant: 'body' as const, size: 'xsmall' as const },
    small: { variant: 'body' as const, size: 'xsmall' as const },
    medium: { variant: 'body' as const, size: 'small' as const },
    large: { variant: 'body' as const, size: 'small' as const },
  };

  return badgeTextSizes[size];
}

/**
 * Get icon size for Badge based on badge size
 */
export function getBadgeIconSize(size: BadgeSize): 'xsmall' | 'small' {
  const iconSizes = {
    xsmall: 'xsmall' as const,
    small: 'xsmall' as const,
    medium: 'small' as const,
    large: 'small' as const,
  };

  return iconSizes[size];
}

/**
 * CVA configuration for Badge component
 * Handles size, color, emphasis variants and icon gap compound variants
 */
export const badgeStyles = cva(styles.badge, {
  variants: {
    size: {
      xsmall: styles.xsmall,
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    color: {
      neutral: styles['color-neutral'],
      information: styles['color-information'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      positive: styles['color-positive'],
      primary: styles['color-primary'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
    hasIcon: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Icon gap variants - only apply when hasIcon is true
    { size: 'xsmall', hasIcon: true, class: styles['icon-gap-xsmall'] },
    { size: 'small', hasIcon: true, class: styles['icon-gap-small'] },
    { size: 'medium', hasIcon: true, class: styles['icon-gap-medium'] },
    { size: 'large', hasIcon: true, class: styles['icon-gap-large'] },
  ],
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
    hasIcon: false,
  },
});

// Export content and icon classes for use in component templates
export const badgeContentClass = styles.content;
export const badgeIconClass = styles.icon;

/**
 * Get all Badge component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getBadgeTemplateClasses(): Record<string, string> {
  return {
    content: badgeContentClass,
    icon: badgeIconClass,
  } as const;
}
