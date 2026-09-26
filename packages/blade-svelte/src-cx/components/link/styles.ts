// The link look, shared by Link (an <a>) and Button's `link` variant (a
// <button> that reads as a link): one place, so the two never drift.
import type { AxisValue } from '../../axes';
import type { IconStyleProps } from '../icon/styles';

/**
 * The parts of a Link. A Link is always an anchor: something that only acts
 * is a Button (whose `link` variant looks like one).
 */
export interface LinkClasses {
  root: string;
  /** Applied while disabled: the anchor has no href then. */
  disabled: string;
  /** Wraps the glyph, per side of the text. */
  iconSlot: Record<'leading' | 'trailing', string>;
  /** Style props handed to the glyph's Icon: the host sizes it. */
  icon: IconStyleProps;
}

export type LinkStyleResolver<P> = (props: P) => LinkClasses;

export const LINK_COLORS = [
  'primary',
  'neutral',
  'positive',
  'negative',
] as const;
export const LINK_SIZES = ['xsmall', 'small', 'medium', 'large'] as const;

export type LinkColor = (typeof LINK_COLORS)[number];
export type LinkSize = (typeof LINK_SIZES)[number];

// No display: Link is `inline` so it wraps with its sentence, Button's link
// variant `inline-flex` so it takes no more width than its content.
// Blade's BaseLink: text and glyph in `interactive.{text,icon}.{color}`,
// normal at rest and subtle on hover and focus; the focus ring a 4px outline
// offset by 1px in `interactive.border.primary.faded`.
const LOOK =
  'cursor-pointer rounded-2xsmall bg-transparent p-0 font-medium underline-offset-2 transition-colors hover:underline focus-visible:outline-solid focus-visible:[outline-width:4px] focus-visible:outline-offset-1 focus-visible:outline-interactive-primary-faded';

const COLOR: Record<LinkColor, string> = {
  primary: 'text-interactive-primary-normal hover:text-interactive-primary-subtle focus-visible:text-interactive-primary-subtle',
  neutral: 'text-interactive-neutral-normal hover:text-interactive-neutral-subtle focus-visible:text-interactive-neutral-subtle',
  positive: 'text-interactive-positive-normal hover:text-interactive-positive-subtle focus-visible:text-interactive-positive-subtle',
  negative: 'text-interactive-negative-normal hover:text-interactive-negative-subtle focus-visible:text-interactive-negative-subtle',
};

const SIZE: Record<LinkSize, string> = {
  xsmall: 'text-25 leading-50',
  small: 'text-75 leading-50',
  medium: 'text-100 leading-100',
  large: 'text-200 leading-200',
};

const ICON: Record<LinkSize, IconStyleProps> = {
  xsmall: { size: 'small' },
  small: { size: 'small' },
  medium: { size: 'medium' },
  large: { size: 'medium' },
};

export function linkLook(color: LinkColor, size: LinkSize): string {
  return `${LOOK} ${COLOR[color]} ${SIZE[size]}`;
}

/**
 * Looks like text, does nothing: no pointer, no hover. Blade's disabled
 * link takes its colour's disabled text (`interactive.text.{color}.disabled`).
 * `toggled` is for a class the core applies; `native` for a real
 * `disabled` control (Button's link variant).
 */
const DISABLED: Record<LinkColor, { toggled: string; native: string }> = {
  primary: {
    toggled: 'pointer-events-none text-interactive-primary-disabled',
    native: 'disabled:pointer-events-none disabled:text-interactive-primary-disabled',
  },
  neutral: {
    toggled: 'pointer-events-none text-interactive-neutral-disabled',
    native: 'disabled:pointer-events-none disabled:text-interactive-neutral-disabled',
  },
  positive: {
    toggled: 'pointer-events-none text-interactive-positive-disabled',
    native: 'disabled:pointer-events-none disabled:text-interactive-positive-disabled',
  },
  negative: {
    toggled: 'pointer-events-none text-interactive-negative-disabled',
    native: 'disabled:pointer-events-none disabled:text-interactive-negative-disabled',
  },
};

export function linkDisabled(
  color: LinkColor,
  on: 'toggled' | 'native' = 'toggled'
): string {
  return DISABLED[color][on];
}

export function linkIcon(size: LinkSize): IconStyleProps {
  return ICON[size];
}

/** A glyph inside the inline run: spaced from the text, on its midline. */
export const LINK_ICON_SLOT = {
  leading: 'me-1 inline-flex [vertical-align:-0.125em]',
  trailing: 'ms-1 inline-flex [vertical-align:-0.125em]',
};

/** The blade taxonomy as data. */
export const LINK_AXES = {
  color: LINK_COLORS,
  size: LINK_SIZES,
} as const;

type Axis<K extends keyof typeof LINK_AXES> = AxisValue<typeof LINK_AXES, K>;

/** Derived from LINK_AXES: add a value there, never here. */
export interface LinkStyleProps {
  color?: Axis<'color'>;
  size?: Axis<'size'>;
}

export const resolveLink: LinkStyleResolver<LinkStyleProps> = (
  props: LinkStyleProps = {}
) => {
  const { color = 'primary', size = 'medium' } = props;
  return {
    root: `inline ${linkLook(color, size)}`,
    disabled: linkDisabled(color),
    iconSlot: LINK_ICON_SLOT,
    icon: linkIcon(size),
  };
};
