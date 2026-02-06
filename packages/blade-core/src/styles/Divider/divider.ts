import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './divider.module.css';

export type DividerVariants = {
  orientation?: 'horizontal' | 'vertical';
  dividerStyle?: 'solid' | 'dashed';
  variant?: 'normal' | 'subtle' | 'muted';
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
};

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
 * Generate all classes for Divider component
 */
export function getDividerClasses(props: DividerVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;
  const classes = [dividerStyles(cvaProps), className].filter(Boolean).join(' ');
  return classes;
}
