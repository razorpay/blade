import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import { linkDisabled, linkLook } from '../link/styles';

/**
 * The parts Button toggles from JS. Static class strings only; interaction
 * states use the variant grammar (`hover:`, `active:`, `disabled:`) so
 * native needs no bridge round-trip — the parts below are the states the
 * grammar lacks.
 */
export interface ButtonClasses {
  root: string;
  /** Wraps the children: lays out icons and label alike. */
  content: string;
  /**
   * Applied to `content` while busy: the children stay rendered, so the
   * button keeps its width and its accessible name, but read as gone.
   */
  busyContent: string;
  /** The layer over `content` that holds the busy dots. */
  loader: string;
  /** Applied to the root while a blocked/invalid press shakes. */
  shake: string;
  /** Applied to the root while a press is settling. */
  loading: string;
  /** Visually-hides the live-region label announcing the busy state. */
  status: string;
  /**
   * Drawn while `autoPressAfter` counts: the button sets `--progress` (0..1,
   * the elapsed share) on it, once a second.
   */
  autoFill: string;
}

export type ButtonStyleResolver<P> = (props: P) => ButtonClasses;

/**
 * Why the button is busy: the consumer's `isLoading` prop (`host`), the
 * model settling an async `onClick` (`press`), or the enclosing form's
 * submission — Enter-key submissions included (`form`).
 */
import type { ButtonBusyCause } from '../../runes/button/press.svelte';

export type { ButtonBusyCause };

/** The shape of Button's busy loader, kept for consumers of the type. */
export type ButtonLoaderSnippet<P> = Snippet<[P, Snippet, ButtonBusyCause]>;

// Neutral by default: checkout's call to action is Blade's black button.
const DEFAULTS = {
  variant: 'primary',
  color: 'neutral',
  size: 'medium',
} as const;

