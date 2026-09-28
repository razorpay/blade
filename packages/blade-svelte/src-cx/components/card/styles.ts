import type { AxisValue } from '../../axes';
import { INTENTS, INTENT_SUBTLE } from '../shared/intent';

/**
 * The parts of a Card, as Blade builds it: a root that carries the
 * selection and focus rings, the surface inside it, and the header and
 * footer sections with their hairlines. A clickable card lays an overlay (a
 * button, or a link) over the surface, so controls inside stay usable.
 */
export interface CardClasses {
  /** `class` from the caller lands here. */
  root: string;
  /** The ring: selected, or none. */
  ring: Record<'selected' | 'none', string>;
  /** Applied to the root while disabled. */
  disabled: string;
  surface: string;
  /** Wraps the content: its own links and buttons sit above the overlay. */
  content: string;
  /** The button or link stretched over the whole card. */
  overlay: string;
  header: string;
  footer: string;
}

/** The second argument: whether the card is selected, which swaps the surface's rim for the ring. */
export type CardStyleResolver<P> = (
  props: P,
  isSelected?: boolean
) => CardClasses;

/** The blade taxonomy as data. */
export const CARD_AXES = {
  variant: ['primary', 'secondary'],
  padding: ['spacing.0', 'spacing.3', 'spacing.4', 'spacing.5', 'spacing.7'],
  color: INTENTS,
} as const;

type Axis<K extends keyof typeof CARD_AXES> = AxisValue<typeof CARD_AXES, K>;

/** Derived from CARD_AXES: add a value there, never here. */
export interface CardStyleProps {
  /**
   * `primary`: Blade's raised white surface. `secondary`: a flat gray one.
   * @default 'primary'
   */
  variant?: Axis<'variant'>;
  /** Around everything in the card: 0, 8, 12, 16 or 24px. @default 'spacing.7' */
  padding?: Axis<'padding'>;
  /** A tinted card (v2's MagicCard tones); unset keeps the variant's surface. */
  color?: Axis<'color'>;
}

const PADDING: Record<Axis<'padding'>, string> = {
  'spacing.0': 'p-0',
  'spacing.3': 'p-2',
  'spacing.4': 'p-3',
  'spacing.5': 'p-4',
  'spacing.7': 'p-6',
};

// Blade's surfaces: the raised white one (makeSurfaceStyles: rim, shadow,
// gradients; the rim goes when selected), or the flat gray one.
const SURFACE: Record<Axis<'variant'>, Record<'selected' | 'none', string>> = {
  primary: {
    none: 'bg-surface-gray-intense surface-raised',
    selected: 'bg-surface-gray-intense surface-raised-borderless',
  },
  secondary: {
    none: 'border-none bg-surface-gray-moderate',
    selected: 'border-none bg-surface-gray-moderate',
  },
};

const DIVIDER = 'border-solid border-surface-gray-muted';

// A card is 12px round. The root carries Blade's 2px selection ring; the
// overlay's covering ::before carries the 4px focus ring.
export const resolveCard: CardStyleResolver<CardStyleProps> = (
  props,
  isSelected = false
) => {
  const { variant = 'primary', padding = 'spacing.7', color } = props;
  const state = isSelected ? 'selected' : 'none';
  const surface = color
    ? `border-thin border-solid ${INTENT_SUBTLE[color]}`
    : SURFACE[variant][state];
  return {
    root: 'relative block rounded-medium text-surface-gray-normal',
    ring: {
      none: '',
      selected: 'outline-solid outline-thicker outline-surface-primary-normal',
    },
    disabled: 'cursor-not-allowed',
    surface: `relative flex w-full flex-col rounded-medium text-start ${PADDING[padding]} ${surface}`,
    // Blade's LinkOverlay: an unstyled control whose ::before covers the
    // card; controls inside the card sit above it (`relative z-2`).
    overlay:
      'static cursor-pointer border-none bg-transparent p-0 outline-none before:content-empty before:absolute before:inset-0 before:z-1 before:rounded-medium before:transition-shadow before:duration-2xquick before:ease-standard focus-visible:before:shadow-focus',
    content:
      'contents [&_a]:relative [&_a]:z-5 [&_button]:relative [&_button]:z-5 [&_label]:relative [&_label]:z-5',
    // Blade's CardHeader and CardFooter: 12px to the hairline, 12px past it.
    header: `mb-3 border-b-thin pb-3 ${DIVIDER}`,
    footer: `mt-3 border-t-thin pt-3 ${DIVIDER}`,
  };
};
