import type { PlacementSide } from '../../runes/layer/placement';

/**
 * The parts of a Tooltip. The bubble is measured and placed by
 * TooltipBubble (inline left/top, `--tooltip-arrow` along the anchor-facing
 * edge), so the bubble is styled per resolved side only.
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
  gap: 12,
});
