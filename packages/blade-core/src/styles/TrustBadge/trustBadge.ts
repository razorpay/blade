// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './trustBadge.module.css';

export type TrustBadgeVariant = 'default' | 'icon-only';
export type TrustBadgeEmphasis = 'subtle' | 'intense';

/**
 * Resolves the text color token for the TrustBadge label.
 *
 * The shield keeps its fixed brand gradient regardless of emphasis. Pill styling splits by emphasis:
 * - `intense` → 32% black pill + static-white text (dark/colored surfaces)
 * - `subtle`  → 10% black pill + static-black text (light surfaces)
 */
export const getTrustBadgeTextColorToken = (
  emphasis: TrustBadgeEmphasis,
): 'surface.text.staticWhite.normal' | 'surface.text.staticBlack.normal' => {
  return emphasis === 'subtle'
    ? 'surface.text.staticBlack.normal'
    : 'surface.text.staticWhite.normal';
};

/** Pill surface class for the given TrustBadge emphasis. Pair with `trustBadgePill`. */
export const getTrustBadgePillEmphasisClass = (emphasis: TrustBadgeEmphasis): string => {
  return emphasis === 'subtle' ? styles.trustBadgePillSubtle : styles.trustBadgePillIntense;
};

/**
 * Get template classes to prevent Svelte tree-shaking of structural CSS-module classes.
 * Call this in component script blocks that reference these classes.
 */
export function getTrustBadgeTemplateClasses(): Record<string, string> {
  return {
    trustBadge: styles.trustBadge,
    trustBadgeShield: styles.trustBadgeShield,
    trustBadgeShieldOverlap: styles.trustBadgeShieldOverlap,
    trustBadgePill: styles.trustBadgePill,
    trustBadgePillIntense: styles.trustBadgePillIntense,
    trustBadgePillSubtle: styles.trustBadgePillSubtle,
  };
}
