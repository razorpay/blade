import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { action } from 'storybook/actions';
import { ChartSankeyWrapper, ChartSankey } from './SankeyChart';
import type {
  ChartSankeyWrapperProps,
  ChartSankeyProps,
  SankeyDataNode,
  SankeyDataLink,
} from './types';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

// ─── Docs page ────────────────────────────────────────────────────────────────

const Page = (): React.ReactElement => (
  <StoryPageWrapper
    componentName="SankeyChart"
    componentDescription="A Sankey flow diagram for visualising how a quantity is distributed across multiple stages. Rendered as React SVG with Blade's own layout engine (a port of the Recharts Sankey layout). Suitable for payment routing, funnel analysis, and budget allocation. Small nodes can be grouped into an expandable 'Other' node with `groupNodesBelow`."
    apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Charts/_decisions/decisions.md"
  >
    <Heading size="large">Usage</Heading>
    <Sandbox showConsole>
      {`
        import { ChartSankeyWrapper, ChartSankey } from '@razorpay/blade/components';

        function App() {
          return (
            <Box width="100%" height="320px">
              <ChartSankeyWrapper showTooltip>
                <ChartSankey
                  data={{
                    nodes: [
                      { id: 'total',   name: 'Total' },
                      { id: 'upi',     name: 'UPI' },
                      { id: 'card',    name: 'Card' },
                      { id: 'success', name: 'Successful' },
                      { id: 'failed',  name: 'Failed' },
                    ],
                    links: [
                      { source: 'total', target: 'upi',     value: 4000 },
                      { source: 'total', target: 'card',    value: 3200 },
                      { source: 'upi',   target: 'success', value: 3500 },
                      { source: 'upi',   target: 'failed',  value: 500  },
                      { source: 'card',  target: 'success', value: 2800 },
                      { source: 'card',  target: 'failed',  value: 400  },
                    ],
                  }}
                  labelUnit="txn"
                />
              </ChartSankeyWrapper>
            </Box>
          );
        }

        export default App;
      `}
    </Sandbox>
  </StoryPageWrapper>
);

// ─── Story meta ───────────────────────────────────────────────────────────────

type StoryProps = ChartSankeyWrapperProps &
  ChartSankeyProps & {
    numLevels: 2 | 3 | 4;
    nodesL1: number;
    nodesL2: number;
    nodesL3: number;
    nodesL4: number;
    successColor: SankeyDataNode['color'];
    failedColor: SankeyDataNode['color'];
  };

// Curated palette for the per-node color controls below. Each value is a typed
// `ChartsCategoricalColorToken`; the `labels` map in argTypes shows a friendly name.
const NODE_COLOR_OPTIONS: NonNullable<SankeyDataNode['color']>[] = [
  'data.background.categorical.green.subtle',
  'data.background.categorical.green.moderate',
  'data.background.categorical.red.subtle',
  'data.background.categorical.red.moderate',
  'data.background.categorical.blue.moderate',
  'data.background.categorical.gold.moderate',
  'data.background.categorical.purple.moderate',
  'data.background.categorical.orange.moderate',
  'data.background.categorical.pink.moderate',
  'data.background.categorical.skyBlue.moderate',
  'data.background.categorical.gray.moderate',
];

const NODE_COLOR_LABELS: Record<string, string> = NODE_COLOR_OPTIONS.reduce((acc, token) => {
  acc[token] = token.replace('data.background.categorical.', '');
  return acc;
}, {} as Record<string, string>);