/** The blade taxonomy as data. */
export const BUTTON_AXES = {
  variant: ['primary', 'secondary', 'link'],
  color: ['primary', 'neutral', 'positive', 'negative'],
  size: ['xsmall', 'small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof BUTTON_AXES> = AxisValue<
  typeof BUTTON_AXES,
  K
>;

/** Derived from BUTTON_AXES: add a value there, never here. */
export interface ButtonStyleProps {
  variant?: Axis<'variant'>;
  color?: Axis<'color'>;
  size?: Axis<'size'>;
}

// Blade's Button matrix, colour by variant by state, its frame and motion
// from blade-core's button.module.css, in Blade's semantic tokens (the
// merchant-themed scales are gone: `primary` is Blade's primary). Neutral is
// Blade's interactive neutral fill (black). Width is the caller's (`class="w-full"`), never a
// style prop. Disabled is per colour — Blade tints the fill and the text, it
// does not fade the box — so the root only stops the pointer. The root is
// `relative` for the loader and the auto-press fill, both layers over the
// content, and a `group` for the press, which scales the content.
const ROOT =
  'group relative flex items-center justify-center overflow-hidden border-none font-heading font-semibold [transition-property:background-color,box-shadow] duration-xquick ease-standard disabled:pointer-events-none';
const LINK_ROOT = 'relative inline-flex items-center border-none';
// The children, laid out as the root is; busy fades them in place. A box
// presses by shrinking its content (Blade's `animated-content`); positioned,
// the content paints over the sheen.
const CONTENT = 'relative flex flex-1 items-center justify-center';
const BOX_CONTENT = `${CONTENT} transition-transform duration-xquick ease-standard group-active:scale-95`;
const BUSY_CONTENT = 'opacity-0';
const LOADER =
  'absolute inset-0 flex items-center justify-center *:rounded-max';

// `link` draws none of the box classes: it reads as a link (resolveButton).
const IS_LINK = {
  primary: false,
  secondary: false,
  link: true,
} satisfies Record<Axis<'variant'>, boolean>;

// Filled (Blade's `primary` variant): the intent's fill under the frame and
// a resting sheen that fades out on hover, press and focus as the fill
// darkens and the rim highlights, white text; disabled is the intent's
// disabled fill under its disabled text, flat. The sheen's gradient is sized
// per button (SHEEN_SIZE).
const SHEEN =
  'before:content-empty before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:transition-opacity before:duration-xquick before:ease-standard hover:before:opacity-0 focus-visible:before:opacity-0 active:before:opacity-0 disabled:before:opacity-0';
// The frame per colour, its colours baked into the shadows (uno.config.ts):
// the rim is the fill, the edge its darker step, the bevel a white tint.
// Focus draws the highlighted frame under Blade's focus ring — the neutral
// button rings in its own faded gray — as one box-shadow.
const ACCENT = {
  primary:
    'shadow-button-primary hover:shadow-button-primary-highlighted active:shadow-button-primary-highlighted focus-visible:shadow-button-primary-focus',
  neutral:
    'shadow-button-neutral hover:shadow-button-neutral-highlighted active:shadow-button-neutral-highlighted focus-visible:shadow-button-neutral-focus',
  positive:
    'shadow-button-positive hover:shadow-button-positive-highlighted active:shadow-button-positive-highlighted focus-visible:shadow-button-positive-focus',
  negative:
    'shadow-button-negative hover:shadow-button-negative-highlighted active:shadow-button-negative-highlighted focus-visible:shadow-button-negative-focus',
} satisfies Record<Axis<'color'>, string>;
const FILLED_FRAME = `${SHEEN} focus-visible:outline-none disabled:shadow-none`;
const FILLED = {
  primary: `${ACCENT.primary} ${FILLED_FRAME} bg-interactive-primary-default text-interactive-on-primary-normal hover:bg-interactive-primary-highlighted focus-visible:bg-interactive-primary-highlighted active:bg-interactive-primary-highlighted disabled:bg-interactive-primary-disabled disabled:text-interactive-primary-disabled`,
  neutral: `${ACCENT.neutral} ${FILLED_FRAME} bg-interactive-neutral-default text-interactive-static-white-normal hover:bg-interactive-neutral-highlighted focus-visible:bg-interactive-neutral-highlighted active:bg-interactive-neutral-highlighted disabled:bg-interactive-neutral-disabled disabled:text-interactive-static-white-disabled`,
  positive: `${ACCENT.positive} ${FILLED_FRAME} bg-interactive-positive-default text-interactive-static-white-normal hover:bg-interactive-positive-highlighted focus-visible:bg-interactive-positive-highlighted active:bg-interactive-positive-highlighted disabled:bg-interactive-positive-disabled disabled:text-interactive-positive-disabled`,
  negative: `${ACCENT.negative} ${FILLED_FRAME} bg-interactive-negative-default text-interactive-static-white-normal hover:bg-interactive-negative-highlighted focus-visible:bg-interactive-negative-highlighted active:bg-interactive-negative-highlighted disabled:bg-interactive-negative-disabled disabled:text-interactive-negative-disabled`,
} satisfies Record<Axis<'color'>, string>;

// Outlined (Blade's `secondary`): a white box in the gray frame, its rim
// darker on hover, press and focus (focus adds the ring), text from Blade's
// getButtonTextColorToken — gray for primary and neutral, the intent's colour
// for positive and negative, each with its own disabled step; disabled keeps
// only the rim, over Blade's white ghost fill.
// The focus ring is the primary one, except neutral's own faded gray.
const OUTLINE =
  'bg-surface-gray-intense shadow-button-outlined hover:shadow-button-outlined-highlighted active:shadow-button-outlined-highlighted focus-visible:outline-none disabled:bg-interactive-static-white-ghost disabled:shadow-button-outlined-disabled';
const OUTLINE_FOCUS = 'focus-visible:shadow-button-outlined-focus';
const OUTLINED = {
  primary: `${OUTLINE} ${OUTLINE_FOCUS} text-interactive-gray-normal disabled:text-interactive-gray-disabled`,
  neutral: `${OUTLINE} focus-visible:shadow-button-outlined-neutral-focus text-interactive-gray-normal disabled:text-interactive-gray-disabled`,
  positive: `${OUTLINE} ${OUTLINE_FOCUS} text-interactive-positive-normal disabled:text-interactive-positive-disabled`,
  negative: `${OUTLINE} ${OUTLINE_FOCUS} text-interactive-negative-normal disabled:text-interactive-negative-disabled`,
} satisfies Record<Axis<'color'>, string>;

const SIZE = {
  xsmall: 'h-8 p-1.5 text-75 leading-50',
  small: 'h-9 p-2 text-100 leading-100',
  medium: 'h-11 p-3 text-200 leading-200',
  large: 'h-12 p-3.5 text-200 leading-200',
} satisfies Record<Axis<'size'>, string>;

// Blade rounds the large button more.
const SHAPE = {
  xsmall: 'rounded-small',
  small: 'rounded-small',
  medium: 'rounded-small',
  large: 'rounded-medium',
} satisfies Record<Axis<'size'>, string>;

// The filled button's sheen, sized to the button.
const SHEEN_SIZE = {
  xsmall: 'before:bg-button-sheen-xsmall',
  small: 'before:bg-button-sheen-small',
  medium: 'before:bg-button-sheen-medium',
  large: 'before:bg-button-sheen-large',
} satisfies Record<Axis<'size'>, string>;

// The busy dots (Button.svelte's loader): small in a link or a small button,
// and in the text colour, which every look sets to read on its fill.
const SMALL_DOTS = 'gap-1 *:w-1 *:h-1';
const DOT_SCALE = {
  xsmall: SMALL_DOTS,
  small: SMALL_DOTS,
  medium: 'gap-2 *:w-2 *:h-2',
  large: 'gap-2 *:w-2 *:h-2',
} satisfies Record<Axis<'size'>, string>;

/** The busy dots' look for the props the button was given. */
export function buttonLoaderLook(props: ButtonStyleProps) {
  const isLink = props.variant ? IS_LINK[props.variant] : false;
  return {
    dot: 'bg-current',
    scale: isLink ? SMALL_DOTS : DOT_SCALE[props.size ?? DEFAULTS.size],
  };
}

// The box looks: filled (`primary`) or outlined (`secondary`); `link` is
// no box and never reaches here (resolveButton).
function boxLook(
  variant: Axis<'variant'>,
  color: Axis<'color'>,
  size: Axis<'size'>
): string {
  return variant === 'primary'
    ? `${FILLED[color]} ${SHEEN_SIZE[size]}`
    : OUTLINED[color];
}

export const resolveButton: ButtonStyleResolver<ButtonStyleProps> = (
  props: ButtonStyleProps = {}
) => {
  const {
    variant = DEFAULTS.variant,
    color = DEFAULTS.color,
    size = DEFAULTS.size,
  } = props;
  // A button that reads as a link: inline-flex, so it takes only its
  // content's width, the look Link has, and none of the box classes — `cx`
  // resolves no conflicts, so they are never mixed.
  const isLink = IS_LINK[variant];
  const root = isLink
    ? `${LINK_ROOT} ${linkLook(color, size)} ${linkDisabled(color, 'native')}`
    : `${ROOT} ${boxLook(variant, color, size)} ${SIZE[size]} ${SHAPE[size]}`;
  return {
    root,
    content: isLink ? CONTENT : BOX_CONTENT,
    busyContent: BUSY_CONTENT,
    loader: LOADER,
    shake: 'animate-shake motion-reduce:animate-none',
    loading: 'pointer-events-none',
    status: 'sr-only',
    // A tint sweeping across: it reads on every variant, where v2's
    // mix-blend fill needed a fixed light ground.
    autoFill: isLink
      ? 'hidden'
      : 'pointer-events-none absolute inset-0 origin-left [scale:var(--progress)_1] bg-current opacity-300 transition-transform duration-2xgentle ease-linear motion-reduce:transition-none',
  };
};
