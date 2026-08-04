// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './trustBadge.module.css';

export type TrustBadgeVariant = 'default' | 'icon-only';

/** Label text color token for the TrustBadge pill. */
export const getTrustBadgeTextColorToken = (): 'surface.text.gray.subtle' => {
  return 'surface.text.gray.subtle';
};

/** Variant-specific root class. Pair with `trustBadge`. */
export const getTrustBadgeVariantClass = (variant: TrustBadgeVariant): string => {
  return variant === 'icon-only' ? styles.trustBadgeIconOnly : styles.trustBadgeWithPill;
};

/**
 * Get template classes to prevent Svelte tree-shaking of structural CSS-module classes.
 * Call this in component script blocks that reference these classes.
 */
export function getTrustBadgeTemplateClasses(): Record<string, string> {
  return {
    trustBadge: styles.trustBadge,
    trustBadgeWithPill: styles.trustBadgeWithPill,
    trustBadgeIconOnly: styles.trustBadgeIconOnly,
    trustBadgeIcon: styles.trustBadgeIcon,
  };
}
