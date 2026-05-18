import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { SankeyChart } from './SankeyChart';
import type { SankeyChartProps } from './types';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

// ─── Docs page ────────────────────────────────────────────────────────────────

const Page = (): React.ReactElement => (
  <StoryPageWrapper
    componentName="SankeyChart"
    componentDescription="A Sankey flow diagram for visualising how a quantity is distributed across multiple stages. Built with d3-sankey for layout and React SVG for rendering. Suitable for payment routing, funnel analysis, and budget allocation."
    figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=PLACEHOLDER"
    apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Charts/SankeyChart/_decisions/decisions.md"
  >
    <Heading size="large">Usage</Heading>
    <Sandbox showConsole>
      {`
        import { SankeyChart } from '@razorpay/blade/components';

        function App() {
          return (
            <Box width="100%" height="320px">
              <SankeyChart
                levels={[
                  { id: 'total',  nodes: [{ id: 'total', name: 'Total' }] },
                  { id: 'method', nodes: [{ id: 'upi', name: 'UPI' }, { id: 'card', name: 'Card' }] },
                  { id: 'status', nodes: [{ id: 'success', name: 'Successful' }, { id: 'failed', name: 'Failed' }] },
                ]}
                links={[
                  { from: 'total', to: 'upi',     value: 4000 },
                  { from: 'total', to: 'card',    value: 3200 },
                  { from: 'upi',   to: 'success', value: 3500 },
                  { from: 'upi',   to: 'failed',  value: 500  },
                  { from: 'card',  to: 'success', value: 2800 },
                  { from: 'card',  to: 'failed',  value: 400  },
                ]}
                labelUnit="txn"
              />
            </Box>
          );
        }

        export default App;
      `}
    </Sandbox>
  </StoryPageWrapper>
);

// ─── Story meta ───────────────────────────────────────────────────────────────

export default {
  title: 'Components/Charts/SankeyChart',
  component: SankeyChart,
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
      description: 'Show node label chips.',
    },
    labelUnit: {
      control: { type: 'text' },
      description: 'Unit appended to node value in label chip, e.g. "txn" or "₹".',
    },
    numLevels: {
      control: { type: 'select' },
      options: [2, 3, 4],
      description: 'Number of node columns (levels) in the chart.',
      defaultValue: 4,
    },
    nodesL1: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in Level 1.',
      defaultValue: 1,
    },
    nodesL2: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in Level 2.',
      defaultValue: 4,
    },
    nodesL3: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in Level 3.',
      defaultValue: 3,
      if: { arg: 'numLevels', gt: 2 },
    },
    nodesL4: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Nodes in Level 4.',
      defaultValue: 2,
      if: { arg: 'numLevels', eq: 4 },
    },
    // Hide complex/internal props from Storybook controls
    levels: { table: { disable: true } },
    links: { table: { disable: true } },
    nodeColorOverride: { table: { disable: true } },
    linkColorOverride: { table: { disable: true } },
    testID: { table: { disable: true } },
    onNodeClick: { table: { disable: true } },
    onLinkClick: { table: { disable: true } },
  },
  parameters: {
    docs: { page: Page },
  },
} as Meta<typeof SankeyChart>;

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

// ─── Shared data ──────────────────────────────────────────────────────────────

// Node name pools — used by the dynamic generator for readable labels
const NODE_NAMES: string[][] = [
  ['Total'],
  ['UPI', 'Card', 'Wallet', 'Netbanking', 'BNPL', 'EMI'],
  ['Razorpay', 'PayU', 'Billdesk', 'Stripe', 'CCAvenue', 'PayTM'],
  ['Successful', 'Failed', 'Pending', 'Refunded', 'Disputed', 'Expired'],
];

/**
 * Realistic weight tables per level-index.
 * Weights don't need to sum to 1 — they're normalised at runtime.
 *
 * Level 0 (root): always 1 node, weight = [1]
 * Level 1 (method): UPI dominates (~45%), then Card, Wallet, Netbanking
 * Level 2 (provider): Razorpay leads, then PayU, Billdesk, etc.
 * Level 3 (status): ~87% success rate — realistic payment industry benchmark
 */
const LEVEL_WEIGHTS: number[][] = [
  [1],
  [0.44, 0.28, 0.17, 0.11, 0.07, 0.04], // method
  [0.52, 0.27, 0.21, 0.14, 0.09, 0.06], // provider
  [0.87, 0.13, 0.05, 0.03, 0.02, 0.01], // status (success >> failure)
];

const ROOT_VALUE = 10_000;

