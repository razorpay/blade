import { cva } from 'class-variance-authority';
import { cn } from '~utils/cx';

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
 * CVA-based badge styles (Tailwind).
 *
 * `color` and `emphasis` are declared as variants with empty strings because the background depends
 * on BOTH together — in CSS Modules this was a chained selector (`.color-neutral.emphasis-subtle`);
 * with no stylesheet to hold it, each combination becomes a `compoundVariants` entry. Heights are
 * arbitrary one-offs (`h-[14px]`) since Badge heights (14/16/20/24) are not spacing tokens. Radius
 * is fully determined by the checkout-scoped shape rules below, so it lives entirely in
 * `compoundVariants` (no base radius to conflict with).
 */
export const badgeStyles = cva(
  'inline-flex items-center justify-center w-fit flex-nowrap bg-transparent',
  {
    variants: {
      size: {
        xsmall: 'h-[14px] px-spacing-2',
        small: 'h-[16px] px-spacing-2',
        medium: 'h-[20px] px-spacing-2',
        large: 'h-[24px] px-spacing-3',
      },
      color: {
        neutral: '',
        positive: '',
        negative: '',
        notice: '',
        information: '',
        primary: '',
      },
      emphasis: {
        subtle: '',
        intense: '',
      },
    },
    compoundVariants: [
      // Background: color × emphasis (was chained `.color-*.emphasis-*` selectors).
      { color: 'neutral', emphasis: 'subtle', class: 'bg-feedback-background-neutral-subtle' },
      { color: 'neutral', emphasis: 'intense', class: 'bg-feedback-background-neutral-intense' },
      { color: 'positive', emphasis: 'subtle', class: 'bg-feedback-background-positive-subtle' },
      { color: 'positive', emphasis: 'intense', class: 'bg-feedback-background-positive-intense' },
      { color: 'negative', emphasis: 'subtle', class: 'bg-feedback-background-negative-subtle' },
      { color: 'negative', emphasis: 'intense', class: 'bg-feedback-background-negative-intense' },
      { color: 'notice', emphasis: 'subtle', class: 'bg-feedback-background-notice-subtle' },
      { color: 'notice', emphasis: 'intense', class: 'bg-feedback-background-notice-intense' },
      {
        color: 'information',
        emphasis: 'subtle',
        class: 'bg-feedback-background-information-subtle',
      },
      {
        color: 'information',
        emphasis: 'intense',
        class: 'bg-feedback-background-information-intense',
      },
      { color: 'primary', emphasis: 'subtle', class: 'bg-surface-background-primary-subtle' },
      { color: 'primary', emphasis: 'intense', class: 'bg-surface-background-primary-intense' },
      // Checkout-scoped shape:
      // subtle → pill (border-radius-max)
      // intense + large → border-radius-small; intense + xsmall/small/medium → border-radius-xsmall
      { emphasis: 'subtle', class: 'rounded-max' },
      { emphasis: 'intense', size: 'large', class: 'rounded-small' },
      { emphasis: 'intense', size: 'xsmall', class: 'rounded-xsmall' },
      { emphasis: 'intense', size: 'small', class: 'rounded-xsmall' },
      { emphasis: 'intense', size: 'medium', class: 'rounded-xsmall' },
    ],
    defaultVariants: {
      size: 'medium',
      color: 'neutral',
      emphasis: 'subtle',
    },
  },
);

// Content and icon wrapper classes for use in component templates (literal so the JIT scanner sees them).
export const badgeContentClass =
  'flex flex-row items-center justify-center overflow-hidden bg-transparent';
export const badgeIconClass = 'flex items-center justify-center shrink-0';

const badgeIconPaddingClasses: Record<BadgeSize, string> = {
  xsmall: 'pr-spacing-1',
  small: 'pr-spacing-1',
  medium: 'pr-spacing-2',
  large: 'pr-spacing-2',
};

/**
 * Get icon padding class based on size
 */
export function getBadgeIconPaddingClass(size: BadgeSize): string {
  return badgeIconPaddingClasses[size];
}

/**
 * Get text margin class based on size (namespaced Tailwind margin utility)
 */
export function getBadgeTextMarginClass(size: BadgeSize): string {
  const marginMap: Record<BadgeSize, string> = {
    xsmall: 'mx-spacing-1',
    small: 'mx-spacing-1',
    medium: 'mx-spacing-2',
    large: 'mx-spacing-2',
  };
  return marginMap[size];
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
    iconPaddingXsmall: 'pr-spacing-1',
    iconPaddingSmall: 'pr-spacing-1',
    iconPaddingMedium: 'pr-spacing-2',
    iconPaddingLarge: 'pr-spacing-2',
    shapePill: 'rounded-max',
    shapeSizeLarge: 'rounded-small',
    shapeSizeDefault: 'rounded-xsmall',
  } as const;
}

/**
 * Generate all classes for Badge component
 * This is the single source of truth for all Badge styling.
 * Routed through `cn` so the checkout shape radius and any `className` override
 * win deterministically over the base (Tailwind utility conflict resolution).
 */
export function getBadgeClasses(props: BadgeVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  return cn(badgeStyles(cvaProps), className);
}
