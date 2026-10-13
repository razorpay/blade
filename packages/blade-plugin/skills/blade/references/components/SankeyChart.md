## Component Name

SankeyChart

## Description

SankeyChart is a flow diagram that shows how a quantity moves across multiple stages. Nodes show the stages and link ribbons show the flow between them. The thickness of a ribbon shows the value of the flow. Use it for payment routing, funnel analysis, and budget allocation. It is made of `ChartSankeyWrapper` (the container) and `ChartSankey` (the diagram).

## Important Constraints

- `ChartSankeyWrapper` must contain exactly one `ChartSankey` element
- `data` prop on `ChartSankey` is required and must have `nodes` and `links` arrays
- Each link `source` and `target` must match the `id` of a node
- Node `color` accepts only categorical color tokens
- `orientation` prop has an effect only on React Native. The web chart always renders horizontally
- `labelDensity`, `showColorIndicator` and grouping (`groupNodesBelow`, `isGroupable`, `expandedGroupIds`) have an effect only on web. The native chart ignores them
- Labels on web are always a single line. A long name is truncated with an ellipsis and the tooltip shows the full name
- A share between 0 and 1 percent is shown as `<1%`
- `groupNodesBelow` groups only nodes that are not roots, are not marked `isGroupable: false`, and have at least one other node under the threshold in the same column
- Expanding a group keeps every bar and ribbon at its size and grows the drawing below the container. Put the wrapper in a `Box` with a fixed `height` and `overflowY="auto"` when the chart has a fixed height
- The default value formatter truncates (does not round) values in Indian notation (k / L / Cr)

## TypeScript Types

These types define the props that the SankeyChart components accept:

```typescript
type SankeyDataNode = {
  /** Unique identifier. Links use it in `source` and `target` */
  id: string;
  /** Label shown in node tooltips and label chips */
  name: string;
  /** Optional color token for this node, e.g. 'data.background.categorical.blue.moderate' */
  color?: ChartsCategoricalColorToken;
  /**
   * Whether `groupNodesBelow` may fold this node into its column's "Other" node.
   * Set false on nodes that must stay visible, e.g. outcome statuses. Web only.
   * @default true
   */
  isGroupable?: boolean;
};

type SankeyGroupExpandEvent = {
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

type SankeyDataLink = {
  /** id of the source node */
  source: string;
  /** id of the target node */
  target: string;
  /** Flow value. It sets the ribbon thickness */
  value: number;
};

type ChartSankeyWrapperProps = {
  /** Must contain exactly one `<ChartSankey>` element */
  children: React.ReactElement;
  /**
   * Show a tooltip when the user hovers over a node or link ribbon.
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Color palette for node colors that are set automatically.
   * @default 'categorical'
   */
  colorTheme?: 'categorical';
  /** Set all node bar colors to one color token */
  nodeColorOverride?: ChartsCategoricalColorToken;
  /** Set all link ribbon colors to one color token */
  linkColorOverride?: ChartsCategoricalColorToken;
  /**
   * Flow direction of the diagram. Native only (web always renders horizontally).
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
} & TestID &
  DataAnalyticsAttribute &
  BoxProps;

type ChartSankeyProps = {
  /** Node list and flow links. Links refer to nodes by id */
  data: {
    nodes: SankeyDataNode[];
    links: SankeyDataLink[];
  };
  /**
   * Show labels next to each node bar.
   * @default true
   */
  showLabels?: boolean;
  /**
   * When true, labels render as chips with value and percentage.
   * When false, labels render as plain text.
   * @default true
   */
  showLabelChip?: boolean;
  /**
   * When true, the label shows the percentage of total flow next to the value.
   * @default true
   */
  showPercentage?: boolean;
  /** Unit added after the node value in the label, e.g. "txn" or "₹M" */
  labelUnit?: string;
  /**
   * Vertical density of the labels. 'compact' renders 20px chips instead of 28px.
   * Use it when a column stacks many thin nodes. Web only.
   * @default 'normal'
   */
  labelDensity?: 'normal' | 'compact';
  /**
   * When true, each label starts with a dot in the node's colour. Web only.
   * @default false
   */
  showColorIndicator?: boolean;
  /**
   * Custom value formatter for node labels.
   * Default is Indian number notation (k / L / Cr), truncated.
   */
  formatValue?: (value: number) => string;
  /**
   * Groups every node whose share of the total is below this percentage into one
   * "Other" node per column. Click the group to reveal its members in place at the
   * same scale. Recommended values: 2 or 5. Unset turns grouping off. Web only.
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
  /** Called when the user clicks a node bar. Gets the node data and its index. Not called for a group node */
  onNodeClick?: (node: SankeyDataNode, index: number) => void;
  /**
   * Called when the user clicks a link ribbon. Gets the link data and its index. Not called for a
   * ribbon merged into a group node; use `onExpandChange` for those.
   */
  onLinkClick?: (link: SankeyDataLink, index: number) => void;
};

type ChartsCategoricalColorToken = `data.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;
```

## Usage Guidelines

**Do**

- Use `SankeyChart` to show how a total splits and flows across stages (for example, payment method to payment status).
- Give the wrapper a parent with a set height (for example, `Box` with `height="320px"`).
- Use `nodeColorOverride` and `linkColorOverride` for a single-color diagram.
- Use `formatValue` when you need a number format that is not Indian notation.
- Use `labelDensity="compact"` with `showColorIndicator` when a column has many thin nodes, so labels stay readable and each label can be matched to its bar.
- Use `groupNodesBelow` (2 or 5) when a column has a long tail of small nodes, and mark outcome nodes `isGroupable: false` so a small status is never hidden.
- Wrap the chart in a `Box` with a fixed `height` and `overflowY="auto"` when you use `groupNodesBelow` in a card, so an expanded group scrolls instead of resizing the card.

**Don't**

- Don't put more than one `ChartSankey` in a `ChartSankeyWrapper`.
- Don't use `SankeyChart` for time-series trends — use `LineChart` or `AreaChart` instead.
- Don't use `SankeyChart` for a simple parts-of-a-whole view — use `DonutChart` instead.

## Examples

### Basic Sankey Chart

```tsx
import React from 'react';
import { Box, ChartSankeyWrapper, ChartSankey } from '@razorpay/blade/components';