function generateChartData(
  nodeCounts: number[],
): {
  levels: { id: string; nodes: { id: string; name: string }[] }[];
  links: { from: string; to: string; value: number }[];
} {
  const levels = nodeCounts.map((count, li) => ({
    id: `level-${li}`,
    nodes: Array.from({ length: count }, (_, ni) => ({
      id: `l${li}-n${ni}`,
      name: NODE_NAMES[li]?.[ni] ?? `L${li + 1} Node ${ni + 1}`,
    })),
  }));

  // Compute normalised weights for each level
  const nodeValue: Record<string, number> = {};
  nodeValue[levels[0].nodes[0].id] = ROOT_VALUE;

  const links: { from: string; to: string; value: number }[] = [];

  for (let li = 0; li < levels.length - 1; li++) {
    const srcNodes = levels[li].nodes;
    const tgtNodes = levels[li + 1].nodes;
    const rawWeights = (LEVEL_WEIGHTS[li + 1] ?? []).slice(0, tgtNodes.length);

    // Pad with small fallback weights if table is shorter than node count
    while (rawWeights.length < tgtNodes.length) rawWeights.push(0.05);
    const weightSum = rawWeights.reduce((s, w) => s + w, 0);
    const normWeights = rawWeights.map((w) => w / weightSum);

    // Total flow from this level
    const totalFlow = srcNodes.reduce((s, n) => s + (nodeValue[n.id] ?? 0), 0);

    // Assign target node values
    tgtNodes.forEach((tgt, ti) => {
      nodeValue[tgt.id] = Math.round(totalFlow * normWeights[ti]);
    });

    // Each source splits proportionally across targets (weighted by target share)
    for (const src of srcNodes) {
      const srcFlow = nodeValue[src.id] ?? 0;
      tgtNodes.forEach((tgt, ti) => {
        links.push({ from: src.id, to: tgt.id, value: Math.round(srcFlow * normWeights[ti]) });
      });
    }
  }

  return { levels, links };
}

// Fixed dataset used by non-configurable stories
const { levels: paymentLevels, links: paymentLinks } = generateChartData([1, 4, 3, 2]);

// ─── Stories ──────────────────────────────────────────────────────────────────

type DefaultStoryArgs = SankeyChartProps & {
  numLevels: 2 | 3 | 4;
  nodesL1: number;
  nodesL2: number;
  nodesL3: number;
  nodesL4: number;
};

export const DefaultSankeyChart: StoryFn<DefaultStoryArgs> = ({
  height = 420,
  showTooltip = true,
  showLabels = true,
  labelUnit = 'txn',
  numLevels = 4,
  nodesL1 = 1,
  nodesL2 = 4,
  nodesL3 = 3,
  nodesL4 = 2,
  levels: _levels,
  links: _links,
  ...props
}: DefaultStoryArgs) => {
  const counts = ([nodesL1, nodesL2, nodesL3, nodesL4] as number[]).slice(0, numLevels);
  const { levels, links } = generateChartData(counts);
  return (
    <ChartsWrapper>
      <Box width="100%" height={`${height}px`}>
        <SankeyChart
          levels={levels}
          links={links}
          height={height}
          showTooltip={showTooltip}
          showLabels={showLabels}
          labelUnit={labelUnit}
          {...props}
        />
      </Box>
    </ChartsWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const SingleColorSankeyChart: StoryFn<typeof SankeyChart> = () => (
  <ChartsWrapper>
    <Box width="100%" display="flex" flexDirection="column" gap="spacing.4">
      <SankeyChart
        levels={paymentLevels}
        links={paymentLinks}
        height={420}
        nodeColorOverride="interactive.background.primary.default"
        linkColorOverride="data.background.categorical.blue.subtle"
        showTooltip={true}
        showLabels={true}
        labelUnit="txn"
      />
    </Box>
  </ChartsWrapper>
);

SingleColorSankeyChart.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

export const SankeyChartWithoutLabels: StoryFn<typeof SankeyChart> = () => (
  <ChartsWrapper>
    <Box width="100%">
      <SankeyChart
        levels={paymentLevels}
        links={paymentLinks}
        height={420}
        nodeColorOverride="interactive.background.primary.default"
        linkColorOverride="data.background.categorical.blue.subtle"
        showTooltip={true}
        showLabels={false}
      />
    </Box>
  </ChartsWrapper>
);

SankeyChartWithoutLabels.parameters = { controls: { disable: true } };

// ─────────────────────────────────────────────────────────────────────────────

export const SankeyChartWithCustomNodeColors: StoryFn<typeof SankeyChart> = () => (
  <ChartsWrapper>
    <Box width="100%">
      <SankeyChart
        levels={[
          {
            id: 'income',
            nodes: [
              {
                id: 'revenue',
                name: 'Revenue',
                color: 'data.background.categorical.blue.moderate',
              },
            ],
          },
          {
            id: 'split',
            nodes: [
              { id: 'cogs', name: 'COGS', color: 'data.background.categorical.orange.moderate' },
              {
                id: 'gp',
                name: 'Gross Profit',
                color: 'data.background.categorical.green.moderate',
              },
            ],
          },
          {
            id: 'outcome',
            nodes: [
              { id: 'opex', name: 'OpEx', color: 'data.background.categorical.red.moderate' },
              {
                id: 'net',
                name: 'Net Profit',
                color: 'data.background.categorical.purple.moderate',
              },
            ],
          },
        ]}
        links={[
          { from: 'revenue', to: 'cogs', value: 400 },
          { from: 'revenue', to: 'gp', value: 600 },
          { from: 'gp', to: 'opex', value: 200 },
          { from: 'gp', to: 'net', value: 400 },
        ]}
        height={320}
        showTooltip={true}
        showLabels={true}
        labelUnit="₹M"
      />
    </Box>
  </ChartsWrapper>
);

SankeyChartWithCustomNodeColors.parameters = { controls: { disable: true } };

// ─── Story display names ──────────────────────────────────────────────────────

DefaultSankeyChart.storyName = 'Default Sankey Chart';
SingleColorSankeyChart.storyName = 'Single Color Sankey Chart';
SankeyChartWithoutLabels.storyName = 'Sankey Chart without Labels';
SankeyChartWithCustomNodeColors.storyName = 'Sankey Chart with Custom Node Colors';
