import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { ButtonBusyCause } from '../button/styles';
import type { IconStyleProps } from '../icon/styles';

/** The parts IconButton toggles from JS: Button's press, a box around one glyph. */
export interface IconButtonClasses {
  root: string;
  /** Applied to the root while a blocked/invalid press shakes. */
  shake: string;
  /** Applied to the root while a press is settling. */
  loading: string;
  /** Visually-hides the live-region label announcing the busy state. */
  status: string;
  /** Style props handed to the glyph's Icon: the host sizes it. */
  icon: IconStyleProps;
}

export type IconButtonStyleResolver<P> = (props: P) => IconButtonClasses;

/** The shape of IconButton's busy loader, kept for consumers of the type. */
export type IconButtonLoaderSnippet<P> = Snippet<[P, ButtonBusyCause]>;

/** The blade taxonomy as data. */
export const ICON_BUTTON_AXES = {
  emphasis: ['intense', 'subtle', 'moderate'],
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof ICON_BUTTON_AXES> = AxisValue<typeof ICON_BUTTON_AXES, K>;

/** Derived from ICON_BUTTON_AXES: add a value there, never here. */
export interface IconButtonStyleProps {
  /**
   * `intense`: a gray glyph, for light surfaces. `subtle`: a white glyph,
   * for dark ones. `moderate`: the white glyph on a faint white box.
   * @default 'intense'
   */
  emphasis?: Axis<'emphasis'>;
  /** The glyph: 12, 16 or 20px. @default 'medium' */
  size?: Axis<'size'>;
  /**
   * A box behind the glyph on hover and focus. Not with `size="large"`,
   * as in Blade.
   * @default false
   */
  isHighlighted?: boolean;
}

// Blade's IconButton: the glyph takes the button's colour; hover, press and
// focus take the subtle step; Blade's 4px focus ring.
const ROOT =
  'inline-flex shrink-0 items-center justify-center border-none bg-transparent p-0 [transition-property:color,background-color,box-shadow] duration-xquick ease-standard disabled:cursor-not-allowed focus-visible:z-1 focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted';

const TONE: Record<Axis<'emphasis'>, string> = {
  intense:
    'icon-interactive-gray-muted hover:enabled:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle active:icon-interactive-gray-subtle disabled:icon-interactive-gray-disabled',
  subtle:
    'icon-interactive-static-white-normal hover:enabled:icon-interactive-static-white-subtle focus-visible:icon-interactive-static-white-subtle active:icon-interactive-static-white-subtle disabled:icon-interactive-static-white-disabled',
  moderate:
    'icon-interactive-static-white-normal hover:enabled:icon-interactive-static-white-subtle focus-visible:icon-interactive-static-white-subtle active:icon-interactive-static-white-subtle disabled:icon-interactive-static-white-disabled bg-interactive-static-white-faded hover:enabled:bg-interactive-static-white-faded-highlighted focus-visible:bg-interactive-static-white-faded-highlighted',
};

// The box behind the glyph, when highlighted: gray on light, white on dark.
const HIGHLIGHT: Record<'intense' | 'subtle', string> = {
  intense:
    'hover:enabled:bg-interactive-gray-faded-highlighted focus-visible:bg-interactive-gray-faded-highlighted',
  subtle:
    'hover:enabled:bg-interactive-static-white-faded focus-visible:bg-interactive-static-white-faded',
};

// A box (highlighted or moderate) is 24 or 32px with an 8px radius; the bare
// glyph is its own size, rounded 2px for the ring.
const BOX: Record<Axis<'size'>, string> = {
  small: 'w-6 h-6 rounded-small',
  medium: 'w-8 h-8 rounded-small',
  large: 'rounded-2xsmall',
};

export const resolveIconButton: IconButtonStyleResolver<IconButtonStyleProps> = (
  props: IconButtonStyleProps = {},
) => {
  const { emphasis = 'intense', size = 'medium', isHighlighted = false } = props;
  const hasBox = (isHighlighted || emphasis === 'moderate') && size !== 'large';
  const highlight = isHighlighted && emphasis !== 'moderate' ? HIGHLIGHT[emphasis] : '';
  return {
    root: `${ROOT} ${TONE[emphasis]} ${highlight} ${hasBox ? BOX[size] : 'rounded-2xsmall'}`
      .replace(/\s+/g, ' ')
      .trim(),
    shake: 'animate-shake motion-reduce:animate-none',
    loading: 'pointer-events-none',
    status: 'sr-only',
    // Blade's glyph sizes: small 12, medium 16, large 20 (Icon's small,
    // medium, large).
    icon: { size },
  };
};
