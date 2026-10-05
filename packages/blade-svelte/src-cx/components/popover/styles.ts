import type { Placement, PlacementSide } from '../../runes/layer/placement';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The parts of a floating panel. On web the panel is measured and placed by
 * PopoverPanel (inline left/top) inside the LayerHost; native cannot measure
 * into a host and places it with `nativePlacement` classes inside the root.
 * Enter/exit ride the panel's `data-state`, as everywhere. Popover and Menu
 * share it.
 */
export interface PopoverClasses {
  /** Wraps the trigger; `class` from the caller lands here. */
  root: string;
  /** The floating element. */
  panel: string;
  /** Native only: applied to the panel per requested placement. */
  nativePlacement: Record<Placement, string>;
  /** Distance between the trigger and the panel, in px. */
  gap: number;
  /**
   * The arrow toward the trigger, when the panel has one; PopoverPanel
   * sets `--popover-arrow` to where it sits along the facing edge.
   */
  arrow?: string;
  /** Applied to the arrow per side the panel ended up on. */
  arrowSide?: Record<PlacementSide, string>;
}

/** Popover's own content parts, inside the panel. */
export interface PopoverContentClasses {
  /** The main block (header and content) and the footer, 16px apart. */
  layout: string;
  /** The header and the content, 4px apart. */
  main: string;
  /** Title leading, title and close button in a row. */
  header: string;
  title: string;
  /** The close button beside the title. */
  close: string;
  /** With no title, the close button floats in the panel's corner. */
  floatingClose: string;
}

export type PopoverLook = PopoverClasses & { content: PopoverContentClasses };

export type PopoverStyleResolver<P> = (props: P) => PopoverClasses;

/** One look: no style axes yet. */
export type PopoverStyleProps = Record<never, never>;
export const POPOVER_AXES = {} as const;

// Blade's PopoverContentWrapper: the popup fill, 16px round, the popup
// shadow (a 1px rim drawn inside over the raised shadow), the high backdrop
// blur; 328px at most (288px on phones).
export const POPOVER_PANEL =
  'pointer-events-auto absolute z-50 rounded-large bg-popup-gray-moderate text-surface-gray-normal shadow-dropdown backdrop-blur-high outline-none transition-all duration-xquick ease-entrance data-[state=closed]:scale-95 data-[state=closed]:opacity-0 motion-reduce:transition-none';

// Blade's popover arrow: 22×12, pointing at the trigger from the panel's
// facing edge, in the panel's fill; the panel sits 4px past its tip.
const ARROW = 'absolute bg-popup-gray-moderate';
const ARROW_SIDE: Record<PlacementSide, string> = {
  top:
    'top-full w-[22px] h-3 [left:var(--popover-arrow)] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
  bottom:
    'bottom-full w-[22px] h-3 [left:var(--popover-arrow)] -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  left:
    'left-full w-3 h-[22px] [top:var(--popover-arrow)] -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
  right:
    'right-full w-3 h-[22px] [top:var(--popover-arrow)] -translate-y-1/2 [clip-path:polygon(100%_0,100%_100%,0_50%)]',
};

// Blade's IconButton, medium: a 16px muted glyph, subtle on hover and
// focus, with the 4px focus ring.
const CLOSE =
  'flex shrink-0 items-center justify-center rounded-2xsmall border-none bg-transparent p-0 icon-interactive-gray-muted transition-colors duration-xquick ease-standard hover:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted';

export const resolvePopover = (_props: PopoverStyleProps = {}): PopoverLook => ({
  root: 'relative inline-flex',
  panel: `${POPOVER_PANEL} w-max max-w-[288px] m:max-w-[328px]`,
  nativePlacement: NATIVE_PLACEMENT,
  gap: 16,
  arrow: ARROW,
  arrowSide: ARROW_SIDE,
  // Blade's PopoverContent: 16px in, the footer 16px under; the header 4px
  // over the content; leading, title and close 8px apart, the title large
  // semibold with 12px after it.
  content: {
    layout: 'flex flex-col gap-4 p-4',
    main: 'flex flex-col gap-1',
    header: 'flex items-center gap-2',
    title:
      'm-0 pr-3 font-text font-semibold text-200 leading-200 tracking-25 text-surface-gray-normal',
    close: `ms-auto ${CLOSE}`,
    floatingClose: `absolute top-3 right-3 z-1 rounded-max p-2 ${CLOSE}`,
  },
});
