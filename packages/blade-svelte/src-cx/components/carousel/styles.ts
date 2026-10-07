/**
 * The parts of a Carousel. The track is a native scroll-snap row — touch,
 * wheel and keys scroll it as they would anything — and the dots follow
 * where it rests.
 */
export interface CarouselClasses {
  root: string;
  track: string;
  slide: string;
  dots: string;
  dot: Record<'current' | 'other', string>;
}

export type CarouselStyleResolver<P> = (props: P) => CarouselClasses;

/** One look: no style axes yet. */
export type CarouselStyleProps = Record<never, never>;
export const CAROUSEL_AXES = {} as const;

// Blade DSL's _Carousel Indicators (Figma): 6px dots 4px apart, the current
// one a pill 18px wide; the pill grows into place.
const DOT =
  'h-1.5 rounded-max outline-none [transition-property:width,background-color] duration-moderate ease-standard motion-reduce:transition-none focus-visible:shadow-focus';

// Ported from app/v2/modules/common/components/Carousel.svelte: a snapping
// row with its scrollbar hidden, and a dot per slide.
export const resolveCarousel: CarouselStyleResolver<CarouselStyleProps> = () => ({
  root: 'flex w-full flex-col items-center gap-2 overflow-hidden',
  track:
    'flex w-full scrollbar-none [&::-webkit-scrollbar]:hidden snap-x-mandatory overflow-x-auto overscroll-x-contain',
  slide: 'w-full shrink-0 snap-center',
  dots: 'flex items-center gap-1',
  // Blade's gray indicators (Carousel/Indicators): the current dot filled
  // with the interactive gray-muted icon colour, the rest the moderate
  // overlay; no hover change.
  dot: {
    current: `${DOT} w-[18px] bg-current icon-interactive-gray-muted`,
    other: `${DOT} w-1.5 bg-overlay-moderate`,
  },
});
