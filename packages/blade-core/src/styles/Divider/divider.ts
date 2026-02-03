import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './divider.module.css';

export type DividerVariants = {
  orientation?: 'horizontal' | 'vertical';
  dividerStyle?: 'solid' | 'dashed';
  variant?: 'normal' | 'subtle' | 'muted';
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
};

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerStyle = 'solid' | 'dashed';
export type DividerVariant = 'normal' | 'subtle' | 'muted';
export type DividerThickness = 'thinner' | 'thin' | 'thick' | 'thicker';

/**
 * Get border color token based on variant
 */
export function getDividerColorToken({
  variant = 'muted',
}: {
  variant?: DividerVariant;
}): string {
  return `surface.border.gray.${variant}`;
}

/**
 * Get border position based on orientation
 */
export function getDividerBorderPosition(
  orientation: DividerOrientation = 'horizontal',
): 'borderBottom' | 'borderLeft' {
  return orientation === 'horizontal' ? 'borderBottom' : 'borderLeft';
}

/**
 * Generate CVA classes for divider
 */
export const dividerStyles = cva(styles.divider, {
  variants: {
    orientation: {
      horizontal: styles.horizontal,
      vertical: styles.vertical,
    },
    dividerStyle: {
      solid: styles.solid,
      dashed: styles.dashed,
    },
    variant: {
      normal: styles.normal,
      subtle: styles.subtle,
      muted: styles.muted,
    },
    thickness: {
      thinner: styles.thinner,
      thin: styles.thin,
      thick: styles.thick,
      thicker: styles.thicker,
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    dividerStyle: 'solid',
    variant: 'muted',
    thickness: 'thin',
  },
});

/**
 * Get divider classes based on variants
 */
export function getDividerClasses(variants: DividerVariants = {}): string {
  return dividerStyles(variants);
}

/**
 * Get template classes - ensures CSS modules are included in final bundle
 */
export function getDividerTemplateClasses(): Record<string, string> {
  return styles;
}

export const dividerClass = styles.divider;
