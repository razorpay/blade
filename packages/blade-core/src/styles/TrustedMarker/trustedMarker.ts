// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './trustedMarker.module.css';

export type TrustedMarkerVariant = 'neutral' | 'subtle';
export type TrustedMarkerType = 'full' | 'icon';

/**
 * Resolves the text color token for the TrustedMarker label.
 *
 * The shield keeps its fixed brand gradient regardless of variant. Pill styling splits by variant:
 * - `neutral` → 32% black pill + static-white text (dark/colored surfaces)
 * - `subtle`  → 10% black pill + static-black text (light surfaces)
 */
export const getTrustedMarkerTextColorToken = (
  variant: TrustedMarkerVariant,
): 'surface.text.staticWhite.normal' | 'surface.text.staticBlack.normal' => {
  return variant === 'subtle'
    ? 'surface.text.staticBlack.normal'
    : 'surface.text.staticWhite.normal';
};

/** Pill surface class for the given TrustedMarker variant. Pair with `trustedMarkerPill`. */
export const getTrustedMarkerPillVariantClass = (variant: TrustedMarkerVariant): string => {
  return variant === 'subtle' ? styles.trustedMarkerPillSubtle : styles.trustedMarkerPillNeutral;
};

/**
 * Get template classes to prevent Svelte tree-shaking of structural CSS-module classes.
 * Call this in component script blocks that reference these classes.
 */
export function getTrustedMarkerTemplateClasses(): Record<string, string> {
  return {
    trustedMarker: styles.trustedMarker,
    trustedMarkerShield: styles.trustedMarkerShield,
    trustedMarkerShieldOverlap: styles.trustedMarkerShieldOverlap,
    trustedMarkerPill: styles.trustedMarkerPill,
    trustedMarkerPillNeutral: styles.trustedMarkerPillNeutral,
    trustedMarkerPillSubtle: styles.trustedMarkerPillSubtle,
  };
}
