import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import type { BoxProps } from '~components/Box';

export type SankeyDataNode = {
  /** Unique identifier — used in link `source`/`target` references */
  id: string;
  /** Human-readable label shown in node tooltips and label chips */
  name: string;
  /** Optional typed Blade color token override, e.g. 'data.background.categorical.blue.moderate' */
  color?: ChartsCategoricalColorToken;
  /**
   * Whether `groupNodesBelow` may fold this node into its column's "Other" node.
   * Set to `false` on nodes that must always stay visible, e.g. outcome statuses.
   * Root nodes (no incoming links) are never grouped regardless of this flag.
   *
   * **Web-only.**
   *
   * @default true
   */
  isGroupable?: boolean;
};

/** A column's grouped nodes, as reported to `onExpandChange` */
export type SankeyGroupExpandEvent = {
  /** Column depths of every group that is expanded after this change */
  expandedGroupDepths: number[];
  /**
   * Zero-based column depth of the group that was toggled (the leftmost column is 0).
   * Groups are keyed by their column depth — at most one group per column — mirroring
   * Accordion's numeric `expandedIndex`, so no internal identifier scheme is
   * part of the public API.
   */
  groupDepth: number;
  isExpanded: boolean;
  /** Ids of the nodes folded into the toggled group */
  memberIds: string[];
};

export type SankeyDataLink = {
  /** id of the source node */
  source: string;
  /** id of the target node */
  target: string;
  /** Flow magnitude — determines ribbon thickness between source and target */
  value: number;
};

export type ChartSankeyWrapperProps = {
  /** Must contain exactly one `<ChartSankey>` element */
  children: React.ReactElement;
  /** Show a tooltip when hovering over a node or link ribbon. Default: true */
  showTooltip?: boolean;
  /**
   * Colour palette to use for auto-assigned node colours.
   * @default 'categorical'
   */
  colorTheme?: ColorTheme;
  /** Override all node bar colors with a single Blade token */
  nodeColorOverride?: ChartsCategoricalColorToken;
  /** Override all link ribbon colors with a single Blade token */
  linkColorOverride?: ChartsCategoricalColorToken;
  /**
   * Flow direction of the diagram.
   *
   * **Native-only.** The web SankeyChart always renders horizontally and ignores
   * this prop; it is consumed exclusively by `SankeyChart.native.tsx`. Vertical
   * (top-to-bottom) reads more clearly on tall phone screens.
   *
   * - `'horizontal'` — stages flow left → right (default, matches web)
   * - `'vertical'` — stages flow top → bottom (native only)
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
} & TestID &
  DataAnalyticsAttribute &
  BoxProps;

export type ChartSankeyProps = {
  /** Flat node list + directed flow connections, referenced by node id */
  data: {
    nodes: SankeyDataNode[];
    links: SankeyDataLink[];
  };
  /** Show labels to the right of each node bar. Default: true */
  showLabels?: boolean;
  /**
   * When true (default), labels render as Blade-styled chips with value + percentage.
   * When false, renders the same information as plain SVG text without chip background.
   */
  showLabelChip?: boolean;
  /**
   * When true (default), the percentage of total flow is shown alongside the value in each label.
   * When false, only the humanized value (and optional unit) is shown.
   */
  showPercentage?: boolean;
  /** Unit appended to node value in label chip, e.g. "txn" or "₹M" */
  labelUnit?: string;
  /**
   * Vertical density of the node labels.
   *
   * - `'normal'` — 28px chips with 8px vertical padding (default).
   * - `'compact'` — 20px chips with 4px vertical padding. Use when a column stacks many thin
   *   nodes, so neighbouring labels have room before they touch.
   *
   * Labels are always a single line; a name that does not fit the chip is truncated with an
   * ellipsis and shown in full in the tooltip.
   *
   * **Web-only.** The native SankeyChart ignores this prop.
   *
   * @default 'normal'
   */
  labelDensity?: 'normal' | 'compact';
  /**
   * When true, each label starts with a small dot filled with the node's colour, so a label
   * can be matched to its bar and ribbons at a glance — useful when labels sit away from thin bars.
   *
   * **Web-only.** The native SankeyChart ignores this prop.
   *
   * @default false
   */
  showColorIndicator?: boolean;
  /**
   * Custom value formatter for node labels.
   * Defaults to Indian number notation (k / L / Cr).
   *
   * **Default truncates, not rounds** — e.g. `14999999` → `"1.49Cr"`, not `"1.5Cr"`.
   * This is intentional to avoid overstating values. Provide a custom formatter
   * if standard rounding is preferred.
   *
   * @example formatValue={(v) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(v)}
   */
  formatValue?: (value: number) => string;
  /**
   * Groups every node whose share of the total is below this percentage into one "Other" node
   * per column, so a long tail of thin nodes no longer crowds the chart. The share uses the
   * same denominator as the label percentage: the total outflow of the root nodes.
   *
   * - A group needs at least two members; a lone small node stays as it is.
   * - Root nodes and nodes with `isGroupable: false` are never grouped.
   * - Clicking a group (or pressing Enter/Space on it) reveals its members in place: bars and
   *   ribbons keep their size, every revealed node gets room for its label, and the drawing
   *   grows below the container. Wrap `ChartSankeyWrapper` in a `Box` with a fixed height and
   *   `overflowY="auto"` to let it scroll. Clicking a revealed node's label folds the group again.
   *
   * Recommended values: `2` or `5`. Unset turns grouping off.
   *
   * **Web-only.** The native SankeyChart ignores this prop.
   */
  groupNodesBelow?: number;
  /**
   * Label of a group node. Receives the group's zero-based column depth (`groupDepth`, as on
   * `onExpandChange`) and the grouped nodes.
   * @default ({ members }) => `Other (${members.length})`
   */
  formatGroupLabel?: (group: { groupDepth: number; members: SankeyDataNode[] }) => string;
  /**
   * Column depths of the groups that start expanded (uncontrolled). A group's key is its
   * zero-based column depth as drawn (the leftmost column is 0; a node with no outgoing flow
   * sits in the last column) — at most one group exists per column, mirroring Accordion's
   * numeric `defaultExpandedIndex`. A depth without a group is ignored.
   */
  defaultExpandedGroupDepths?: number[];
  /**
   * Column depths of the expanded groups (controlled). Pass `[]` to fold everything.
   * Keyed by depth like `defaultExpandedGroupDepths`.
   */
  expandedGroupDepths?: number[];
  /** Called when a group is expanded or folded, by click or keyboard */
  onExpandChange?: (event: SankeyGroupExpandEvent) => void;
  /**
   * Called when a node bar is clicked. Receives the node data and its zero-based index in
   * `data.nodes`. Not called for a synthetic group node — use `onExpandChange` for those.
   */
  onNodeClick?: (node: SankeyDataNode, index: number) => void;
  /**
   * Called when the user clicks a link ribbon. Gets the link data and its index. Not called for a
   * ribbon merged into a group node; use `onExpandChange` for those.
   */
  onLinkClick?: (link: SankeyDataLink, index: number) => void;
};

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