function PaymentFlowSankeyChart() {
  return (
    <Box width="100%" height="320px">
      <ChartSankeyWrapper showTooltip>
        <ChartSankey
          data={{
            nodes: [
              { id: 'total', name: 'Total' },
              { id: 'upi', name: 'UPI' },
              { id: 'card', name: 'Card' },
              {
                id: 'success',
                name: 'Successful',
                color: 'data.background.categorical.green.subtle',
              },
              { id: 'failed', name: 'Failed', color: 'data.background.categorical.red.subtle' },
            ],
            links: [
              { source: 'total', target: 'upi', value: 4000 },
              { source: 'total', target: 'card', value: 3200 },
              { source: 'upi', target: 'success', value: 3500 },
              { source: 'upi', target: 'failed', value: 500 },
              { source: 'card', target: 'success', value: 2800 },
              { source: 'card', target: 'failed', value: 400 },
            ],
          }}
          labelUnit="txn"
          onNodeClick={(node, index) => console.log('node', node, index)}
          onLinkClick={(link, index) => console.log('link', link, index)}
        />
      </ChartSankeyWrapper>
    </Box>
  );
}

export default PaymentFlowSankeyChart;
```

### Grouped Small Nodes in a Fixed-Height Card

```tsx
import React from 'react';
import { Box, ChartSankeyWrapper, ChartSankey } from '@razorpay/blade/components';

function PaymentMethodsSankeyChart() {
  return (
    <Box width="100%" height="346px" overflowY="auto">
      <ChartSankeyWrapper showTooltip>
        <ChartSankey
          data={{
            nodes: [
              { id: 'total', name: 'Total' },
              { id: 'upi', name: 'UPI' },
              { id: 'card', name: 'Card' },
              { id: 'wallet', name: 'Wallet' },
              { id: 'emi', name: 'EMI' },
              { id: 'bnpl', name: 'Pay Later' },
              {
                id: 'captured',
                name: 'Captured',
                color: 'data.background.categorical.green.subtle',
                isGroupable: false,
              },
              {
                id: 'failed',
                name: 'Failed',
                color: 'data.background.categorical.red.subtle',
                isGroupable: false,
              },
            ],
            links: [
              { source: 'total', target: 'upi', value: 6500 },
              { source: 'total', target: 'card', value: 2850 },
              { source: 'total', target: 'wallet', value: 400 },
              { source: 'total', target: 'emi', value: 180 },
              { source: 'total', target: 'bnpl', value: 70 },
              { source: 'upi', target: 'captured', value: 6000 },
              { source: 'upi', target: 'failed', value: 500 },
              { source: 'card', target: 'captured', value: 2600 },
              { source: 'card', target: 'failed', value: 250 },
              { source: 'wallet', target: 'captured', value: 350 },
              { source: 'wallet', target: 'failed', value: 50 },
              { source: 'emi', target: 'captured', value: 170 },
              { source: 'emi', target: 'failed', value: 10 },
              { source: 'bnpl', target: 'captured', value: 60 },
              { source: 'bnpl', target: 'failed', value: 10 },
            ],
          }}
          labelUnit="txn"
          labelDensity="compact"
          showColorIndicator
          groupNodesBelow={5}
          formatGroupLabel={({ members }) => `Other methods (${members.length})`}
          onExpandChange={({ groupDepth, isExpanded }) =>
            console.log('group toggled', groupDepth, isExpanded)
          }
        />
      </ChartSankeyWrapper>
    </Box>
  );
}

export default PaymentMethodsSankeyChart;
```

### Single Color Sankey Chart with Plain Text Labels

```tsx
import React from 'react';
import { Box, ChartSankeyWrapper, ChartSankey } from '@razorpay/blade/components';

function SingleColorSankeyChart() {
  return (
    <Box width="100%" height="420px">
      <ChartSankeyWrapper
        nodeColorOverride="data.background.categorical.blue.intense"
        linkColorOverride="data.background.categorical.blue.subtle"
      >
        <ChartSankey
          data={{
            nodes: [
              { id: 'budget', name: 'Budget' },
              { id: 'marketing', name: 'Marketing' },
              { id: 'engineering', name: 'Engineering' },
            ],
            links: [
              { source: 'budget', target: 'marketing', value: 40000 },
              { source: 'budget', target: 'engineering', value: 60000 },
            ],
          }}
          showLabelChip={false}
          showPercentage={false}
          formatValue={(value) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)}
        />
      </ChartSankeyWrapper>
    </Box>
  );
}

export default SingleColorSankeyChart;
```
