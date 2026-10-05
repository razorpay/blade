export type PlacementSide = 'top' | 'bottom' | 'left' | 'right';
export type PlacementAlign = 'start' | 'end';
export type Placement = PlacementSide | `${PlacementSide}-${PlacementAlign}`;

export interface PlacementRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PlaceOptions {
  /** The element the floating one points at. */
  anchor: PlacementRect;
  floating: { width: number; height: number };
  /** The frame the floating element must stay inside. */
  boundary: PlacementRect;
  placement: Placement;
  /** Distance between the anchor and the floating element. */
  gap?: number;
}

export interface Placed {
  /** Top-left of the floating element, in the rects' coordinate space. */
  x: number;
  y: number;
  /** The side it ended up on: the opposite one when the wanted side lacks room. */
  side: PlacementSide;
  /**
   * Where the arrow sits along the floating element's anchor-facing edge,
   * from that edge's start, so it still points at the anchor's centre
   * after a clamp.
   */
  arrow: number;
}

const OPPOSITE: Record<PlacementSide, PlacementSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/** Pure anchored positioning: flip on the main axis, clamp on the cross axis. */
export function place(options: PlaceOptions): Placed {
  const { anchor, floating, boundary, gap = 0 } = options;
  const [wanted, align] = options.placement.split('-') as [
    PlacementSide,
    PlacementAlign | undefined,
  ];
  const vertical = wanted === 'top' || wanted === 'bottom';

  // Main axis: distance from the anchor, on the side that has room.
  const mainStart = vertical ? 'top' : 'left';
  const mainSize = vertical ? 'height' : 'width';
  const before = (side: PlacementSide): boolean => side === 'top' || side === 'left';
  const mainFor = (side: PlacementSide): number =>
    before(side)
      ? anchor[mainStart] - gap - floating[mainSize]
      : anchor[mainStart] + anchor[mainSize] + gap;
  const fits = (side: PlacementSide): boolean => {
    const at = mainFor(side);
    return (
      at >= boundary[mainStart] &&
      at + floating[mainSize] <= boundary[mainStart] + boundary[mainSize]
    );
  };
  const side = !fits(wanted) && fits(OPPOSITE[wanted]) ? OPPOSITE[wanted] : wanted;
  const main = mainFor(side);

  // Cross axis: aligned to the anchor, kept inside the boundary.
  const crossStart = vertical ? 'left' : 'top';
  const crossSize = vertical ? 'width' : 'height';
  let cross = anchor[crossStart] + (anchor[crossSize] - floating[crossSize]) / 2;
  if (align === 'start') {
    cross = anchor[crossStart];
  } else if (align === 'end') {
    cross = anchor[crossStart] + anchor[crossSize] - floating[crossSize];
  }
  cross = clamp(
    cross,
    boundary[crossStart],
    boundary[crossStart] + boundary[crossSize] - floating[crossSize],
  );
  const arrow = clamp(anchor[crossStart] + anchor[crossSize] / 2 - cross, 0, floating[crossSize]);

  return vertical ? { x: cross, y: main, side, arrow } : { x: main, y: cross, side, arrow };
}
