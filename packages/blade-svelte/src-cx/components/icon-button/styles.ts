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
  variant: ['plain', 'boxed'],
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof ICON_BUTTON_AXES> = AxisValue<
  typeof ICON_BUTTON_AXES,
  K
>;

/** Derived from ICON_BUTTON_AXES: add a value there, never here. */
export interface IconButtonStyleProps {
  /** `plain`: the glyph alone. `boxed`: v2's MiniButton, a bordered box. */
  variant?: Axis<'variant'>;
  size?: Axis<'size'>;
}

// Blade's IconButton (blade-core iconButton.module.css): the glyph in
// Blade's intense emphasis — gray muted at rest, subtle on hover, focus and
// press, its disabled gray when disabled — and Blade's focus ring, a 4px
// outline offset by 1px in the primary muted border.
const ROOT =
  'inline-flex shrink-0 items-center justify-center rounded-small transition-colors icon-interactive-gray-muted hover:enabled:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle active:enabled:icon-interactive-gray-subtle disabled:icon-interactive-gray-disabled focus-visible:outline-solid focus-visible:[outline-width:4px] focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted';

const VARIANT: Record<Axis<'variant'>, string> = {
  // Blade's `isHighlighted` IconButton: the faded gray behind the glyph on
  // hover and focus.
  plain:
    'border-none bg-transparent hover:enabled:bg-interactive-gray-faded-highlighted focus-visible:bg-interactive-gray-faded-highlighted',
  // Ported from app/v2/components/button/MiniButton.svelte. No Blade
  // counterpart: the frame is Blade's outlined (secondary) Button's — the
  // gray rim on a white box, darker on hover and press, its disabled rim
  // over the white ghost fill.
  boxed:
    'border-thin border-solid border-interactive-gray-default bg-surface-gray-intense hover:enabled:border-interactive-gray-highlighted active:enabled:border-interactive-gray-highlighted disabled:border-interactive-gray-disabled disabled:bg-interactive-static-white-ghost',
};

// The box keeps the tap target larger than the glyph: 24, 32 and 40px
// around 12, 16 and 20px.
const SIZE: Record<Axis<'size'>, string> = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-10 h-10',
};

export const resolveIconButton: IconButtonStyleResolver<
  IconButtonStyleProps
> = (props: IconButtonStyleProps = {}) => {
  const { variant = 'plain', size = 'medium' } = props;
  return {
    root: `${ROOT} ${VARIANT[variant]} ${SIZE[size]}`,
    shake: 'animate-shake motion-reduce:animate-none',
    loading: 'pointer-events-none',
    status: 'sr-only',
    icon: { size },
  };
};
