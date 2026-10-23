import type { AxisValue } from '../../axes';

/**
 * The parts of a Card, as Blade builds it: a root that carries the
 * selection and focus rings, and the surface inside it. Its header, body
 * and footer are its parts' (`../card-children`). A clickable card lays an
 * overlay (a button, or a link) over the surface, so controls inside stay
 * usable.
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
}

/** The second argument: whether the card is selected, which swaps the surface's rim for the ring. */
export type CardStyleResolver<P> = (props: P, isSelected?: boolean) => CardClasses;

/** The blade taxonomy as data. */
export const CARD_AXES = {
  variant: ['primary', 'secondary'],
  padding: ['spacing.0', 'spacing.3', 'spacing.4', 'spacing.5', 'spacing.7'],
} as const;

type Axis<K extends keyof typeof CARD_AXES> = AxisValue<typeof CARD_AXES, K>;

/** Derived from CARD_AXES: add a value there, never here. */
export interface CardStyleProps {
  /**
   * `primary`: Blade's raised white surface. `secondary`: a flat gray one.
   * @default 'primary'
   */
  variant?: Axis<'variant'>;
  /**
   * Around everything in the card, Blade React's values: 0, 8, 12, 16 or
   * 24px. Blade DSL's Card (Figma) is 24px in; 16px is its metric card's.
   * @default 'spacing.7'
   */
  padding?: Axis<'padding'>;
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

// A card is 12px round. The root carries Blade's 2px selection ring; the
// overlay's covering ::before carries the 4px focus ring.
export const resolveCard: CardStyleResolver<CardStyleProps> = (props, isSelected = false) => {
  const { variant = 'primary', padding = 'spacing.7' } = props;
  const surface = SURFACE[variant][isSelected ? 'selected' : 'none'];
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
  };
};
