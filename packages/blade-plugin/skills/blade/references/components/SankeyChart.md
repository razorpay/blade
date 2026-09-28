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
   * Custom value formatter for node labels.
   * Default is Indian number notation (k / L / Cr), truncated.
   */
  formatValue?: (value: number) => string;
  /** Called when the user clicks a node bar. Gets the node data and its index */
  onNodeClick?: (node: SankeyDataNode, index: number) => void;
  /** Called when the user clicks a link ribbon. Gets the link data and its index */
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
              { id: 'success', name: 'Successful', color: 'data.background.categorical.green.subtle' },
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
          formatValue={(value) =>
            Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
          }
        />
      </ChartSankeyWrapper>
    </Box>
  );
}

export default SingleColorSankeyChart;
```
