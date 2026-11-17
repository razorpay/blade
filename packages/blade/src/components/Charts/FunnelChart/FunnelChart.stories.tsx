import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import {
  ChartFunnel,
  ChartFunnelWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
} from '~components/Charts';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FunnelChart"
      componentDescription="A Funnel Chart shows how many reach each step of a sequence and how many drop off between steps, built on top of Recharts with Blade design system styling."
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Charts/_decisions/decisions.md#38-funnel-chart"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
          import {
            ChartFunnel,
            ChartFunnelWrapper,
            ChartXAxis,
            ChartYAxis,
            ChartCartesianGrid,
            ChartTooltip,
            Box,
          } from '@razorpay/blade/components';

          function App() {
            const steps = [
              { step: 'Carts abandoned', count: 34 },
              { step: 'Calls made', count: 19 },
              { step: 'Calls connected', count: 19 },
              { step: 'Ordered within 24 hours', count: 5 },
            ];

            return (
              <Box width="100%" height="300px">
                <ChartFunnelWrapper data={steps}>
                  <ChartCartesianGrid />
                  <ChartXAxis dataKey="step" />
                  <ChartYAxis />
                  <ChartTooltip />
                  <ChartFunnel dataKey="count" />
                </ChartFunnelWrapper>
              </Box>
            );
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  CHART_FUNNEL_PROPS: 'ChartFunnel Props',
};

export default {
  title: 'Components/Charts/FunnelChart',
  component: ChartFunnel,
  tags: ['autodocs'],
  argTypes: {
    dataKey: { control: { type: 'text' }, table: { category: propsCategory.CHART_FUNNEL_PROPS } },
    name: { control: { type: 'text' }, table: { category: propsCategory.CHART_FUNNEL_PROPS } },
    droppedName: {
      control: { type: 'text' },
      table: { category: propsCategory.CHART_FUNNEL_PROPS },
    },
    color: { control: { type: 'text' }, table: { category: propsCategory.CHART_FUNNEL_PROPS } },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof ChartFunnel>;

const abandonedCartSteps = [
  { step: 'Carts abandoned', count: 34 },
  { step: 'Calls made', count: 19 },
  { step: 'Calls connected', count: 19 },
  { step: 'Ordered within 24 hours', count: 5 },
];

const onboardingSteps = [
  { step: 'Landing page', count: 48210 },
  { step: 'Signed up', count: 31560 },
  { step: 'Verified email', count: 27904 },
  { step: 'Completed KYC', count: 19870 },
  { step: 'Added bank account', count: 15422 },
  { step: 'Created payment link', count: 9811 },
  { step: 'Shared payment link', count: 7302 },
  { step: 'First payment', count: 4120 },
  { step: 'Second payment', count: 2210 },
];

const FunnelStory = ({
  data,
  height = '300px',
  ...funnelProps
}: {
  data: { step: string; count: number }[];
  height?: string;
} & Partial<React.ComponentProps<typeof ChartFunnel>>): React.ReactElement => (
  <Box width="100%" height={height}>
    <ChartFunnelWrapper data={data}>
      <ChartCartesianGrid />
      <ChartXAxis dataKey="step" />
      <ChartYAxis />
      <ChartTooltip />
      <ChartFunnel dataKey="count" {...funnelProps} />
    </ChartFunnelWrapper>
  </Box>
);

export const Default: StoryFn<typeof ChartFunnel> = (args) => (
  <FunnelStory data={abandonedCartSteps} {...args} />
);

export const ManySteps: StoryFn<typeof ChartFunnel> = () => (
  <FunnelStory data={onboardingSteps} height="360px" />
);

export const FullDrop: StoryFn<typeof ChartFunnel> = () => (
  <FunnelStory
    data={[
      { step: 'Opened checkout', count: 4200 },
      { step: 'Entered card', count: 1800 },
      { step: 'Paid', count: 0 },
    ]}
  />
);

export const SingleStep: StoryFn<typeof ChartFunnel> = () => (
  <FunnelStory data={[{ step: 'Opened checkout', count: 12840 }]} />
);

export const Empty: StoryFn<typeof ChartFunnel> = () => <FunnelStory data={[]} />;

export const CustomColorAndLabels: StoryFn<typeof ChartFunnel> = () => (
  <FunnelStory
    data={abandonedCartSteps}
    color="data.background.categorical.green.moderate"
    name="Converted"
    droppedName="Lost"
    formatValue={(value) => `${value} carts`}
  />
);

export const Compact: StoryFn<typeof ChartFunnel> = () => (
  <Box width="360px" height="96px">
    <ChartFunnelWrapper data={abandonedCartSteps}>
      <ChartXAxis dataKey="step" hide />
      <ChartTooltip />
      <ChartFunnel dataKey="count" />
    </ChartFunnelWrapper>
  </Box>
);

[ManySteps, FullDrop, SingleStep, Empty, CustomColorAndLabels, Compact].forEach((story) => {
  story.parameters = { controls: { disable: true } };
});
