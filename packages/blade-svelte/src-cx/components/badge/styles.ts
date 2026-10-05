import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import { INTENTS } from '../shared/intent';

/** The parts of a Badge. */
export interface BadgeClasses {
  /** `class` from the caller lands here. */
  root: string;
  /** Wraps the icon; the icon takes the text's colour. */
  icon: string;
  iconSize: 'xsmall' | 'small';
  /** The one-line label. */
  text: string;
}

/** The blade taxonomy as data. */
export const BADGE_AXES = {
  color: [...INTENTS, 'primary'],
  emphasis: ['subtle', 'intense'],
  size: ['xsmall', 'small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof BADGE_AXES> = AxisValue<typeof BADGE_AXES, K>;

/** Derived from BADGE_AXES: add a value there, never here. */
export interface BadgeStyleProps {
  /** @default 'neutral' */
  color?: Axis<'color'>;
  /** @default 'subtle' */
  emphasis?: Axis<'emphasis'>;
  /** @default 'medium' */
  size?: Axis<'size'>;
}

// Blade's Badge: the feedback pair per colour — the subtle surface under the
// intense text, or the intense surface under static white — and the primary
// surface pair for `primary`. No border. The icon takes the text's colour,
// as Blade's icon tokens equal the text's.
const COLOR: Record<Axis<'emphasis'>, Record<Axis<'color'>, string>> = {
  subtle: {
    neutral: 'bg-feedback-neutral-subtle text-feedback-neutral-intense',
    information: 'bg-feedback-information-subtle text-feedback-information-intense',
    positive: 'bg-feedback-positive-subtle text-feedback-positive-intense',
    notice: 'bg-feedback-notice-subtle text-feedback-notice-intense',
    negative: 'bg-feedback-negative-subtle text-feedback-negative-intense',
    primary: 'bg-surface-primary-subtle text-surface-primary-normal',
  },
  intense: {
    neutral: 'bg-feedback-neutral-intense text-surface-static-white-normal',
    information: 'bg-feedback-information-intense text-surface-static-white-normal',
    positive: 'bg-feedback-positive-intense text-surface-static-white-normal',
    notice: 'bg-feedback-notice-intense text-surface-static-white-normal',
    negative: 'bg-feedback-negative-intense text-surface-static-white-normal',
    primary: 'bg-surface-primary-intense text-surface-static-white-normal',
  },
};

// Blade's badgeTokens: the height, the box's side padding, and the text's own
// side margin (which is also the icon-to-text gap), with body xsmall or
// small type.
const SIZE: Record<Axis<'size'>, { root: string; text: string; icon: BadgeClasses['iconSize'] }> = {
  xsmall: { root: 'h-3.5 px-1', text: 'mx-0.5 text-25 leading-25', icon: 'xsmall' },
  small: { root: 'h-4 px-1', text: 'mx-0.5 text-25 leading-25', icon: 'xsmall' },
  medium: { root: 'h-5 px-1', text: 'mx-1 text-75 leading-75', icon: 'small' },
  large: { root: 'h-6 px-2', text: 'mx-1 text-75 leading-75', icon: 'small' },
};

// The intense badge sets its label lighter: regular on the fill, medium on
// the tint.
const WEIGHT: Record<Axis<'emphasis'>, string> = {
  subtle: 'font-medium',
  intense: 'font-regular',
};

export function resolveBadge(props: BadgeStyleProps = {}): BadgeClasses {
  const { color = 'neutral', emphasis = 'subtle', size = 'medium' } = props;
  const spec = SIZE[size];
  return {
    root: `inline-flex w-fit max-w-full items-center justify-center overflow-hidden rounded-max ${spec.root} ${COLOR[emphasis][color]}`,
    icon: 'flex shrink-0',
    iconSize: spec.icon,
    text: `m-0 min-w-0 clamp-1 font-text tracking-50 ${WEIGHT[emphasis]} ${spec.text}`,
  };
}

/** A small status label. */
export interface BadgeBehaviourProps {
  /** Before the label, in its colour. */
  icon?: IconSource;
  testID?: string;
  class?: string;
  /** The label: text. */
  children: Snippet;
}
