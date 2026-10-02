import type { AxisValue } from '../../axes';

/** The blade taxonomy as data. */
export const COUNTER_AXES = {
  color: ['neutral', 'positive', 'negative', 'notice', 'information', 'primary'],
  emphasis: ['subtle', 'intense'],
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof COUNTER_AXES> = AxisValue<
  typeof COUNTER_AXES,
  K
>;

/** Derived from COUNTER_AXES: add a value there, never here. */
export interface CounterStyleProps {
  /** @default 'neutral' */
  color?: Axis<'color'>;
  /** @default 'subtle' */
  emphasis?: Axis<'emphasis'>;
  /** @default 'medium' */
  size?: Axis<'size'>;
}

export interface CounterClasses {
  root: string;
  pill: string;
  content: string;
  /** Side padding, applied once the number has two digits. */
  wide: string;
  text: string;
}

// Blade's Counter (Counter.tsx, counterTokens.ts): a pill as tall as it is
// wide at one digit (16/20/24px), with side padding from two digits
// (4/8/8px), 100px wide at most on phones and 120px above, and medium body
// text a step down from the size (10/12/14px).
const SIZE: Record<Axis<'size'>, { pill: string; wide: string; text: string }> = {
  small: {
    pill: 'min-h-4 min-w-4',
    wide: 'px-1',
    text: 'text-25 leading-25',
  },
  medium: {
    pill: 'min-h-5 min-w-5',
    wide: 'px-2',
    text: 'text-75 leading-75',
  },
  large: {
    pill: 'min-h-6 min-w-6',
    wide: 'px-2',
    text: 'text-100 leading-100',
  },
};

// Colours (getColorProps): the feedback pair for a feedback colour, the
// primary surface pair for `primary`; intense text is static white.
const FILL: Record<Axis<'color'>, Record<Axis<'emphasis'>, string>> = {
  neutral: {
    subtle: 'bg-feedback-neutral-subtle text-feedback-neutral-intense',
    intense: 'bg-feedback-neutral-intense text-surface-static-white-normal',
  },
  positive: {
    subtle: 'bg-feedback-positive-subtle text-feedback-positive-intense',
    intense: 'bg-feedback-positive-intense text-surface-static-white-normal',
  },
  negative: {
    subtle: 'bg-feedback-negative-subtle text-feedback-negative-intense',
    intense: 'bg-feedback-negative-intense text-surface-static-white-normal',
  },
  notice: {
    subtle: 'bg-feedback-notice-subtle text-feedback-notice-intense',
    intense: 'bg-feedback-notice-intense text-surface-static-white-normal',
  },
  information: {
    subtle: 'bg-feedback-information-subtle text-feedback-information-intense',
    intense: 'bg-feedback-information-intense text-surface-static-white-normal',
  },
  primary: {
    subtle: 'bg-surface-primary-subtle text-surface-primary-normal',
    intense: 'bg-surface-primary-intense text-surface-static-white-normal',
  },
};

export function resolveCounter(props: CounterStyleProps = {}): CounterClasses {
  const { color = 'neutral', emphasis = 'subtle', size = 'medium' } = props;
  const look = SIZE[size];
  return {
    root: 'inline-flex self-center justify-center',
    pill: `flex w-fit flex-nowrap items-center justify-center rounded-max max-w-[100px] m:max-w-[120px] ${look.pill} ${FILL[color][emphasis]}`,
    content: 'flex flex-row items-center justify-center overflow-hidden',
    wide: look.wide,
    text: `truncate text-center font-text font-medium tracking-50 ${look.text}`,
  };
}
