// `import type` is erased at compile time — it produces no runtime dependency
// on recharts in the native bundle. The native `payload` variant resolves to
// `undefined` (see Platform.Select below), so recharts types are never
// referenced at runtime on native. This matches the pattern used in
// DonutChart/types.ts. Moving the import to a web-only file would fragment
// the shared type definition and is not worth the trade-off.
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { Platform } from '~utils';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import type { BoxProps } from '~components/Box';

export type SankeyDataNode = {
  /** Unique identifier — used in link `source`/`target` references */
  id: string;
  /** Human-readable label shown in node tooltips and label chips */
  name: string;
  /** Optional typed Blade color token override, e.g. 'data.background.categorical.blue.moderate' */
  color?: ChartsCategoricalColorToken;
};

export type SankeyDataLink = {
  /** id of the source node */
  source: string;
  /** id of the target node */
  target: string;
  /** Flow magnitude — determines ribbon thickness between source and target */
  value: number;
};

export type SankeyTooltipContentProps = {
  active?: boolean;
  /**
   * Recharts tooltip payload — isolated behind `Platform.Select` so the native
   * build never depends on recharts types. Native renders its own tooltip overlay
   * from the computed Sankey layout and does not consume this prop (its native
   * variant is `undefined`). Web resolves to the real recharts payload type.
   */
  payload?: Platform.Select<{
    web: TooltipContentProps<number, string>['payload'];
    native: undefined;
  }>;
  labelUnit?: string;
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
  /** Called when a node bar is clicked. Receives the node data and its zero-based index. */
  onNodeClick?: (node: SankeyDataNode, index: number) => void;
  /** Called when a link ribbon is clicked. Receives the link data and its zero-based index. */
  onLinkClick?: (link: SankeyDataLink, index: number) => void;
};
