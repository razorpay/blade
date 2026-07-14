import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './counterInput.module.css';

export type CounterInputSize = 'xsmall' | 'medium' | 'large';
export type CounterInputEmphasis = 'subtle' | 'intense';
export type CounterInputButtonDirection = 'decrement' | 'increment';

export type CounterInputContainerVariants = {
  size?: CounterInputSize;
  emphasis?: CounterInputEmphasis;
};

export type CounterInputButtonVariants = {
  size?: CounterInputSize;
  emphasis?: CounterInputEmphasis;
  direction?: CounterInputButtonDirection;
};

export type CounterInputInputVariants = {
  size?: CounterInputSize;
  emphasis?: CounterInputEmphasis;
};

/**
 * Container styles. `size` drives width/height/radius, `emphasis` drives border
 * color. The `[data-disabled]` attribute selector in the CSS module covers the
 * disabled/loading background + border overrides, so they need no compound variant.
 */
export const counterInputContainerStyles = cva(styles.container, {
  variants: {
    size: {
      xsmall: styles['container-xsmall'],
      medium: styles['container-medium'],
      large: styles['container-large'],
    },
    emphasis: {
      subtle: styles['container-subtle'],
      intense: styles['container-intense'],
    },
  },
  defaultVariants: {
    size: 'medium',
    emphasis: 'subtle',
  },
});

export function getCounterInputContainerClasses(props: CounterInputContainerVariants): string {
  return counterInputContainerStyles(props);
}

/**
 * Button styles. `size` drives padding/radius, `emphasis` drives idle/hover/disabled
 * icon color, `direction` drives the asymmetric outer margins.
 */
export const counterInputButtonStyles = cva(styles.button, {
  variants: {
    size: {
      xsmall: styles['button-xsmall'],
      medium: styles['button-medium'],
      large: styles['button-large'],
    },
    emphasis: {
      subtle: styles['button-subtle'],
      intense: styles['button-intense'],
    },
    direction: {
      decrement: styles['button-decrement'],
      increment: styles['button-increment'],
    },
  },
  defaultVariants: {
    size: 'medium',
    emphasis: 'subtle',
    direction: 'decrement',
  },
});

export function getCounterInputButtonClasses(props: CounterInputButtonVariants): string {
  return counterInputButtonStyles(props);
}

/**
 * Native input styles. `size` drives font-size/line-height, `emphasis` drives
 * text color (idle + disabled via `[disabled]`).
 */
export const counterInputInputStyles = cva(styles.input, {
  variants: {
    size: {
      xsmall: styles['input-xsmall'],
      medium: styles['input-medium'],
      large: styles['input-large'],
    },
    emphasis: {
      subtle: styles['input-subtle'],
      intense: styles['input-intense'],
    },
  },
  defaultVariants: {
    size: 'medium',
    emphasis: 'subtle',
  },
});

export function getCounterInputInputClasses(props: CounterInputInputVariants): string {
  return counterInputInputStyles(props);
}

/**
 * Get all CounterInput structural template classes as an object. Calling this
 * from the Svelte component prevents tree-shaking from dropping classes that are
 * only referenced inside the template (`counterInput`, `layout`, `controls`, etc.).
 *
 * @example
 * const counterInputClasses = getCounterInputTemplateClasses();
 * // counterInputClasses.counterInput, counterInputClasses.controls
 */
export function getCounterInputTemplateClasses(): {
  counterInput: string;
  layout: string;
  layoutLeft: string;
  controls: string;
  inputWrapper: string;
  animateSlideUp: string;
  animateSlideDown: string;
  progressBarWrapper: string;
  progressBar: string;
  progressBarSubtle: string;
  progressBarIntense: string;
} {
  return {
    counterInput: styles['counter-input'],
    layout: styles.layout,
    layoutLeft: styles['layout-left'],
    controls: styles.controls,
    inputWrapper: styles['input-wrapper'],
    animateSlideUp: styles['animate-slide-up'],
    animateSlideDown: styles['animate-slide-down'],
    progressBarWrapper: styles['progress-bar-wrapper'],
    progressBar: styles['progress-bar'],
    progressBarSubtle: styles['progress-bar-subtle'],
    progressBarIntense: styles['progress-bar-intense'],
  };
}
