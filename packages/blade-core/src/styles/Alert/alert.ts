import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './alert.module.css';

export type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type SubtleOrIntense = 'subtle' | 'intense';

export type AlertVariants = {
  color?: FeedbackColors;
  emphasis?: SubtleOrIntense;
  isFullWidth?: boolean;
  isFullWidthDesktop?: boolean;
};

/**
 * Get text color token for Alert based on emphasis
 * Returns the color token path for Text component
 */
export function getAlertTextColor(emphasis: SubtleOrIntense): string {
  return emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.subtle';
}

/**
 * Get icon color token for Alert based on color and emphasis
 * Returns the color token path for icon
 */
export function getAlertIconColor({
  color,
  emphasis,
}: {
  color: FeedbackColors;
  emphasis: SubtleOrIntense;
}): string {
  if (emphasis === 'intense') {
    return 'surface.icon.staticWhite.normal';
  }
  // For subtle emphasis, use feedback colors with opposite intensity
  return `feedback.icon.${color}.intense`;
}

/**
 * Get icon offset for alignment based on layout configuration
 * Returns spacing token for icon top margin
 */
export function getAlertIconOffset({
  isFullWidth,
  hasTitle,
  isMobile,
}: {
  isFullWidth: boolean;
  hasTitle: boolean;
  isMobile: boolean;
}): 'spacing.0' | 'spacing.1' | 'spacing.2' {
  // Mobile specific offsets
  if (isMobile) {
    if (!isFullWidth && hasTitle) {
      return 'spacing.2';
    }
    if (isFullWidth && !hasTitle) {
      return 'spacing.2';
    }
  }
  
  // Desktop offsets
  if (isFullWidth) {
    return 'spacing.1';
  }
  
  // Default offset
  return 'spacing.1';
}

/**
 * Determine ARIA role based on alert color/severity
 * Returns 'alert' for high severity colors, 'status' for others
 */
export function getAlertAccessibilityRole(color: FeedbackColors): 'alert' | 'status' {
  // High severity colors should use 'alert' role
  if (color === 'negative' || color === 'notice') {
    return 'alert';
  }
  // Other colors use 'status' role
  return 'status';
}

/**
 * Get aria-live value based on color
 */
export function getAlertAriaLive(color: FeedbackColors): 'polite' | 'assertive' | undefined {
  // Notice intent should be polite
  if (color === 'notice') {
    return 'polite';
  }
  return undefined;
}

/**
 * CVA configuration for Alert component
 * Handles color, emphasis, and width variants with compound variants for backgrounds
 */
export const alertStyles = cva(styles.alert, {
  variants: {
    color: {
      neutral: '',
      information: '',
      positive: '',
      negative: '',
      notice: '',
    },
    emphasis: {
      subtle: '',
      intense: '',
    },
    isFullWidth: {
      true: styles['full-width'],
      false: styles.constrained,
    },
    isFullWidthDesktop: {
      true: styles['full-width-desktop'],
      false: '',
    },
  },
  compoundVariants: [
    // Color + emphasis combinations for backgrounds
    { color: 'neutral', emphasis: 'subtle', class: styles['bg-neutral-subtle'] },
    { color: 'neutral', emphasis: 'intense', class: styles['bg-neutral-intense'] },
    { color: 'information', emphasis: 'subtle', class: styles['bg-information-subtle'] },
    { color: 'information', emphasis: 'intense', class: styles['bg-information-intense'] },
    { color: 'positive', emphasis: 'subtle', class: styles['bg-positive-subtle'] },
    { color: 'positive', emphasis: 'intense', class: styles['bg-positive-intense'] },
    { color: 'negative', emphasis: 'subtle', class: styles['bg-negative-subtle'] },
    { color: 'negative', emphasis: 'intense', class: styles['bg-negative-intense'] },
    { color: 'notice', emphasis: 'subtle', class: styles['bg-notice-subtle'] },
    { color: 'notice', emphasis: 'intense', class: styles['bg-notice-intense'] },
  ],
  defaultVariants: {
    color: 'neutral',
    emphasis: 'subtle',
    isFullWidth: false,
    isFullWidthDesktop: false,
  },
});

// Export template classes for use in component
export const alertIconContainerClass = styles['icon-container'];
export const alertIconContainerCenteredClass = styles['icon-container-centered'];
export const alertContentClass = styles.content;
export const alertTitleClass = styles.title;
export const alertDescriptionClass = styles.description;
export const alertDescriptionNoOffsetClass = styles['description-no-offset'];
export const alertActionsVerticalClass = styles['actions-vertical'];
export const alertActionsHorizontalClass = styles['actions-horizontal'];
export const alertPrimaryActionClass = styles['primary-action'];
export const alertSecondaryActionClass = styles['secondary-action'];
export const alertCloseButtonClass = styles['close-button'];
export const alertContentPaddingLeftSmallClass = styles['content-padding-left-small'];
export const alertContentPaddingLeftLargeClass = styles['content-padding-left-large'];
export const alertContentPaddingRightSmallClass = styles['content-padding-right-small'];
export const alertContentPaddingRightLargeClass = styles['content-padding-right-large'];
export const alertIconOffset0Class = styles['icon-offset-0'];
export const alertIconOffset1Class = styles['icon-offset-1'];
export const alertIconOffset2Class = styles['icon-offset-2'];

/**
 * Get all Alert component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAlertTemplateClasses(): Record<string, string> {
  return {
    iconContainer: alertIconContainerClass,
    iconContainerCentered: alertIconContainerCenteredClass,
    content: alertContentClass,
    title: alertTitleClass,
    description: alertDescriptionClass,
    descriptionNoOffset: alertDescriptionNoOffsetClass,
    actionsVertical: alertActionsVerticalClass,
    actionsHorizontal: alertActionsHorizontalClass,
    primaryAction: alertPrimaryActionClass,
    secondaryAction: alertSecondaryActionClass,
    closeButton: alertCloseButtonClass,
    contentPaddingLeftSmall: alertContentPaddingLeftSmallClass,
    contentPaddingLeftLarge: alertContentPaddingLeftLargeClass,
    contentPaddingRightSmall: alertContentPaddingRightSmallClass,
    contentPaddingRightLarge: alertContentPaddingRightLargeClass,
    iconOffset0: alertIconOffset0Class,
    iconOffset1: alertIconOffset1Class,
    iconOffset2: alertIconOffset2Class,
  } as const;
}
