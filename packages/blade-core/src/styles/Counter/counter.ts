import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './counter.module.css';

export type CounterSize = 'small' | 'medium' | 'large';
export type CounterColor = 'neutral' | 'information' | 'negative' | 'notice' | 'positive' | 'primary';
export type CounterEmphasis = 'subtle' | 'intense';

export type CounterVariants = {
  size?: CounterSize;
  color?: CounterColor;
  emphasis?: CounterEmphasis;
};

/**
 * CVA configuration for Counter component
 * Handles size, color, and emphasis variants
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
      information: styles['color-information'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      positive: styles['color-positive'],
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

/**
 * Get color props for Counter based on color and emphasis
 * Returns the color token paths for text and background
 */
export function getCounterColorProps({
  color,
  emphasis,
}: {
  color: CounterColor;
  emphasis: CounterEmphasis;
}): {
  textColor: string;
  backgroundColor: string;
} {
  const props = {
    textColor: 'feedback.text.neutral.intense',
    backgroundColor: 'feedback.background.neutral.subtle',
  };

  if (color === 'primary') {
    props.textColor =
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.primary.normal';
    props.backgroundColor = `surface.background.primary.${emphasis}`;
  } else {
    props.textColor =
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : `feedback.text.${color}.intense`;
    props.backgroundColor = `feedback.background.${color}.${emphasis}`;
  }

  return props;
}

/**
 * Get text size for Counter based on counter size
 * Returns variant and size for Text component
 */
export function getCounterTextSize(size: CounterSize): {
  variant: 'body';
  size: 'xsmall' | 'small' | 'medium';
} {
  const counterTextSizes = {
    small: { variant: 'body' as const, size: 'xsmall' as const },
    medium: { variant: 'body' as const, size: 'small' as const },
    large: { variant: 'body' as const, size: 'medium' as const },
  };

  return counterTextSizes[size];
}

// Export content class for template
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
