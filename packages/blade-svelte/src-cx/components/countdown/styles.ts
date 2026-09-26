import type { AxisValue } from '../../axes';

/**
 * The parts of a Countdown: the figure, and how it looks once little time
 * is left.
 */
export interface CountdownClasses {
  root: string;
  tone: Record<'calm' | 'urgent', string>;
}

export type CountdownStyleResolver<P> = (props: P) => CountdownClasses;

/** The blade taxonomy as data. */
export const COUNTDOWN_AXES = {
  variant: ['text', 'pill'],
} as const;

type Axis<K extends keyof typeof COUNTDOWN_AXES> = AxisValue<
  typeof COUNTDOWN_AXES,
  K
>;

/** Derived from COUNTDOWN_AXES: add a value there, never here. */
export interface CountdownStyleProps {
  /** `text` inherits its size and colour; `pill` is the session timer chip. */
  variant?: Axis<'variant'>;
}

// Ported from app/v2/lib/components/Timer.svelte (the pill, red under two
// minutes). No Blade counterpart: the pill takes Blade's subtle Badge colours,
// neutral while calm and negative when urgent. Tabular figures, so the width does not tick with the digits.
const VARIANT: Record<Axis<'variant'>, Record<'calm' | 'urgent', string>> = {
  text: { calm: '', urgent: 'text-feedback-negative-intense' },
  pill: {
    calm: 'rounded-max bg-feedback-neutral-subtle px-2 py-0.5 text-75 leading-50 font-medium text-feedback-neutral-intense',
    urgent:
      'rounded-max bg-feedback-negative-subtle px-2 py-0.5 text-75 leading-50 font-medium text-feedback-negative-intense',
  },
};

export const resolveCountdown: CountdownStyleResolver<CountdownStyleProps> = (
  props
) => ({
  root: 'inline-block font-text tabular-nums',
  tone: VARIANT[props.variant ?? 'text'],
});
