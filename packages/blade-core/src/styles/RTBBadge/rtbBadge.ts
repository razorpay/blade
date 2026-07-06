// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './rtbBadge.module.css';

export type RTBBadgeVariant = 'neutral' | 'subtle';
export type RTBBadgeType = 'full' | 'icon';

/**
 * Resolves the text color token for the RTBBadge label.
 *
 * The shield keeps its fixed brand gradient regardless of variant. Pill styling splits by variant:
 * - `neutral` → 32% black pill + static-white text (dark/colored surfaces)
 * - `subtle`  → 10% black pill + static-black text (light surfaces)
 */
export const getRTBBadgeTextColorToken = (
  variant: RTBBadgeVariant,
): 'surface.text.staticWhite.normal' | 'surface.text.staticBlack.normal' => {
  return variant === 'subtle'
    ? 'surface.text.staticBlack.normal'
    : 'surface.text.staticWhite.normal';
};

/** Pill surface class for the given RTBBadge variant. Pair with `rtbBadgePill`. */
export const getRTBBadgePillVariantClass = (variant: RTBBadgeVariant): string => {
  return variant === 'subtle' ? styles.rtbBadgePillSubtle : styles.rtbBadgePillNeutral;
};

/**
 * Get template classes to prevent Svelte tree-shaking of structural CSS-module classes.
 * Call this in component script blocks that reference these classes.
 */
export function getRTBBadgeTemplateClasses(): Record<string, string> {
  return {
    rtbBadge: styles.rtbBadge,
    rtbBadgeShield: styles.rtbBadgeShield,
    rtbBadgeShieldOverlap: styles.rtbBadgeShieldOverlap,
    rtbBadgePill: styles.rtbBadgePill,
    rtbBadgePillNeutral: styles.rtbBadgePillNeutral,
    rtbBadgePillSubtle: styles.rtbBadgePillSubtle,
  };
}
