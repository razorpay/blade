import type { TestID, DataAnalyticsAttribute } from '~utils/types';

export type SankeyLevelNode = {
  /** Unique identifier — used in link `from`/`to` references */
  id: string;
  name: string;
  /** Optional Blade color token path override, e.g. 'data.background.categorical.blue.moderate' */
  color?: string;
};

export type SankeyLevel = {
  /** Unique identifier for this column of nodes */
  id: string;
  nodes: SankeyLevelNode[];
};

export type SankeyFlowLink = {
  /** id of the source node */
  from: string;
  /** id of the target node */
  to: string;
  value: number;
  label?: string;
};

export type SankeyChartProps = {
  /** Ordered array of node columns. Each level holds one or more nodes. */
  levels: SankeyLevel[];
  /** Flow connections between nodes — referenced by node id, not array index. */
  links: SankeyFlowLink[];
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  /** Override all nodes with a single Blade color token, e.g. 'interactive.background.primary.default' */
  nodeColorOverride?: string;
  /** Override all links with a single Blade color token, e.g. 'data.background.categorical.blue.subtle' */
  linkColorOverride?: string;
  showTooltip?: boolean;
  showLabels?: boolean;
  /** Unit appended to node value in label chip, e.g. "txn" or "₹M" */
  labelUnit?: string;
  onNodeClick?: (node: SankeyLevelNode & { levelId: string }, index: number) => void;
  onLinkClick?: (link: SankeyFlowLink, index: number) => void;
} & TestID &
  DataAnalyticsAttribute;
