import { cva } from 'class-variance-authority';

export type SpinnerVariants = {
  size?: 'medium' | 'large' | 'xlarge';
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'neutral';
};

export type SpinnerSize = 'medium' | 'large' | 'xlarge';
export type SpinnerColor = 'primary' | 'white' | 'positive' | 'negative' | 'neutral';

/**
 * CVA-based Spinner styles (Tailwind). Color is applied to the root as a `text-*` utility; the SVG
 * icon inherits it via `fill=currentColor` (was a nested `.color-* .spinner-icon` rule). The
 * rotating box (`.blade-spinner-box`) + its `@keyframes` live in the plugin.
 */
export const spinnerStyles = cva('inline-flex items-center justify-center', {
  variants: {
    size: {
      medium: 'w-[16px] h-[16px]',
      large: 'w-[20px] h-[20px]',
      xlarge: 'w-[24px] h-[24px]',
    },
    color: {
      primary: 'text-interactive-icon-primary-subtle',
      white: 'text-interactive-icon-static-white-subtle',
      positive: 'text-interactive-icon-positive-subtle',
      negative: 'text-interactive-icon-negative-subtle',
      neutral: 'text-interactive-icon-gray-muted',
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
  },
});

// Export class names for use in component templates
export const spinnerClass = 'inline-flex items-center justify-center';
export const spinnerBoxClass = 'blade-spinner-box';
export const spinnerIconClass = 'w-full h-full';

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
