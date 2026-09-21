import { cva } from 'class-variance-authority';

export type CounterInputSize = 'xsmall' | 'small' | 'medium' | 'large';
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
export const counterInputContainerStyles = cva('blade-counter-input-container', {
  variants: {
    size: {
      xsmall: 'blade-counter-input-container-xsmall',
      small: 'blade-counter-input-container-small',
      medium: 'blade-counter-input-container-medium',
      large: 'blade-counter-input-container-large',
    },
    emphasis: {
      subtle: 'blade-counter-input-container-subtle',
      intense: 'blade-counter-input-container-intense',
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
export const counterInputButtonStyles = cva('blade-counter-input-button', {
  variants: {
    size: {
      xsmall: 'blade-counter-input-button-xsmall',
      small: 'blade-counter-input-button-small',
      medium: 'blade-counter-input-button-medium',
      large: 'blade-counter-input-button-large',
    },
    emphasis: {
      subtle: 'blade-counter-input-button-subtle',
      intense: 'blade-counter-input-button-intense',
    },
    direction: {
      decrement: 'blade-counter-input-button-decrement',
      increment: 'blade-counter-input-button-increment',
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
export const counterInputInputStyles = cva('blade-counter-input-input', {
  variants: {
    size: {
      xsmall: 'blade-counter-input-input-xsmall',
      small: 'blade-counter-input-input-small',
      medium: 'blade-counter-input-input-medium',
      large: 'blade-counter-input-input-large',
    },
    emphasis: {
      subtle: 'blade-counter-input-input-subtle',
      intense: 'blade-counter-input-input-intense',
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
    counterInput: 'blade-counter-input',
    layout: 'blade-counter-input-layout',
    layoutLeft: 'blade-counter-input-layout-left',
    controls: 'blade-counter-input-controls',
    inputWrapper: 'blade-counter-input-input-wrapper',
    animateSlideUp: 'blade-counter-input-animate-slide-up',
    animateSlideDown: 'blade-counter-input-animate-slide-down',
    progressBarWrapper: 'blade-counter-input-progress-bar-wrapper',
    progressBar: 'blade-counter-input-progress-bar',
    progressBarSubtle: 'blade-counter-input-progress-bar-subtle',
    progressBarIntense: 'blade-counter-input-progress-bar-intense',
  };
}