export default {
  title: 'Components/Charts/SankeyChart',
  component: ChartSankeyWrapper,
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'number', min: 200, max: 800, step: 20 },
      description:
        'Chart height. Passed as a BoxProp — the story uses this to set the height of the outer container Box (e.g. "420px").',
    },
    showTooltip: {
      control: { type: 'boolean' },
      description: 'Show a tooltip on node/link hover.',
    },
    showLabels: {
      control: { type: 'boolean' },
      description: 'Show labels to the right of each node bar.',
    },
    showLabelChip: {
      control: { type: 'boolean' },
      description:
        'When true (default), labels render as Blade-styled chips with value + percentage. When false, renders the same info (name + value + percentage) as plain SVG text without chip background — cleaner for dense charts or static exports.',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description:
        'When true (default), shows the percentage of total flow alongside the value in each label. When false, only the humanized value (and optional unit) is shown.',
    },
    labelUnit: {
      control: { type: 'text' },
      description: 'Unit appended to node value in label chip, e.g. "txn" or "₹".',
    },
    labelDensity: {
      control: { type: 'select' },
      options: ['normal', 'compact'],
      description:
        "Vertical density of the label chips. 'compact' renders 20px chips (4px vertical padding) instead of 28px, so labels on thin, closely stacked nodes have room before they touch. Labels are always a single line — a long name is truncated with an ellipsis and shown in full in the tooltip.",
    },
    showColorIndicator: {
      control: { type: 'boolean' },
      description:
        "Starts each label with a dot in the node's colour, so a label can be matched to its bar and ribbons at a glance.",
    },
    groupNodesBelow: {
      control: { type: 'select', labels: { 0: 'off' } },
      options: [0, 1, 2, 5],
      description:
        'Groups every node whose share of the total is below this percentage into one "Other" node per column. Click the group (or press Enter on it) to reveal its members in place at the same scale; click a revealed label to fold them again. 0 turns grouping off.',
    },
    numLevels: {
      control: { type: 'select' },
      options: [2, 3, 4],
      description: 'Number of node columns in the chart.',
      defaultValue: 4,
    },
    nodesL1: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in column 1.',
      defaultValue: 1,
    },
    nodesL2: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in column 2.',
      defaultValue: 4,
    },
    nodesL3: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in column 3.',
      defaultValue: 3,
      if: { arg: 'numLevels', gt: 2 },
    },
    nodesL4: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in column 4.',
      defaultValue: 2,
      if: { arg: 'numLevels', eq: 4 },
    },
    width: {
      control: { type: 'text' },
      description:
        'Chart width. Accepts a pixel number or any valid CSS width string (e.g. "100%", "600px"). Default: "100%".',
    },
    successColor: {
      control: { type: 'select', labels: NODE_COLOR_LABELS },
      options: NODE_COLOR_OPTIONS,
      description:
        'Per-node color override for the "Successful" outcome node, applied via `SankeyDataNode.color`. Demonstrates node-level color control.',
    },
    failedColor: {
      control: { type: 'select', labels: NODE_COLOR_LABELS },
      options: NODE_COLOR_OPTIONS,
      description:
        'Per-node color override for the "Failed" outcome node, applied via `SankeyDataNode.color`. Demonstrates node-level color control.',
    },
    // Hide complex/internal props from Storybook controls
    data: { table: { disable: true } },
    children: { table: { disable: true } },
    formatValue: { table: { disable: true } },
    nodeColorOverride: { table: { disable: true } },
    linkColorOverride: { table: { disable: true } },
    testID: { table: { disable: true } },
    onNodeClick: { table: { disable: true } },
    onLinkClick: { table: { disable: true } },
    formatGroupLabel: { table: { disable: true } },
    defaultExpandedGroupDepths: { table: { disable: true } },
    expandedGroupDepths: { table: { disable: true } },
    onExpandChange: { table: { disable: true } },
  },
  parameters: {
    docs: { page: Page },
  },
} as Meta<StoryProps>;

// ─── Shared wrapper ───────────────────────────────────────────────────────────

const ChartsWrapper = ({
  children,
  padding = 'spacing.8',
}: {
  children: React.ReactNode;
  padding?: React.ComponentProps<typeof Box>['padding'];
}): React.ReactElement => (
  <Box
    width="100%"
    backgroundColor="surface.background.gray.intense"
    display="flex"
    justifyContent="center"
    alignItems="center"
    padding={padding}
    borderRadius="medium"
  >
    {children}
  </Box>
);

// ─── Shared data generator ────────────────────────────────────────────────────

const NODE_NAMES: string[][] = [
  ['Total'],
  ['UPI', 'Card', 'Wallet', 'Netbanking', 'BNPL', 'EMI'],
  ['Razorpay', 'PayU', 'Billdesk', 'Stripe', 'CCAvenue', 'PayTM'],
  ['Successful', 'Failed', 'Pending', 'Refunded', 'Disputed', 'Expired'],
];

