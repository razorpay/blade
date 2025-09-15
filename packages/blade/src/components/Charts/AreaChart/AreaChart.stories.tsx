import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  ChartAreaWrapper,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartReferenceLine,
} from '~components/Charts';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AreaChart"
      componentDescription="An Area Chart component built on top of Recharts with Blade design system styling."
      apiDecisionLink={
        'https://github.com/razorpay/blade/blob/5920fbd32c70793454f8c8c6ff544b2a7413afb5/packages/blade/src/components/Charts/_decisions/decisions.md'
      }
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188717&p=f&m=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
         AreaChart,
         Area,
         AreaChartXAxis,
         AreaChartYAxis,
         AreaChartCartesianGrid,
         AreaChartChartTooltip,
         AreaChartLegend,
         AreaChartReferenceLine,
         Box,
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { month: 'Jan', teamA: 4000 },
            { month: 'Feb', teamA: 3000 },
            { month: 'Mar', teamA: 2000 },
            { month: 'Apr', teamA: 2780 },
            { month: 'May', teamA: 1890 },
            { month: 'Jun', teamA: 2390 },
          ];
          
          return (
            <Box width="100%" height="100%">
              <AreaChart data={data}>
                <AreaChartCartesianGrid />
                <AreaChartXAxis dataKey="month" />
                <AreaChartYAxis />
                <AreaChartChartTooltip />
                <Area dataKey="teamA" name="Team A" />
              </AreaChart>
            </Box>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Charts/AreaChart',
  component: ChartArea,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof ChartArea>;

// Sample data for charts
const chartData = [
  { month: 'Jan', teamA: 4000, teamB: 2400, teamC: 1800 },
  { month: 'Feb', teamA: 3000, teamB: 1398, teamC: 2200 },
  { month: 'Mar', teamA: 2000, teamB: 9800, teamC: 1500 },
  { month: 'Apr', teamA: 2780, teamB: 3908, teamC: 2800 },
  { month: 'May', teamA: 1890, teamB: 4800, teamC: 2100 },
  { month: 'Jun', teamA: 2390, teamB: 3800, teamC: 2500 },
];

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    pv: 3908,
    amt: 2000,
    uv: null,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// 2.2.a - Simple Area Chart
export const SimpleAreaChart: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="500px">
      <ChartAreaWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartArea
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.intense"
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// 2.2.b - Stacked Area Chart
export const StackedAreaChart: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="500px">
      <ChartAreaWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea
          dataKey="teamA"
          name="Team A"
          type="monotone"
          stackId="1"
          color="chart.background.categorical.azure.moderate"
        />
        <ChartArea
          dataKey="teamB"
          name="Team B"
          type="monotone"
          stackId="1"
          color="chart.background.categorical.emerald.moderate"
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// 2.2.c - Area Chart that Connects Nulls
export const AreaChartConnectNulls: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="100%">
      <Heading size="small">Area Chart that does not Connects Nulls :- </Heading>
      <Box width="500px" height="200px">
        <ChartAreaWrapper data={data}>
          <ChartCartesianGrid strokeDasharray="3 3" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartArea
            type="monotone"
            dataKey="pv"
            name="Page A"
            connectNulls
            color="chart.background.categorical.emerald.moderate"
          />
          <ChartArea
            type="monotone"
            dataKey="uv"
            name="Page A"
            color="chart.background.categorical.azure.moderate"
          />
        </ChartAreaWrapper>
      </Box>

      <Heading size="small">Area Chart that Connects Nulls :- </Heading>
      <Box width="500px" height="200px">
        <ChartAreaWrapper data={data}>
          <ChartCartesianGrid strokeDasharray="3 3" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartArea
            type="monotone"
            dataKey="pv"
            name="Page A"
            connectNulls
            color="chart.background.categorical.emerald.moderate"
          />
          <ChartArea
            type="monotone"
            dataKey="uv"
            name="Page A"
            connectNulls
            color="chart.background.categorical.azure.moderate"
          />
        </ChartAreaWrapper>
      </Box>
    </Box>
  );
};

// 2.2.d - Tiny Area Chart (Sparkline)
export const TinyAreaChart: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100px" height="50px">
      <ChartAreaWrapper data={chartData}>
        <ChartArea
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.intense"
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// Area Chart with Reference Line
export const AreaChartWithReferenceLine: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData}>
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartXAxis dataKey="month" />
        <ChartXAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.moderate"
        />
        <ChartReferenceLine y={3000} label="Target" />
      </ChartAreaWrapper>
    </Box>
  );
};

export const AreaChartWithReferenceLineVertical: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.moderate"
        />
        <ChartReferenceLine x="Apr" label="Target" />
      </ChartAreaWrapper>
    </Box>
  );
};

// Area Chart with Default Color Theme
export const AreaChartWithDefaultColorTheme: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData} colorTheme="default">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea dataKey="teamA" name="Success" />
        <ChartArea dataKey="teamB" name="Warnings" />
      </ChartAreaWrapper>
    </Box>
  );
};

AreaChartWithDefaultColorTheme.storyName = 'Area Chart with Color Theme';
SimpleAreaChart.storyName = 'Simple Area Chart';
StackedAreaChart.storyName = 'Stacked Area Chart';
AreaChartConnectNulls.storyName = 'Area Chart (Connect Nulls)';
TinyAreaChart.storyName = 'Tiny Area Chart';
AreaChartWithReferenceLine.storyName = 'Area Chart with Reference Line';
AreaChartWithReferenceLineVertical.storyName = 'Area Chart with Reference Line (Vertical)';
