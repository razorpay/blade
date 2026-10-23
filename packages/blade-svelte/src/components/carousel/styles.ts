import type { AxisValue } from '../../axes';

/**
 * The parts of a Carousel. The track is a plain CSS scroll-snap row — touch,
 * wheel and keys scroll it as they would anything — and the dots follow
 * where it rests.
 */
export interface CarouselClasses {
  root: string;
  /** The track between the side buttons, if any. */
  body: string;
  track: string;
  slide: string;
  /** Under the slides: the bottom buttons around the dots. */
  controls: string;
  dots: string;
  dot: Record<'current' | 'other', string>;
  /** The phone's round dot, inside each dot button. */
  pip: Record<'current' | 'other', string>;
  /** The auto-play ring round the current phone dot. */
  ring: string;
  /** The previous and next buttons. */
  button: string;
  /** Where the side buttons sit, for each side. */
  side: Record<'previous' | 'next', string>;
}

export type CarouselStyleResolver<P> = (props: P) => CarouselClasses;

/** The blade taxonomy as data. */
export const CAROUSEL_AXES = {
  navigationButtonVariant: ['filled', 'stroked'],
  navigationButtonPosition: ['bottom', 'side', 'side-overlap'],
} as const;

type Axis<K extends keyof typeof CAROUSEL_AXES> = AxisValue<typeof CAROUSEL_AXES, K>;

/** Derived from CAROUSEL_AXES: add a value there, never here. */
export interface CarouselStyleProps {
  /** @default 'filled' */
  navigationButtonVariant?: Axis<'navigationButtonVariant'>;
  /**
   * Under the slides around the dots, or either side of them (`side-overlap`
   * straddles the edge). Phones always have them under the slides.
   * @default 'bottom'
   */
  navigationButtonPosition?: Axis<'navigationButtonPosition'>;
}

// Blade's gray indicators (Carousel/Indicators): the current dot in the
// interactive gray-muted icon colour, the rest the moderate overlay; no
// hover change.
const CURRENT = 'icon-interactive-gray-muted';

// Phones draw Blade's CircularIndicatorButton: a 6px dot in a 12px box, the
// box leaving room for the auto-play ring. From `d:` up, the button itself is
// the pill: 6px, the current one 18px wide, growing into place.
const DOT =
  'relative flex h-3 w-3 shrink-0 items-center justify-center rounded-max bg-transparent p-0 outline-none focus-visible:shadow-focus d:h-1.5 [transition-property:width] duration-gentle ease-standard motion-reduce:transition-none';
const PIP = 'h-1.5 w-1.5 rounded-max d:hidden';

// Blade's NavigationButton: round, 8px around a chevron, a thin faded gray
// rim; `filled` is white and raised, `stroked` a white wash.
const BUTTON =
  'flex shrink-0 items-center justify-center self-center rounded-max border-thin border-solid border-interactive-gray-faded p-2 outline-none transition-[color,box-shadow] duration-xquick ease-standard motion-reduce:transition-none focus-visible:shadow-focus';

const BUTTON_VARIANT: Record<Axis<'navigationButtonVariant'>, string> = {
  filled:
    'shadow-lowRaised bg-interactive-static-white-default text-interactive-static-black-muted hover:bg-interactive-static-white-highlighted active:bg-interactive-static-white-highlighted focus-visible:bg-interactive-static-white-highlighted',
  stroked:
    'bg-interactive-static-white-faded icon-interactive-gray-normal hover:bg-interactive-static-white-faded-highlighted active:bg-interactive-static-white-faded-highlighted focus-visible:bg-interactive-static-white-faded-highlighted',
};

// `side-overlap` hangs half a 34px button past each edge.
const SIDE: Record<Axis<'navigationButtonPosition'>, Record<'previous' | 'next', string>> = {
  bottom: { previous: '', next: '' },
  side: { previous: 'hidden d:flex', next: 'hidden d:flex' },
  'side-overlap': {
    previous: 'hidden d:flex absolute left-[-17px] z-1',
    next: 'hidden d:flex absolute right-[-17px] z-1',
  },
};

// Ported from app/v2/modules/common/components/Carousel.svelte: a snapping
// row with its scrollbar hidden, laid out as Blade's (Carousel.web.tsx):
// slides 12px apart, 16px from `d:` up, and the controls 24px below,
// 12px around the dots.
export const resolveCarousel: CarouselStyleResolver<CarouselStyleProps> = (props = {}) => {
  const { navigationButtonVariant = 'filled', navigationButtonPosition = 'bottom' } = props;
  return {
    root: 'flex w-full flex-col items-center',
    body: 'relative flex h-full w-full flex-row items-center gap-3',
    track:
      'flex h-full w-full min-w-0 items-start gap-3 d:gap-4 scrollbar-none snap-x-mandatory overflow-x-auto overscroll-x-contain',
    slide: 'h-full w-full shrink-0 snap-start',
    controls: 'mt-6 flex items-center gap-3',
    dots: 'flex items-center gap-1',
    dot: {
      current: `${DOT} ${CURRENT} d:w-[18px] d:bg-current`,
      other: `${DOT} d:w-1.5 d:bg-overlay-moderate`,
    },
    pip: {
      current: `${PIP} bg-current`,
      other: `${PIP} bg-overlay-moderate`,
    },
    ring: 'pointer-events-none absolute inset-0 h-3 w-3 d:hidden',
    button: `${BUTTON} ${BUTTON_VARIANT[navigationButtonVariant]}`,
    side: SIDE[navigationButtonPosition],
  };
};
