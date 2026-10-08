import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';

/**
 * Why the button is busy: the consumer's `isLoading` prop (`host`), the
 * model settling an async `onClick` (`press`), or the enclosing form's
 * submission — Enter-key submissions included (`form`).
 */
import type { ButtonBusyCause } from '../../runes/button/press.svelte';

/**
 * The parts Button toggles from JS. Static class strings only; interaction
 * states use the variant grammar (`hover:`, `active:`, `disabled:`) so
 * native needs no bridge round-trip — the parts below are the states the
 * grammar lacks.
 */
export interface ButtonClasses {
  root: string;
  /**
   * The row: the leading icon, the label and the trailing icon, with no gap
   * between them — the label's own 4px each side is the gap.
   */
  content: string;
  /** Around the children: 4px each side, the icon gap and the text inset. */
  label: string;
  /** The leading and trailing icons' size: 12px to small, 16px above; 16px icon-only. */
  iconSize: 'small' | 'medium';
  /**
   * Applied to `content` while busy: the children stay rendered, so the
   * button keeps its width and its accessible name, but read as gone.
   */
  busyContent: string;
  /** The layer over `content` that holds Blade's DotLoader. */
  loader: string;
  /** One loader dot; `--lift` is how far it rises. */
  dot: string;
  /**
   * Per dot, in order: Blade's 150ms stagger, and under reduced motion the
   * middle dot held at its peak.
   */
  dotStep: [string, string, string];
  /** Applied to the root while a blocked/invalid press shakes. */
  shake: string;
  /** Applied to the root while busy: presses are swallowed, focus stays. */
  busy: string;
  /** Visually-hides the live-region label announcing the busy state. */
  status: string;
  /**
   * Drawn while `autoPressAfter` counts: the button sets `--progress` (0..1,
   * the elapsed share) on it, once a second.
   */
  autoFill: string;
}

/**
 * The second argument: whether the button is an icon and no label, which
 * Figma draws as a square of the button's height.
 */
export type ButtonStyleResolver<P> = (props: P, isIconOnly?: boolean) => ButtonClasses;

export type { ButtonBusyCause };

/** The shape of Button's busy loader, kept for consumers of the type. */
export type ButtonLoaderSnippet<P> = Snippet<[P, Snippet, ButtonBusyCause]>;

