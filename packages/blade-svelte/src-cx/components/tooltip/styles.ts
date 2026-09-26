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

const ARROW_SIDE: Record<PlacementSide, string> = {
  top: '-bottom-1 [left:var(--tooltip-arrow)] -translate-x-1/2',
  bottom: '-top-1 [left:var(--tooltip-arrow)] -translate-x-1/2',
  left: '-right-1 [top:var(--tooltip-arrow)] -translate-y-1/2',
  right: '-left-1 [top:var(--tooltip-arrow)] -translate-y-1/2',
};

// Native renders the bubble inside the root: a static offset per side, a
// static alignment, no flip.
const NATIVE_SIDE: Record<PlacementSide, string> = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
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
    const align =
      NATIVE_ALIGN[
        side === 'top' || side === 'bottom' ? 'vertical' : 'horizontal'
      ];
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
  bubble:
    'pointer-events-auto absolute z-50 w-max max-w-60 rounded-small bg-popup-gray-intense px-2 py-1 text-25 leading-50 text-surface-static-white-subtle shadow-lowRaised backdrop-blur-high transition-opacity duration-xquick data-[state=closed]:opacity-0 motion-reduce:transition-none',
  content: 'relative z-1 block',
  arrow: 'absolute h-2 w-2 rotate-45 bg-popup-gray-intense',
  arrowSide: ARROW_SIDE,
  nativePlacement: NATIVE_PLACEMENT,
  gap: 8,
});
