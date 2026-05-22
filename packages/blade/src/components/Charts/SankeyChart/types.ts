import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';

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

export type SankeyChartProps = {
  /** Flat node list + directed flow connections, referenced by node id. */
  data: {
    nodes: SankeyDataNode[];
    links: SankeyDataLink[];
  };
  height?: number;
  /** Override all node bar colors with a single Blade token */
  nodeColorOverride?: ChartsCategoricalColorToken;
  /** Override all link ribbon colors with a single Blade token */
  linkColorOverride?: ChartsCategoricalColorToken;
  showTooltip?: boolean;
  /** Show labels to the right of each node bar. Default: true */
  showLabels?: boolean;
  /**
   * When true (default), labels render as Blade-styled chips with value + percentage.
   * When false, renders a plain text node name — cleaner for dense charts or static exports.
   */
  showLabelChip?: boolean;
  /** Unit appended to node value in label chip, e.g. "txn" or "₹M" */
  labelUnit?: string;
  onNodeClick?: (node: SankeyDataNode, index: number) => void;
  onLinkClick?: (link: SankeyDataLink, index: number) => void;
};