// Semantic color overrides for outcome nodes
const NODE_COLORS: Partial<Record<string, SankeyDataNode['color']>> = {
  Successful: 'data.background.categorical.green.subtle',
  Failed: 'data.background.categorical.red.subtle',
};

const LEVEL_WEIGHTS: number[][] = [
  [1],
  [0.44, 0.28, 0.17, 0.11, 0.07, 0.04],
  [0.52, 0.27, 0.21, 0.14, 0.09, 0.06],
  [0.87, 0.13, 0.05, 0.03, 0.02, 0.01],
];

const ROOT_VALUE = 10_000;

function generateChartData(
  nodeCounts: number[],
): {
  nodes: SankeyDataNode[];
  links: SankeyDataLink[];
} {
  const columns = nodeCounts.map((count, li) =>
    Array.from({ length: count }, (_, ni) => {
      const name = NODE_NAMES[li]?.[ni] ?? `Col${li + 1} Node ${ni + 1}`;
      return {
        id: `l${li}-n${ni}`,
        name,
        ...(NODE_COLORS[name] ? { color: NODE_COLORS[name] } : {}),
      };
    }),
  );

  const nodeValue: Record<string, number> = {};
  nodeValue[columns[0][0].id] = ROOT_VALUE;

  const links: SankeyDataLink[] = [];

  for (let li = 0; li < columns.length - 1; li++) {
    const srcNodes = columns[li];
    const tgtNodes = columns[li + 1];
    const rawWeights = (LEVEL_WEIGHTS[li + 1] ?? []).slice(0, tgtNodes.length);
    while (rawWeights.length < tgtNodes.length) rawWeights.push(0.05);
    const weightSum = rawWeights.reduce((s, w) => s + w, 0);
    const normWeights = rawWeights.map((w) => w / weightSum);
    const totalFlow = srcNodes.reduce((s, n) => s + (nodeValue[n.id] ?? 0), 0);
    tgtNodes.forEach((tgt, ti) => {
      nodeValue[tgt.id] = Math.round(totalFlow * normWeights[ti]);
    });
    for (const src of srcNodes) {
      const srcFlow = nodeValue[src.id] ?? 0;
      tgtNodes.forEach((tgt, ti) => {
        links.push({
          source: src.id,
          target: tgt.id,
          value: Math.round(srcFlow * normWeights[ti]),
        });
      });
    }
  }

  const nodes: SankeyDataNode[] = columns.flat();
  return { nodes, links };
}

// Fixed dataset used by non-configurable stories
const { nodes: paymentNodes, links: paymentLinks } = generateChartData([1, 4, 3, 2]);

// ─── Stories ──────────────────────────────────────────────────────────────────

