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
    componentDescription="A Sankey flow diagram for visualising how a quantity is distributed across multiple stages. Built with Recharts for layout and React SVG for rendering. Suitable for payment routing, funnel analysis, and budget allocation."
    apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Charts/_decisions/decisions.md"
  >
    <Heading size="large">Usage</Heading>
    <Sandbox showConsole>
      {`
        import { ChartSankeyWrapper, ChartSankey } from '@razorpay/blade/components';

        function App() {
          return (
            <Box width="100%" height="320px">
              <ChartSankeyWrapper height={320} showTooltip>
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
  };

export default {
  title: 'Components/Charts/SankeyChart',
  component: ChartSankeyWrapper,
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'number', min: 200, max: 800, step: 20 },
      description: 'Height of the chart in pixels.',
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
    // Hide complex/internal props from Storybook controls
    data: { table: { disable: true } },
    children: { table: { disable: true } },
    nodeColorOverride: { table: { disable: true } },
    linkColorOverride: { table: { disable: true } },
    testID: { table: { disable: true } },
    onNodeClick: { table: { disable: true } },
    onLinkClick: { table: { disable: true } },
  },
  parameters: {
    docs: { page: Page },
  },
} as Meta<StoryProps>;

// ─── Shared wrapper ───────────────────────────────────────────────────────────

const ChartsWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <Box
    width="100%"
    backgroundColor="surface.background.gray.intense"
    display="flex"
    justifyContent="center"
    alignItems="center"
    padding="spacing.8"
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
  height = 420,
  showTooltip = true,
  showLabels = true,
  showLabelChip = true,
  showPercentage = true,
  labelUnit = 'txn',
  numLevels = 4,
  nodesL1 = 1,
  nodesL2 = 4,
  nodesL3 = 3,
  nodesL4 = 2,
}: StoryProps) => {
  const counts = ([nodesL1, nodesL2, nodesL3, nodesL4] as number[]).slice(0, numLevels);
  const { nodes, links } = generateChartData(counts);
  return (
    <ChartsWrapper>
      <Box width="100%" height={`${height}px`}>
        <ChartSankeyWrapper height={height} showTooltip={showTooltip}>
          <ChartSankey
            data={{ nodes, links }}
            showLabels={showLabels}
            showLabelChip={showLabelChip}
            showPercentage={showPercentage}
            labelUnit={labelUnit}
            onNodeClick={action('onNodeClick')}
            onLinkClick={action('onLinkClick')}
          />
        </ChartSankeyWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const SingleColorSankeyChart: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper>
    <Box width="100%" display="flex" flexDirection="column" gap="spacing.4">
      <ChartSankeyWrapper
        height={420}
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
  </ChartsWrapper>
);

SingleColorSankeyChart.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

export const SankeyChartWithoutLabels: StoryFn<typeof ChartSankeyWrapper> = () => (
  <ChartsWrapper>
    <Box width="100%">
      <ChartSankeyWrapper
        height={420}
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
    <Box width="100%">
      <ChartSankeyWrapper height={420} showTooltip={true}>
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
SingleColorSankeyChart.storyName = 'Single Color Sankey Chart';
SankeyChartWithoutLabels.storyName = 'Sankey Chart without Labels';
SankeyChartWithPlainTextLabels.storyName = 'Sankey Chart with Plain Text Labels';
