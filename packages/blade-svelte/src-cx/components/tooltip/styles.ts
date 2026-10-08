import type { Placement, PlacementSide } from '../../runes/layer/placement';

/**
 * The parts of a Tooltip. On web the bubble is measured and placed by
 * TooltipBubble (inline left/top, `--tooltip-arrow` along the anchor-facing
 * edge), so the bubble is styled per resolved side only; native cannot
 * measure into a host and places the bubble with `nativePlacement` classes
 * inside the root.
 */
export interface TooltipClasses {
  /** Wraps the trigger; `class` from the caller lands here. */
  root: string;
  /** The floating element; carries `data-state` for presence. */
  bubble: string;
  /** The heading above the content (`title`). */
  title: string;
  content: string;
  arrow: string;
  /** Applied to the arrow per side the bubble ended up on. */
  arrowSide: Record<PlacementSide, string>;
  /** Native only: applied to the bubble per requested placement. */
  nativePlacement: Record<Placement, string>;
  /** Distance between the trigger and the bubble, in px. */
  gap: number;
}

export type TooltipStyleResolver<P> = (props: P) => TooltipClasses;

/** Blade's tooltip has one look: no style axes yet. */
export type TooltipStyleProps = Record<never, never>;

// Blade's tooltip arrow: 14×7, pointing at the trigger from the bubble's
// facing edge, in the bubble's fill; the bubble sits 4px past its tip.
const ARROW_SIDE: Record<PlacementSide, string> = {
  top:
    'top-full w-[14px] h-[7px] [left:var(--tooltip-arrow)] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
  bottom:
    'bottom-full w-[14px] h-[7px] [left:var(--tooltip-arrow)] -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  left:
    'left-full w-[7px] h-[14px] [top:var(--tooltip-arrow)] -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
  right:
    'right-full w-[7px] h-[14px] [top:var(--tooltip-arrow)] -translate-y-1/2 [clip-path:polygon(100%_0,100%_100%,0_50%)]',
};

// Native renders the bubble inside the root: a static offset per side, a
// static alignment, no flip.
const NATIVE_SIDE: Record<PlacementSide, string> = {
  top: 'bottom-full mb-3',
  bottom: 'top-full mt-3',
  left: 'right-full mr-3',
  right: 'left-full ml-3',
};
const NATIVE_ALIGN = {
  vertical: {
    center: 'left-1/2 -translate-x-1/2 [--tooltip-arrow:50%]',
    start: 'left-0 [--tooltip-arrow:1rem]',
    end: 'right-0 [--tooltip-arrow:calc(100%-1rem)]',
  },
  horizontal: {
    center: 'top-1/2 -translate-y-1/2 [--tooltip-arrow:50%]',
    start: 'top-0 [--tooltip-arrow:1rem]',
    end: 'bottom-0 [--tooltip-arrow:calc(100%-1rem)]',
  },
};

function nativePlacement(): Record<Placement, string> {
  const placements = {} as Record<Placement, string>;
  (Object.keys(NATIVE_SIDE) as PlacementSide[]).forEach((side) => {
    const align = NATIVE_ALIGN[side === 'top' || side === 'bottom' ? 'vertical' : 'horizontal'];
    placements[side] = `${NATIVE_SIDE[side]} ${align.center}`;
    placements[`${side}-start`] = `${NATIVE_SIDE[side]} ${align.start}`;
    placements[`${side}-end`] = `${NATIVE_SIDE[side]} ${align.end}`;
  });
  return placements;
}

/** Shared with the popover and the menu, which float the same way. */
export const NATIVE_PLACEMENT = nativePlacement();

export const resolveTooltip: TooltipStyleResolver<TooltipStyleProps> = () => ({
  root: 'relative inline-flex',
  // Blade's TooltipContent: `popup.background.gray.intense`, 12px round and
  // in, 200px at most, the low raised shadow and the high blur; a semibold
  // body-medium title in static white over the body-small content in its
  // subtle step, 4px apart.
  bubble:
    'pointer-events-auto absolute z-50 flex w-max max-w-[200px] flex-col gap-1 rounded-medium bg-popup-gray-intense p-3 shadow-lowRaised backdrop-blur-high transition-opacity duration-xquick data-[state=closed]:opacity-0 motion-reduce:transition-none',
  title:
    'block font-sans font-semibold text-100 leading-100 tracking-50 text-surface-static-white-normal',
  content:
    'relative z-1 block font-sans font-normal text-75 leading-75 tracking-50 text-surface-static-white-subtle [word-break:break-word]',
  arrow: 'absolute bg-popup-gray-intense',
  arrowSide: ARROW_SIDE,
  nativePlacement: NATIVE_PLACEMENT,
  gap: 12,
});
