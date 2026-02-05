import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './counter.module.css';

export type CounterSize = 'small' | 'medium' | 'large';
export type CounterColor = 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';
export type CounterEmphasis = 'subtle' | 'intense';

export type CounterVariants = {
  size?: CounterSize;
  color?: CounterColor;
  emphasis?: CounterEmphasis;
};

/**
 * Counter height tokens mapped to size
 */
export const counterHeight: Record<CounterSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

/**
 * Counter horizontal padding tokens mapped to size
 */
export const counterHorizontalPadding: Record<CounterSize, string> = {
  small: 'spacing.2',
  medium: 'spacing.3',
  large: 'spacing.3',
};

/**
 * Counter text size mapping
 * Returns fontSize and lineHeight values for BaseText
 * Maps to React's Text component: variant='body' with size='xsmall'|'small'|'medium'
 * - body xsmall: fontSize 25, lineHeight 25
 * - body small: fontSize 75, lineHeight 75
 * - body medium: fontSize 100, lineHeight 100
 */
export const counterTextSizes: Record<CounterSize, { fontSize: 25 | 75 | 100; lineHeight: 25 | 75 | 100 }> = {
  small: { fontSize: 25, lineHeight: 25 },
  medium: { fontSize: 75, lineHeight: 75 },
  large: { fontSize: 100, lineHeight: 100 },
};

/**
 * Get text color token based on color and emphasis
 */
export function getCounterTextColorToken({
  color,
  emphasis,
}: {
  color: CounterColor;
  emphasis: CounterEmphasis;
}): string {
  if (color === 'primary') {
    return emphasis === 'intense'
      ? 'surface.text.staticWhite.normal'
      : 'surface.text.primary.normal';
  }

  // Feedback colors
  return emphasis === 'intense'
    ? 'surface.text.staticWhite.normal'
    : `feedback.text.${color}.intense`;
}

/**
 * CVA-based counter styles
 */
export const counterStyles = cva(styles.counter, {
  variants: {
    size: {
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    color: {
      neutral: styles['color-neutral'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      information: styles['color-information'],
      primary: styles['color-primary'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
  },
});

// Export content class for use in component templates
export const counterContentClass = styles.content;

/**
 * Get all Counter component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getCounterTemplateClasses(): Record<string, string> {
  return {
    content: counterContentClass,
  } as const;
}

/**
 * Generate all classes for Counter component
 * This is the single source of truth for all Counter styling
 */
export function getCounterClasses(props: CounterVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  const classes = [counterStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
