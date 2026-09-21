/** Internal link shape used while computing the native Sankey layout. */
export type RechartsLink = {
  source: number;
  target: number;
  value: number;
  _originalIndex: number;
};

/** Positioned node bar computed by the native Sankey layout engine. */
export type NodeLayout = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  depth: number;
};

/**
 * Positioned link ribbon computed by the native Sankey layout engine.
 * Centerline endpoints + thickness (plot coords) are used to hit-test taps
 * against the ribbon since RN has no SVG path point-containment API.
 */
export type LinkLayout = {
  sourceIndex: number;
  targetIndex: number;
  value: number;
  originalIndex: number;
  d: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  thickness: number;
};

/** Full layout output from the native Sankey layout engine. */
export type SankeyLayout = {
  nodeLayouts: NodeLayout[];
  linkLayouts: LinkLayout[];
  countPerDepth: number[];
};
