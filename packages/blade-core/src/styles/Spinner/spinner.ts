import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './spinner.module.css';
// import { utilityClasses } from '../utilities';

export type SpinnerVariants = {
  size?: 'medium' | 'large' | 'xlarge';
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'neutral';
};

export type SpinnerSize = 'medium' | 'large' | 'xlarge';
export type SpinnerColor = 'primary' | 'white' | 'positive' | 'negative' | 'neutral';

export const spinnerStyles = cva(styles.spinner, {
  variants: {
    size: {
      medium: styles['size-medium'],
      large: styles['size-large'],
      xlarge: styles['size-xlarge'],
    },
    color: {
      primary: styles['color-primary'],
      white: styles['color-white'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      neutral: styles['color-neutral'],
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
  },
});

// Export class names for use in component templates
export const spinnerClass = styles.spinner;
export const spinnerBoxClass = styles['spinner-box'];
export const spinnerIconClass = styles['spinner-icon'];

/**
 * Generate all classes for Spinner component
 * This is the single source of truth for all Spinner styling
 * Everything is class-based - no data attributes or inline styles
 */
export function getSpinnerClasses(props: SpinnerVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  const classes = [spinnerStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