export const DefaultSankeyChart: StoryFn<StoryProps> = ({
  height = 480,
  showTooltip = true,
  showLabels = true,
  showLabelChip = true,
  showPercentage = true,
  labelUnit = 'txn',
  labelDensity = 'normal',
  showColorIndicator = false,
  groupNodesBelow = 0,
  numLevels = 4,
  nodesL1 = 1,
  nodesL2 = 4,
  nodesL3 = 3,
  nodesL4 = 2,
  successColor = 'data.background.categorical.green.subtle',
  failedColor = 'data.background.categorical.red.subtle',
}: StoryProps) => {
  const counts = ([nodesL1, nodesL2, nodesL3, nodesL4] as number[]).slice(0, numLevels);
  const { nodes: generatedNodes, links } = generateChartData(counts);
  // Apply the per-node color controls to the semantic outcome nodes. Outcomes are never
  // grouped: a status is a category the reader wants to see, however small.
  const nodes = generatedNodes.map((node) => {
    if (node.name === 'Successful') return { ...node, color: successColor };
    if (node.name === 'Failed') return { ...node, color: failedColor };
    if (NODE_NAMES[3].includes(node.name)) return { ...node, isGroupable: false };
    return node;
  });
  return (
    <ChartsWrapper padding="spacing.0">
      <Box width="100%" height={`${height}px`}>
        <ChartSankeyWrapper showTooltip={showTooltip}>
          <ChartSankey
            data={{ nodes, links }}
            showLabels={showLabels}
            showLabelChip={showLabelChip}
            showPercentage={showPercentage}
            labelUnit={labelUnit}
            labelDensity={labelDensity}
            showColorIndicator={showColorIndicator}
            groupNodesBelow={groupNodesBelow > 0 ? groupNodesBelow : undefined}
            onNodeClick={action('onNodeClick')}
            onLinkClick={action('onLinkClick')}
            onExpandChange={action('onExpandChange')}
          />
        </ChartSankeyWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * A long tail of small payment methods, grouped into "Other" with `groupNodesBelow`.
 * Click the group's label (or focus it and press Enter) to reveal the members in place:
 * bars and ribbons keep their size, every revealed node gets room for its label, and the
 * drawing grows below the container. Click a revealed label to fold the group again.
 * Outcome nodes opt out with `isGroupable: false`, so a small status is never hidden.
 */
const LONG_TAIL_DATA: { nodes: SankeyDataNode[]; links: SankeyDataLink[] } = {
  nodes: [
    { id: 'total', name: 'Total' },
    { id: 'upi', name: 'UPI' },
    { id: 'card', name: 'Card' },
    { id: 'netbanking', name: 'Netbanking' },
    { id: 'wallet', name: 'Wallet' },
    { id: 'emi', name: 'EMI' },
    { id: 'bnpl', name: 'Pay Later' },
    { id: 'upi-intent', name: 'UPI Intent' },
    { id: 'cod', name: 'Cash on delivery' },
    { id: 'bank-transfer', name: 'Bank transfer' },
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
    {
      id: 'pending',
      name: 'Pending',
      color: 'data.background.categorical.gray.moderate',
      isGroupable: false,
    },
    { id: 'refunded', name: 'Refunded', isGroupable: false },
  ],
  links: [
    { source: 'total', target: 'upi', value: 61000 },
    { source: 'total', target: 'card', value: 24000 },
    { source: 'total', target: 'netbanking', value: 7800 },
    { source: 'total', target: 'wallet', value: 3600 },
    { source: 'total', target: 'emi', value: 1500 },
    { source: 'total', target: 'bnpl', value: 900 },
    { source: 'total', target: 'upi-intent', value: 600 },
    { source: 'total', target: 'cod', value: 400 },
    { source: 'total', target: 'bank-transfer', value: 200 },
    { source: 'upi', target: 'captured', value: 54000 },
    { source: 'upi', target: 'failed', value: 5800 },
    { source: 'upi', target: 'pending', value: 700 },
    { source: 'upi', target: 'refunded', value: 500 },
    { source: 'card', target: 'captured', value: 20500 },
    { source: 'card', target: 'failed', value: 3000 },
    { source: 'card', target: 'pending', value: 200 },
    { source: 'card', target: 'refunded', value: 300 },
    { source: 'netbanking', target: 'captured', value: 6500 },
    { source: 'netbanking', target: 'failed', value: 1200 },
    { source: 'netbanking', target: 'pending', value: 100 },
    { source: 'wallet', target: 'captured', value: 3200 },
    { source: 'wallet', target: 'failed', value: 400 },
    { source: 'emi', target: 'captured', value: 1300 },
    { source: 'emi', target: 'failed', value: 200 },
    { source: 'bnpl', target: 'captured', value: 780 },
    { source: 'bnpl', target: 'failed', value: 120 },
    { source: 'upi-intent', target: 'captured', value: 540 },
    { source: 'upi-intent', target: 'failed', value: 60 },
    { source: 'cod', target: 'captured', value: 360 },
    { source: 'cod', target: 'failed', value: 40 },
    { source: 'bank-transfer', target: 'captured', value: 180 },
    { source: 'bank-transfer', target: 'pending', value: 20 },
  ],
};

type GroupedStoryProps = {
  groupNodesBelow: number;
  labelDensity: ChartSankeyProps['labelDensity'];
  showColorIndicator: boolean;
};

export const GroupedSmallNodesSankeyChart: StoryFn<GroupedStoryProps> = ({
  groupNodesBelow = 2,
  labelDensity = 'compact',
  showColorIndicator = true,
}) => (
  <ChartsWrapper padding="spacing.0">
    <Box width="100%" height="400px">
      <ChartSankeyWrapper showTooltip>
        <ChartSankey
          data={LONG_TAIL_DATA}
          labelUnit="txn"
          labelDensity={labelDensity}
          showColorIndicator={showColorIndicator}
          groupNodesBelow={groupNodesBelow > 0 ? groupNodesBelow : undefined}
          formatGroupLabel={({ members }) => `Other methods (${members.length})`}
          onNodeClick={action('onNodeClick')}
          onLinkClick={action('onLinkClick')}
          onExpandChange={action('onExpandChange')}
        />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

GroupedSmallNodesSankeyChart.argTypes = {
  groupNodesBelow: {
    control: { type: 'select', labels: { 0: 'off' } },
    options: [0, 1, 2, 5],
    description: 'Share of the total, in percent, below which methods are grouped.',
  },
  labelDensity: { control: { type: 'select' }, options: ['normal', 'compact'] },
  showColorIndicator: { control: { type: 'boolean' } },
  // Hide the configurable controls inherited from meta — they don't apply here.
  height: { table: { disable: true } },
  showTooltip: { table: { disable: true } },
  showLabels: { table: { disable: true } },
  showLabelChip: { table: { disable: true } },
  showPercentage: { table: { disable: true } },
  labelUnit: { table: { disable: true } },
  numLevels: { table: { disable: true } },
  nodesL1: { table: { disable: true } },
  nodesL2: { table: { disable: true } },
  nodesL3: { table: { disable: true } },
  nodesL4: { table: { disable: true } },
  width: { table: { disable: true } },
  successColor: { table: { disable: true } },
  failedColor: { table: { disable: true } },
} as Meta<GroupedStoryProps>['argTypes'];

GroupedSmallNodesSankeyChart.args = {
  groupNodesBelow: 2,
  labelDensity: 'compact',
  showColorIndicator: true,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * The pattern for a fixed-height card: the wrapper sits in a `Box` with a set height and
 * `overflowY="auto"`. Folded, the chart fits the card. Expanding a group keeps every bar and
 * ribbon at the same size and grows the drawing below the fold, which the card then scrolls.
 * Two columns have a tail here — methods and providers — so two groups can expand independently.
 */
const OPTIMIZER_DATA: { nodes: SankeyDataNode[]; links: SankeyDataLink[] } = {
  nodes: [
    { id: 'total', name: 'Total' },
    { id: 'upi', name: 'UPI' },
    { id: 'card', name: 'Card' },
    { id: 'netbanking', name: 'Netbanking' },
    { id: 'wallet', name: 'Wallet' },
    { id: 'emi', name: 'EMI' },
    { id: 'bnpl', name: 'Pay Later' },
    { id: 'razorpay', name: 'Razorpay' },
    { id: 'hdfc', name: 'HDFC' },
    { id: 'payu', name: 'PayU' },
    { id: 'billdesk', name: 'BillDesk' },
    { id: 'ccavenue', name: 'CCAvenue' },
    { id: 'paytm', name: 'Paytm' },
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
    {
      id: 'pending',
      name: 'Pending',
      color: 'data.background.categorical.gray.moderate',
      isGroupable: false,
    },
  ],
  links: [
    { source: 'total', target: 'upi', value: 58000 },
    { source: 'total', target: 'card', value: 30000 },
    { source: 'total', target: 'netbanking', value: 8000 },
    { source: 'total', target: 'wallet', value: 1900 },
    { source: 'total', target: 'emi', value: 1300 },
    { source: 'total', target: 'bnpl', value: 800 },
    { source: 'upi', target: 'razorpay', value: 52000 },
    { source: 'upi', target: 'hdfc', value: 6000 },
    { source: 'card', target: 'razorpay', value: 22000 },
    { source: 'card', target: 'hdfc', value: 5000 },
    { source: 'card', target: 'payu', value: 1500 },
    { source: 'card', target: 'billdesk', value: 900 },
    { source: 'card', target: 'ccavenue', value: 600 },
    { source: 'netbanking', target: 'razorpay', value: 6200 },
    { source: 'netbanking', target: 'billdesk', value: 1000 },
    { source: 'netbanking', target: 'ccavenue', value: 800 },
    { source: 'wallet', target: 'paytm', value: 1900 },
    { source: 'emi', target: 'hdfc', value: 1300 },
    { source: 'bnpl', target: 'payu', value: 800 },
    { source: 'razorpay', target: 'captured', value: 73000 },
    { source: 'razorpay', target: 'failed', value: 6400 },
    { source: 'razorpay', target: 'pending', value: 800 },
    { source: 'hdfc', target: 'captured', value: 11000 },
    { source: 'hdfc', target: 'failed', value: 1200 },
    { source: 'hdfc', target: 'pending', value: 100 },
    { source: 'payu', target: 'captured', value: 2000 },
    { source: 'payu', target: 'failed', value: 300 },
    { source: 'billdesk', target: 'captured', value: 1650 },
    { source: 'billdesk', target: 'failed', value: 250 },
    { source: 'ccavenue', target: 'captured', value: 1200 },
    { source: 'ccavenue', target: 'failed', value: 200 },
    { source: 'paytm', target: 'captured', value: 1700 },
    { source: 'paytm', target: 'failed', value: 200 },
  ],
};

export const GroupedSankeyChartInFixedHeightCard: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper padding="spacing.0">
    <Box
      width="100%"
      height="346px"
      overflowY="auto"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
    >
      <ChartSankeyWrapper showTooltip>
        <ChartSankey
          data={OPTIMIZER_DATA}
          labelUnit="txn"
          labelDensity="compact"
          showColorIndicator
          groupNodesBelow={2}
          formatGroupLabel={({ groupDepth, members }) =>
            `Other ${groupDepth === 1 ? 'methods' : 'providers'} (${members.length})`
          }
          onNodeClick={action('onNodeClick')}
          onLinkClick={action('onLinkClick')}
          onExpandChange={action('onExpandChange')}
        />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

GroupedSankeyChartInFixedHeightCard.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compact label density with the colour indicator. Labels are always a single line: a name
 * that does not fit the 200px label budget is trimmed with an ellipsis (hover the node to read
 * it in full in the tooltip), and right margin is reserved only for the last column's labels.
 * The long node names here exercise both behaviours.
 */
const LONG_NAME_DATA: { nodes: SankeyDataNode[]; links: SankeyDataLink[] } = {
  nodes: [
    { id: 'total', name: 'All initiated payments' },
    { id: 'upi', name: 'UPI' },
    { id: 'card', name: 'Credit and debit cards' },
    { id: 'netbanking', name: 'Netbanking through corporate current accounts' },
    { id: 'wallet', name: 'Wallets' },
    { id: 'emi', name: 'EMI' },
    { id: 'captured', name: 'Captured', color: 'data.background.categorical.green.subtle' },
    { id: 'failed', name: 'Failed', color: 'data.background.categorical.red.subtle' },
    { id: 'pending', name: 'Pending authorisation from the issuing bank' },
  ],
  links: [
    { source: 'total', target: 'upi', value: 6200 },
    { source: 'total', target: 'card', value: 2400 },
    { source: 'total', target: 'netbanking', value: 900 },
    { source: 'total', target: 'wallet', value: 420 },
    { source: 'total', target: 'emi', value: 80 },
    { source: 'upi', target: 'captured', value: 5600 },
    { source: 'upi', target: 'failed', value: 520 },
    { source: 'upi', target: 'pending', value: 80 },
    { source: 'card', target: 'captured', value: 2000 },
    { source: 'card', target: 'failed', value: 360 },
    { source: 'card', target: 'pending', value: 40 },
    { source: 'netbanking', target: 'captured', value: 760 },
    { source: 'netbanking', target: 'failed', value: 120 },
    { source: 'netbanking', target: 'pending', value: 20 },
    { source: 'wallet', target: 'captured', value: 380 },
    { source: 'wallet', target: 'failed', value: 40 },
    { source: 'emi', target: 'captured', value: 70 },
    { source: 'emi', target: 'failed', value: 10 },
  ],
};

export const CompactLabelsSankeyChart: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper padding="spacing.0">
    <Box width="100%" height="360px">
      <ChartSankeyWrapper showTooltip>
        <ChartSankey
          data={LONG_NAME_DATA}
          labelDensity="compact"
          showColorIndicator
          labelUnit="txn"
          onNodeClick={action('onNodeClick')}
          onLinkClick={action('onLinkClick')}
        />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

CompactLabelsSankeyChart.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Per-node color control. This story uses a fixed set of nodes so that every node
 * can be bound to its own color control (a stable node list is required — in the
 * configurable `DefaultSankeyChart` the node count is itself a control, so it can't
 * cleanly expose one color control per node). Each node's color is applied via
 * `SankeyDataNode.color`; links inherit their color from the source node.
 */
type PerNodeColorProps = {
  totalColor: SankeyDataNode['color'];
  upiColor: SankeyDataNode['color'];
  cardColor: SankeyDataNode['color'];
  walletColor: SankeyDataNode['color'];
  successColor: SankeyDataNode['color'];
  failedColor: SankeyDataNode['color'];
};

const PER_NODE_DATA: { nodes: SankeyDataNode[]; links: SankeyDataLink[] } = {
  nodes: [
    { id: 'total', name: 'Total' },
    { id: 'upi', name: 'UPI' },
    { id: 'card', name: 'Card' },
    { id: 'wallet', name: 'Wallet' },
    { id: 'success', name: 'Successful' },
    { id: 'failed', name: 'Failed' },
  ],
  links: [
    { source: 'total', target: 'upi', value: 5000 },
    { source: 'total', target: 'card', value: 3000 },
    { source: 'total', target: 'wallet', value: 2000 },
    { source: 'upi', target: 'success', value: 4200 },
    { source: 'upi', target: 'failed', value: 800 },
    { source: 'card', target: 'success', value: 2500 },
    { source: 'card', target: 'failed', value: 500 },
    { source: 'wallet', target: 'success', value: 1600 },
    { source: 'wallet', target: 'failed', value: 400 },
  ],
};

export const CustomNodeColorsSankeyChart: StoryFn<PerNodeColorProps> = ({
  totalColor,
  upiColor,
  cardColor,
  walletColor,
  successColor,
  failedColor,
}) => {
  const colorByName: Record<string, SankeyDataNode['color']> = {
    Total: totalColor,
    UPI: upiColor,
    Card: cardColor,
    Wallet: walletColor,
    Successful: successColor,
    Failed: failedColor,
  };
  const nodes = PER_NODE_DATA.nodes.map((node) => ({
    ...node,
    color: colorByName[node.name] ?? node.color,
  }));
  return (
    <ChartsWrapper padding="spacing.0">
      <Box width="100%" height="480px">
        <ChartSankeyWrapper showTooltip>
          <ChartSankey
            data={{ nodes, links: PER_NODE_DATA.links }}
            labelUnit="txn"
            onNodeClick={action('onNodeClick')}
            onLinkClick={action('onLinkClick')}
          />
        </ChartSankeyWrapper>
      </Box>
    </ChartsWrapper>
  );
};

const perNodeColorArgType = {
  control: { type: 'select' as const, labels: NODE_COLOR_LABELS },
  options: NODE_COLOR_OPTIONS,
};

CustomNodeColorsSankeyChart.argTypes = {
  totalColor: { ...perNodeColorArgType, description: 'Color for the "Total" node.' },
  upiColor: { ...perNodeColorArgType, description: 'Color for the "UPI" node.' },
  cardColor: { ...perNodeColorArgType, description: 'Color for the "Card" node.' },
  walletColor: { ...perNodeColorArgType, description: 'Color for the "Wallet" node.' },
  successColor: { ...perNodeColorArgType, description: 'Color for the "Successful" node.' },
  failedColor: { ...perNodeColorArgType, description: 'Color for the "Failed" node.' },
  // Hide the configurable controls inherited from meta — they don't apply here.
  height: { table: { disable: true } },
  showTooltip: { table: { disable: true } },
  showLabels: { table: { disable: true } },
  showLabelChip: { table: { disable: true } },
  showPercentage: { table: { disable: true } },
  labelUnit: { table: { disable: true } },
  labelDensity: { table: { disable: true } },
  showColorIndicator: { table: { disable: true } },
  groupNodesBelow: { table: { disable: true } },
  numLevels: { table: { disable: true } },
  nodesL1: { table: { disable: true } },
  nodesL2: { table: { disable: true } },
  nodesL3: { table: { disable: true } },
  nodesL4: { table: { disable: true } },
  width: { table: { disable: true } },
} as Meta<PerNodeColorProps>['argTypes'];

CustomNodeColorsSankeyChart.args = {
  totalColor: 'data.background.categorical.blue.moderate',
  upiColor: 'data.background.categorical.purple.moderate',
  cardColor: 'data.background.categorical.gold.moderate',
  walletColor: 'data.background.categorical.orange.moderate',
  successColor: 'data.background.categorical.green.subtle',
  failedColor: 'data.background.categorical.red.subtle',
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vertical (top-to-bottom) flow — **native-only**. The web SankeyChart ignores
 * `orientation` and always renders horizontally; on native the layout is
 * transposed so stages stack down the screen, which reads better on tall phones.
 * Given plenty of height and full width so the stacked stages and their labels
 * have room to breathe.
 */
export const VerticalSankeyChart: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper padding="spacing.0">
    <Box width="100%" height="640px">
      <ChartSankeyWrapper showTooltip orientation="vertical">
        <ChartSankey
          data={{ nodes: paymentNodes, links: paymentLinks }}
          showLabels
          labelUnit="txn"
          onNodeClick={action('onNodeClick')}
          onLinkClick={action('onLinkClick')}
        />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

VerticalSankeyChart.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vertical flow with labels disabled (**native-only** orientation). Hiding the node
 * labels (`showLabels={false}`) surfaces the pure ribbon flow without any label
 * crowding — useful for dense multi-node stages on a narrow phone width.
 */
export const VerticalSankeyChartWithoutLabels: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper padding="spacing.0">
    <Box width="100%" height="640px">
      <ChartSankeyWrapper showTooltip orientation="vertical">
        <ChartSankey
          data={{ nodes: paymentNodes, links: paymentLinks }}
          showLabels={false}
          onNodeClick={action('onNodeClick')}
          onLinkClick={action('onLinkClick')}
        />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

VerticalSankeyChartWithoutLabels.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

export const SingleColorSankeyChart: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper>
    <Box width="100%" display="flex" flexDirection="column" gap="spacing.4">
      <Box width="100%" height="420px">
        <ChartSankeyWrapper
          nodeColorOverride="data.background.categorical.blue.intense"
          linkColorOverride="data.background.categorical.blue.subtle"
          showTooltip={true}
        >
          <ChartSankey
            data={{ nodes: paymentNodes, links: paymentLinks }}
            showLabels={true}
            labelUnit="txn"
          />
        </ChartSankeyWrapper>
      </Box>
    </Box>
  </ChartsWrapper>
);

SingleColorSankeyChart.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

export const SankeyChartWithoutLabels: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper>
    <Box width="100%" height="420px">
      <ChartSankeyWrapper
        nodeColorOverride="data.background.categorical.blue.intense"
        linkColorOverride="data.background.categorical.blue.subtle"
        showTooltip={true}
      >
        <ChartSankey data={{ nodes: paymentNodes, links: paymentLinks }} showLabels={false} />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

SankeyChartWithoutLabels.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

export const SankeyChartWithPlainTextLabels: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper>
    <Box width="100%" height="420px">
      <ChartSankeyWrapper showTooltip={true}>
        <ChartSankey
          data={{ nodes: paymentNodes, links: paymentLinks }}
          showLabels={true}
          showLabelChip={false}
          labelUnit="txn"
        />
      </ChartSankeyWrapper>
    </Box>
  </ChartsWrapper>
);

SankeyChartWithPlainTextLabels.parameters = { controls: { disable: true } };

// ─── Story display names ──────────────────────────────────────────────────────

DefaultSankeyChart.storyName = 'Default Sankey Chart';
GroupedSmallNodesSankeyChart.storyName = 'Grouped Small Nodes';
GroupedSankeyChartInFixedHeightCard.storyName = 'Grouped Small Nodes in a Fixed-Height Card';
CompactLabelsSankeyChart.storyName = 'Compact Labels with Color Indicator';
VerticalSankeyChart.storyName = 'Vertical Sankey Chart (native only)';
VerticalSankeyChartWithoutLabels.storyName = 'Vertical Sankey Chart without Labels (native only)';
SingleColorSankeyChart.storyName = 'Single Color Sankey Chart';
SankeyChartWithoutLabels.storyName = 'Sankey Chart without Labels';
SankeyChartWithPlainTextLabels.storyName = 'Sankey Chart with Plain Text Labels';
