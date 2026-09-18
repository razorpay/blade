export type TrustBadgeVariant = 'default' | 'icon-only';

// Literal Tailwind class strings (were `trustBadge.module.css`). Kept as named consts so the
// JIT scanner sees them and Svelte tree-shaking can't drop template-only references.
const trustBadgeClass = 'inline-flex flex-row items-center shrink-0';
const trustBadgeWithPillClass =
  'gap-spacing-2 h-[24px] px-spacing-3 py-spacing-2 rounded-max bg-surface-background-sea-subtle';
const trustBadgeIconOnlyClass = 'p-spacing-2';
const trustBadgeIconClass = 'flex items-center shrink-0';

/** Label text color token for the TrustBadge pill. */
export const getTrustBadgeTextColorToken = (): 'surface.text.gray.subtle' => {
  return 'surface.text.gray.subtle';
};

/** Variant-specific root class. Pair with `trustBadge`. */
export const getTrustBadgeVariantClass = (variant: TrustBadgeVariant): string => {
  return variant === 'icon-only' ? trustBadgeIconOnlyClass : trustBadgeWithPillClass;
};

/**
 * Get template classes to prevent Svelte tree-shaking of structural class references.
 * Call this in component script blocks that reference these classes.
 */
export function getTrustBadgeTemplateClasses(): Record<string, string> {
  return {
    trustBadge: trustBadgeClass,
    trustBadgeWithPill: trustBadgeWithPillClass,
    trustBadgeIconOnly: trustBadgeIconOnlyClass,
    trustBadgeIcon: trustBadgeIconClass,
  };
}
