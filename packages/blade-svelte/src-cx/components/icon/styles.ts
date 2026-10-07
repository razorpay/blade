import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import { TEXT_AXES } from '../shared/typography';

/**
 * The parts of an Icon. An icon is data (`IconSource`), never a component or
 * a snippet: the host sizes and tints it. A glyph draws as one character of
 * the `blade-icons` font; a URL (no font plugin) as a mask over the text
 * colour. Single colour only; anything with its own colours is an Image.
 */
export interface IconClasses {
  /** The box; the glyph fills it. `class` from the caller lands here. */
  root: string;
  /** Added for a URL: the SVG masks a fill of the text colour. */
  mask: string;
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
  size: ['2xsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
  color: TEXT_AXES.color,
} as const;

type IconAxis<K extends keyof typeof ICON_AXES> = AxisValue<typeof ICON_AXES, K>;

/** Derived from ICON_AXES: add a value there, never here. */
export interface IconStyleProps {
  size?: IconAxis<'size'>;
  /** Glyphs paint with the text colour; `inherit` follows the host. */
  color?: IconAxis<'color'>;
}

// Blade's icon sizes, 8 to 32px, and the 6px glyph of Blade's small Switch.
// The glyph is an em square, so the font size is the box.
const SIZE: Record<IconAxis<'size'>, string> = {
  '2xsmall': 'w-[6px] h-[6px] [font-size:6px]',
  xsmall: 'w-2 h-2 [font-size:8px]',
  small: 'w-3 h-3 [font-size:12px]',
  medium: 'w-4 h-4 [font-size:16px]',
  large: 'w-5 h-5 [font-size:20px]',
  xlarge: 'w-6 h-6 [font-size:24px]',
  // Blade DSL's EmptyState at xlarge leads its heading with a 32px icon.
  '2xlarge': 'w-8 h-8 [font-size:32px]',
};

// No clipping: some glyphs touch their box's edge (check-circle at x=0), and
// a glyph's antialiased edge would be cut at small sizes.
const BASE = 'icon-font inline-flex shrink-0 items-center justify-center select-none';

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
  return { root: `${BASE} ${SIZE[size]} ${COLOR[color]}`, mask: 'icon-mask' };
};
