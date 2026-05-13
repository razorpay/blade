import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './badge.module.css';

export type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';
export type BadgeColor = 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';
export type BadgeEmphasis = 'subtle' | 'intense';

export type BadgeVariants = {
  size?: BadgeSize;
  color?: BadgeColor;
  emphasis?: BadgeEmphasis;
};

/**
 * Badge height tokens mapped to size
 */
export const badgeHeight: Record<BadgeSize, number> = {
  xsmall: 14,
  small: 16,
  medium: 20,
  large: 24,
};

/**
 * Badge horizontal padding tokens mapped to size
 */
export const badgeHorizontalPadding: Record<BadgeSize, string> = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
};

/**
 * Badge text horizontal margin tokens mapped to size
 * Applied as marginX on the text element for spacing between icon and text edges
 */
export const badgeTextHorizontalMargin: Record<BadgeSize, string> = {
  xsmall: 'spacing.1',
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

/**
 * Badge icon padding tokens mapped to size
 */
export const badgeIconPadding: Record<BadgeSize, string> = {
  xsmall: 'spacing.1',
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

/**
 * Badge icon size mapped to badge size
 */
export const badgeIconSize: Record<BadgeSize, 'xsmall' | 'small'> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'small',
};

/**
 * Badge text size mapping
 * Returns fontSize and lineHeight values for BaseText
 * Maps to React's Text component: variant='body' with size='xsmall'|'small'
 * - body xsmall: fontSize 25, lineHeight 25
 * - body small: fontSize 75, lineHeight 75
 */
export const badgeTextSizes: Record<BadgeSize, { fontSize: 25 | 75; lineHeight: 25 | 75 }> = {
  xsmall: { fontSize: 25, lineHeight: 25 },
  small: { fontSize: 25, lineHeight: 25 },
  medium: { fontSize: 75, lineHeight: 75 },
  large: { fontSize: 75, lineHeight: 75 },
};

/**
 * Get text color token based on color and emphasis
 */
export function getBadgeTextColorToken({
  color,
  emphasis,
}: {
  color: BadgeColor;
  emphasis: BadgeEmphasis;
}): string {
  if (color === 'primary') {
    return emphasis === 'intense'
      ? 'surface.text.staticWhite.normal'
      : 'surface.text.primary.normal';
  }

  // Feedback colors
  return emphasis === 'intense'
    ? 'surface.text.staticWhite.normal'
    : `feedback.text.${color}.intense`;
}

/**
 * Get icon color token based on color and emphasis
 */
export function getBadgeIconColorToken({
  color,
  emphasis,
}: {
  color: BadgeColor;
  emphasis: BadgeEmphasis;
}): string {
  if (color === 'primary') {
    return emphasis === 'intense'
      ? 'surface.icon.staticWhite.normal'
      : 'surface.icon.primary.normal';
  }

  // Feedback colors
  return emphasis === 'intense'
    ? 'surface.icon.staticWhite.normal'
    : `feedback.icon.${color}.intense`;
}

/**
 * CVA-based badge styles
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
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      information: styles['color-information'],
      primary: styles['color-primary'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
  },
});

// Export content and icon classes for use in component templates
export const badgeContentClass = styles.content;
export const badgeIconClass = styles.icon;

/**
 * Get icon padding class based on size
 */
export function getBadgeIconPaddingClass(size: BadgeSize): string {
  return styles[`icon-padding-${size}`];
}

/**
 * Get text margin class based on size, using utility classes
 */
export function getBadgeTextMarginClass(size: BadgeSize): string {
  const marginMap: Record<BadgeSize, string> = {
    xsmall: 'margin-x-spacing-1',
    small: 'margin-x-spacing-1',
    medium: 'margin-x-spacing-2',
    large: 'margin-x-spacing-2',
  };
  return utilityClasses[marginMap[size] as keyof typeof utilityClasses];
}

/**
 * Get all Badge component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getBadgeTemplateClasses(): Record<string, string> {
  return {
    content: badgeContentClass,
    icon: badgeIconClass,
    iconPaddingXsmall: styles['icon-padding-xsmall'],
    iconPaddingSmall: styles['icon-padding-small'],
    iconPaddingMedium: styles['icon-padding-medium'],
    iconPaddingLarge: styles['icon-padding-large'],
  } as const;
}

/**
 * Generate all classes for Badge component
 * This is the single source of truth for all Badge styling
 */
export function getBadgeClasses(props: BadgeVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  const classes = [badgeStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
