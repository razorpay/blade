import { cva } from 'class-variance-authority';
import { cn } from '~utils/cx';

export type CounterSize = 'small' | 'medium' | 'large';
export type CounterColor =
  | 'neutral'
  | 'positive'
  | 'negative'
  | 'notice'
  | 'information'
  | 'primary';
export type CounterEmphasis = 'subtle' | 'intense';

export type CounterVariants = {
  size?: CounterSize;
  color?: CounterColor;
  emphasis?: CounterEmphasis;
};

/**
 * Counter text size mapping
 * Returns fontSize and lineHeight values for BaseText
 * Maps to React's Text component: variant='body' with size='xsmall'|'small'|'medium'
 * - body xsmall: fontSize 25, lineHeight 25
 * - body small: fontSize 75, lineHeight 75
 * - body medium: fontSize 100, lineHeight 100
 */
export const counterTextSizes: Record<
  CounterSize,
  { fontSize: 25 | 75 | 100; lineHeight: 25 | 75 | 100 }
> = {
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
 * CVA-based counter styles (Tailwind).
 *
 * Background depends on `color` AND `emphasis` together — in CSS Modules this was a chained selector
 * (`.color-neutral.emphasis-subtle`); with no stylesheet to hold it each pairing becomes a
 * `compoundVariants` entry, so `color`/`emphasis` are empty `variants`. Sizes are min-height/width
 * one-offs (16/20/24) that are not spacing tokens, so they use arbitrary values.
 */
export const counterStyles = cva(
  'inline-flex items-center justify-center rounded-max w-fit flex-nowrap bg-transparent',
  {
    variants: {
      size: {
        small: 'min-h-[16px] min-w-[16px]',
        medium: 'min-h-[20px] min-w-[20px]',
        large: 'min-h-[24px] min-w-[24px]',
      },
      color: {
        neutral: '',
        positive: '',
        negative: '',
        notice: '',
        information: '',
        primary: '',
      },
      emphasis: {
        subtle: '',
        intense: '',
      },
    },
    compoundVariants: [
      // Background: color × emphasis (was chained `.color-*.emphasis-*` selectors).
      { color: 'neutral', emphasis: 'subtle', class: 'bg-feedback-background-neutral-subtle' },
      { color: 'neutral', emphasis: 'intense', class: 'bg-feedback-background-neutral-intense' },
      { color: 'positive', emphasis: 'subtle', class: 'bg-feedback-background-positive-subtle' },
      { color: 'positive', emphasis: 'intense', class: 'bg-feedback-background-positive-intense' },
      { color: 'negative', emphasis: 'subtle', class: 'bg-feedback-background-negative-subtle' },
      { color: 'negative', emphasis: 'intense', class: 'bg-feedback-background-negative-intense' },
      { color: 'notice', emphasis: 'subtle', class: 'bg-feedback-background-notice-subtle' },
      { color: 'notice', emphasis: 'intense', class: 'bg-feedback-background-notice-intense' },
      {
        color: 'information',
        emphasis: 'subtle',
        class: 'bg-feedback-background-information-subtle',
      },
      {
        color: 'information',
        emphasis: 'intense',
        class: 'bg-feedback-background-information-intense',
      },
      { color: 'primary', emphasis: 'subtle', class: 'bg-surface-background-primary-subtle' },
      { color: 'primary', emphasis: 'intense', class: 'bg-surface-background-primary-intense' },
    ],
    defaultVariants: {
      size: 'medium',
      color: 'neutral',
      emphasis: 'subtle',
    },
  },
);

// Content wrapper class for use in component templates (literal so the JIT scanner sees it).
export const counterContentClass = 'flex flex-row items-center justify-center overflow-hidden';

/**
 * Conditional horizontal padding on the Counter content wrapper (multi-digit values).
 */
export const counterContentPaddingClass: Record<CounterSize, string> = {
  small: 'px-spacing-2',
  medium: 'px-spacing-3',
  large: 'px-spacing-3',
};

/**
 * Compute the class list for the Counter content wrapper.
 * Returns the base content class, plus the size-specific padding class when
 * the counter should render with horizontal padding (multi-digit values).
 */
export function getCounterContentClasses({
  size,
  hasHorizontalPadding,
}: {
  size: CounterSize;
  hasHorizontalPadding: boolean;
}): string {
  const classes = [counterContentClass];
  if (hasHorizontalPadding) {
    classes.push(counterContentPaddingClass[size]);
  }
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate all classes for Counter component
 * This is the single source of truth for all Counter styling
 */
export function getCounterClasses(props: CounterVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  return cn(counterStyles(cvaProps), className);
}
