import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import { INTENTS } from '../shared/intent';

/** The blade taxonomy as data. */
export const BADGE_AXES = {
  color: [...INTENTS, 'primary'],
  emphasis: ['subtle', 'intense'],
  size: ['small', 'medium'],
} as const;

type Axis<K extends keyof typeof BADGE_AXES> = AxisValue<typeof BADGE_AXES, K>;

/** Derived from BADGE_AXES: add a value there, never here. */
export interface BadgeStyleProps {
  color?: Axis<'color'>;
  emphasis?: Axis<'emphasis'>;
  size?: Axis<'size'>;
}

// Blade's Badge (blade-core badge.module.css + getBadgeTextColorToken): the
// feedback pair per intent — the subtle surface under the intense text, or
// the intense surface under static white — and the primary surface pair for
// `primary`. Blade draws no border: the hairline stays, transparent, so the
// box keeps its size.
const COLOR: Record<Axis<'emphasis'>, Record<Axis<'color'>, string>> = {
  subtle: {
    neutral: `border-transparent bg-feedback-neutral-subtle text-feedback-neutral-intense`,
    information: `border-transparent bg-feedback-information-subtle text-feedback-information-intense`,
    positive: `border-transparent bg-feedback-positive-subtle text-feedback-positive-intense`,
    notice: `border-transparent bg-feedback-notice-subtle text-feedback-notice-intense`,
    negative: `border-transparent bg-feedback-negative-subtle text-feedback-negative-intense`,
    primary: `border-transparent bg-surface-primary-subtle text-surface-primary-normal`,
  },
  intense: {
    neutral: 'border-transparent bg-feedback-neutral-intense text-surface-static-white-normal',
    information: 'border-transparent bg-feedback-information-intense text-surface-static-white-normal',
    positive: 'border-transparent bg-feedback-positive-intense text-surface-static-white-normal',
    notice: 'border-transparent bg-feedback-notice-intense text-surface-static-white-normal',
    negative: 'border-transparent bg-feedback-negative-intense text-surface-static-white-normal',
    primary: 'border-transparent bg-surface-primary-intense text-surface-static-white-normal',
  },
};

const SIZE: Record<Axis<'size'>, string> = {
  small: 'h-4 px-1 text-25 leading-50',
  medium: 'h-5 px-1 text-75 leading-50',
};

export function resolveBadge(props: BadgeStyleProps = {}): string {
  const { color = 'neutral', emphasis = 'subtle', size = 'medium' } = props;
  return `inline-flex items-center gap-1 whitespace-nowrap rounded-max border-thin border-solid font-medium ${COLOR[emphasis][color]} ${SIZE[size]}`;
}

/** A small status label: style-only. */
export interface BadgeBehaviourProps {
  testID?: string;
  class?: string;
  children: Snippet;
}
