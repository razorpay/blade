import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import { TEXT_AXES } from '../shared/typography';

/**
 * The parts of an Icon. An icon is data the host renders, never a component
 * or a snippet: that is what lets a host size it and lets native draw it as
 * an image.
 */
export interface IconClasses {
  /** The box; the glyph fills it. `class` from the caller lands here. */
  root: string;
}

export type IconStyleResolver<P> = (props: P) => IconClasses;

export interface IconBehaviourProps {
  source: IconSource;
  /** Names the icon; without it the icon is decorative and hidden. */
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
}

/** The blade taxonomy as data. */
export const ICON_AXES = {
  size: ['2xsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
  color: TEXT_AXES.color,
} as const;

type IconAxis<K extends keyof typeof ICON_AXES> = AxisValue<typeof ICON_AXES, K>;

/** Derived from ICON_AXES: add a value there, never here. */
export interface IconStyleProps {
  size?: IconAxis<'size'>;
  /** Glyphs paint with the text colour; `inherit` follows the host. */
  color?: IconAxis<'color'>;
}

// Blade's icon sizes, 8 to 24px, and the 6px glyph of Blade's small Switch.
const SIZE: Record<IconAxis<'size'>, string> = {
  '2xsmall': 'w-[6px] h-[6px]',
  xsmall: 'w-2 h-2',
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-5 h-5',
  xlarge: 'w-6 h-6',
};

// The files keep their own viewBox and some a root size: the box wins.
const BASE = 'inline-flex shrink-0 [&>img]:w-full [&>img]:h-full [&>svg]:w-full [&>svg]:h-full';

// Blade's icon tokens, the icon twins of Text's colours (`surface.icon.*`,
// `feedback.icon.*.intense`).
const COLOR: Record<IconAxis<'color'>, string> = {
  default: 'icon-surface-gray-normal',
  subtle: 'icon-surface-gray-subtle',
  muted: 'icon-surface-gray-muted',
  primary: 'icon-surface-primary-normal',
  danger: 'icon-feedback-negative-intense',
  success: 'icon-feedback-positive-intense',
  white: 'icon-surface-static-white-normal',
  inherit: 'text-inherit',
};

export const resolveIcon: IconStyleResolver<IconStyleProps> = (props = {}) => {
  const { size = 'medium', color = 'inherit' } = props;
  return { root: `${BASE} ${SIZE[size]} ${COLOR[color]}` };
};
