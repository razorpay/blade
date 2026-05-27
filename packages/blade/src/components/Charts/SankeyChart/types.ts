import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';

export type SankeyDataNode = {
  /** Unique identifier — used in link `source`/`target` references */
  id: string;
  name: string;
  /** Optional typed Blade color token override, e.g. 'data.background.categorical.blue.moderate' */
  color?: ChartsCategoricalColorToken;
};

export type SankeyDataLink = {
  /** id of the source node */
  source: string;
  /** id of the target node */
  target: string;
  value: number;
};

export type ChartSankeyWrapperProps = {
  children: React.ReactNode;
  height?: number;
  showTooltip?: boolean;
  /** Override all node bar colors with a single Blade token */
  nodeColorOverride?: ChartsCategoricalColorToken;
  /** Override all link ribbon colors with a single Blade token */
  linkColorOverride?: ChartsCategoricalColorToken;
} & TestID &
  DataAnalyticsAttribute;

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
   * Defaults to Indian number system (k / L / Cr, truncated).
   * @example formatValue={(v) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(v)}
   */
  formatValue?: (value: number) => string;
  onNodeClick?: (node: SankeyDataNode, index: number) => void;
  onLinkClick?: (link: SankeyDataLink, index: number) => void;
};