/** The blade taxonomy as data. */
export const BUTTON_AXES = {
  // Blade DSL's Button (Figma) marks tertiary deprecated: not ported.
  variant: ['primary', 'secondary'],
  color: ['primary', 'white', 'neutral', 'positive', 'negative'],
  size: ['xsmall', 'small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof BUTTON_AXES> = AxisValue<typeof BUTTON_AXES, K>;
type Variant = Axis<'variant'>;
type Color = Axis<'color'>;
type Size = Axis<'size'>;

/** Derived from BUTTON_AXES: add a value there, never here. */
export interface ButtonStyleProps {
  /** @default 'primary' */
  variant?: Variant;
  /** @default 'primary' */
  color?: Color;
  /** @default 'medium' */
  size?: Size;
}

// Blade's Button, colour by variant by state (Button/buttonTokens.ts). Hover,
// press and keyboard focus all take the highlighted step; disabled (and
// busy, which disables) its own. Borders are inset shadows, baked into named
// shadows in uno.config.ts; focus draws the highlighted frame under Blade's
// 4px ring as one box-shadow. Width is the caller's (`class="w-full"`).
const ROOT =
  'group relative inline-flex items-center justify-center overflow-hidden border-none font-sans font-semibold no-underline [transition-property:background-color,box-shadow] duration-xquick ease-standard disabled:cursor-not-allowed';
// The content presses to 95% (Blade's AnimatedButtonContent); positioned,
// it paints over the sheen.
const CONTENT =
  'relative z-1 flex flex-1 flex-row items-center justify-center whitespace-nowrap group-active:enabled:scale-95';

// The filled button's resting sheen, from its top-left corner, gone on
// hover, press and focus as the fill darkens.
const SHEEN =
  'before:content-empty before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:transition-opacity before:duration-xquick before:ease-standard hover:before:opacity-0 focus-visible:before:opacity-0 active:before:opacity-0 disabled:before:opacity-0';

// Literal per colour: Uno extracts class names from source, so none may be
// built by interpolation.
const FRAME = {
  primary:
    'shadow-button-primary hover:shadow-button-primary-highlighted active:shadow-button-primary-highlighted focus-visible:shadow-button-primary-focus',
  neutral:
    'shadow-button-neutral hover:shadow-button-neutral-highlighted active:shadow-button-neutral-highlighted focus-visible:shadow-button-neutral-focus',
  positive:
    'shadow-button-positive hover:shadow-button-positive-highlighted active:shadow-button-positive-highlighted focus-visible:shadow-button-positive-focus',
  negative:
    'shadow-button-negative hover:shadow-button-negative-highlighted active:shadow-button-negative-highlighted focus-visible:shadow-button-negative-focus',
};
const FILLED_FRAME = 'focus-visible:outline-none disabled:shadow-none';

// Filled (`primary`): the colour's fill and frame, white text (neutral's own
// on-neutral text; white's is black).
const FILLED: Record<Color, string> = {
  primary: `${SHEEN} ${FRAME.primary} ${FILLED_FRAME} bg-interactive-primary-default text-interactive-on-primary-normal hover:bg-interactive-primary-highlighted focus-visible:bg-interactive-primary-highlighted active:bg-interactive-primary-highlighted disabled:bg-interactive-primary-disabled disabled:text-interactive-primary-disabled`,
  neutral: `${SHEEN} ${FRAME.neutral} ${FILLED_FRAME} bg-interactive-neutral-default text-interactive-on-neutral-normal hover:bg-interactive-neutral-highlighted focus-visible:bg-interactive-neutral-highlighted active:bg-interactive-neutral-highlighted disabled:bg-interactive-neutral-disabled disabled:text-interactive-on-neutral-disabled`,
  positive: `${SHEEN} ${FRAME.positive} ${FILLED_FRAME} bg-interactive-positive-default text-interactive-static-white-normal hover:bg-interactive-positive-highlighted focus-visible:bg-interactive-positive-highlighted active:bg-interactive-positive-highlighted disabled:bg-interactive-positive-disabled disabled:text-interactive-positive-disabled`,
  negative: `${SHEEN} ${FRAME.negative} ${FILLED_FRAME} bg-interactive-negative-default text-interactive-static-white-normal hover:bg-interactive-negative-highlighted focus-visible:bg-interactive-negative-highlighted active:bg-interactive-negative-highlighted disabled:bg-interactive-negative-disabled disabled:text-interactive-negative-disabled`,
  white:
    'shadow-button-white focus-visible:shadow-button-white-focus focus-visible:outline-none disabled:shadow-none bg-interactive-static-white-default text-interactive-static-black-muted hover:bg-interactive-static-white-highlighted focus-visible:bg-interactive-static-white-highlighted active:bg-interactive-static-white-highlighted disabled:bg-interactive-static-white-disabled disabled:text-interactive-static-black-disabled',
};

// Outlined (`secondary`): a white
// box in the gray frame, its rim darker on hover, press and focus; the text
// gray for primary, the colour's own for the rest. Neutral rings in its own
// faded gray.
const OUTLINE =
  'bg-surface-gray-intense shadow-button-outlined hover:shadow-button-outlined-highlighted active:shadow-button-outlined-highlighted focus-visible:outline-none disabled:bg-interactive-static-white-ghost disabled:shadow-button-outlined-disabled';
const OUTLINE_FOCUS = 'focus-visible:shadow-button-outlined-focus';
const OUTLINED: Record<Color, string> = {
  primary: `${OUTLINE} ${OUTLINE_FOCUS} text-interactive-gray-normal disabled:text-interactive-gray-disabled`,
  neutral: `${OUTLINE} focus-visible:shadow-button-outlined-neutral-focus text-interactive-neutral-normal disabled:text-interactive-neutral-disabled`,
  positive: `${OUTLINE} ${OUTLINE_FOCUS} text-interactive-positive-normal disabled:text-interactive-positive-disabled`,
  negative: `${OUTLINE} ${OUTLINE_FOCUS} text-interactive-negative-normal disabled:text-interactive-negative-disabled`,
  // On a dark surface: a faint white box in a white rim, white text.
  white:
    'bg-interactive-static-white-faded shadow-button-white-outlined hover:bg-interactive-static-black-faded active:bg-interactive-static-black-faded focus-visible:bg-interactive-static-black-faded focus-visible:shadow-button-white-outlined-focus focus-visible:outline-none disabled:bg-interactive-gray-disabled disabled:shadow-button-white-outlined-disabled text-interactive-static-white-normal disabled:text-interactive-static-white-disabled',
};

// Blade DSL's Button (Figma): a min height (28/32/36/48px), side padding
// (the label adds 4px more each side, its own, which is also the icon gap),
// the label Semi Bold in body small/medium/large, letter-spaced, and a 12px
// radius at large, 8px below.
const SIZE: Record<Size, string> = {
  xsmall: 'min-h-7 px-2 text-75 leading-75 tracking-50 rounded-small',
  small: 'min-h-8 px-2 text-75 leading-75 tracking-50 rounded-small',
  medium: 'min-h-9 px-3 text-100 leading-100 tracking-50 rounded-small',
  large: 'min-h-12 px-4 text-200 leading-200 tracking-25 rounded-medium',
};
// Icon only: a square of the button's height around a 16px glyph, no padding.
const ICON_ONLY_SIZE: Record<Size, string> = {
  xsmall: 'w-7 h-7 rounded-small',
  small: 'w-8 h-8 rounded-small',
  medium: 'w-9 h-9 rounded-small',
  large: 'w-12 h-12 rounded-medium',
};
const ICON_SIZE: Record<Size, ButtonClasses['iconSize']> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

// The filled button's sheen, sized to the button.
const SHEEN_SIZE: Record<Size, string> = {
  xsmall: 'before:bg-button-sheen-xsmall',
  small: 'before:bg-button-sheen-small',
  medium: 'before:bg-button-sheen-medium',
  large: 'before:bg-button-sheen-large',
};

// Blade's DotLoader: medium in every button but large, which takes large.
const DOTS: Record<Size, { loader: string; dot: string }> = {
  xsmall: { loader: 'gap-0.5', dot: 'w-1 h-1 [--lift:5px]' },
  small: { loader: 'gap-0.5', dot: 'w-1 h-1 [--lift:5px]' },
  medium: { loader: 'gap-0.5', dot: 'w-1 h-1 [--lift:5px]' },
  large: { loader: '[gap:3px]', dot: 'w-1.5 h-1.5 [--lift:7.5px]' },
};

// The dots' colour (they fill with `currentColor`): the colour's subtle icon
// on a fill, gray on an outline, white on white, neutral's on-neutral.
const DOT_COLOR: Record<'filled' | 'outlined', Record<Color, string>> = {
  filled: {
    primary: 'icon-interactive-primary-subtle',
    neutral: 'icon-interactive-on-neutral-normal',
    positive: 'icon-interactive-positive-subtle',
    negative: 'icon-interactive-negative-subtle',
    white: 'icon-interactive-static-white-subtle',
  },
  outlined: {
    primary: 'icon-interactive-gray-muted',
    neutral: 'icon-interactive-gray-muted',
    positive: 'icon-interactive-positive-subtle',
    negative: 'icon-interactive-negative-subtle',
    white: 'icon-interactive-static-white-subtle',
  },
};

export const resolveButton: ButtonStyleResolver<ButtonStyleProps> = (
  props: ButtonStyleProps = {},
  isIconOnly = false,
) => {
  const { variant = 'primary', size = 'medium' } = props;
  const color: Color = props.color ?? 'primary';
  const kind = variant === 'primary' ? 'filled' : 'outlined';
  const look =
    kind === 'filled'
      ? `${FILLED[color]} ${color === 'white' ? '' : SHEEN_SIZE[size]}`
      : OUTLINED[color];
  const dots = DOTS[size];
  return {
    root: `${ROOT} ${look} ${isIconOnly ? ICON_ONLY_SIZE[size] : SIZE[size]}`.replace(/\s+/g, ' '),
    content: CONTENT,
    label: 'px-1',
    iconSize: isIconOnly ? 'medium' : ICON_SIZE[size],
    busyContent: 'opacity-0',
    loader: `absolute inset-0 z-1 flex items-center justify-center ${dots.loader}`,
    dot: `rounded-max bg-current [opacity:0.42] animate-dot motion-reduce:animate-none ${dots.dot} ${DOT_COLOR[kind][color]}`,
    dotStep: [
      '',
      '[animation-delay:150ms] motion-reduce:translate-y-[calc(var(--lift)*-1)] motion-reduce:[opacity:1]',
      '[animation-delay:300ms]',
    ],
    shake: 'animate-shake motion-reduce:animate-none',
    busy: 'pointer-events-none',
    status: 'sr-only',
    // A tint sweeping across: it reads on every variant.
    autoFill:
      'pointer-events-none absolute inset-0 origin-left scale-x-[var(--progress)] bg-current opacity-blade-300 transition-transform duration-2xgentle ease-linear motion-reduce:transition-none',
  };
};
