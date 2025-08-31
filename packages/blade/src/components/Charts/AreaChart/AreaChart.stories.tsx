import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { XAxis, YAxis, CartesianGrid } from '../BaseChartComponents/axis';
import { Tooltip, Legend, ReferenceLine } from '../LineCharts';
import { AreaChart, Area } from './AreaCharts';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AreaChart"
      componentDescription="An Area Chart component built on top of Recharts with Blade design system styling."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
          AreaChart, 
          Area, 
          XAxis, 
          YAxis, 
          CartesianGrid, 
          Tooltip, 
          Legend, 
          ResponsiveContainer 
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="teamA" name="Team A" />
              </AreaChart>
            </ResponsiveContainer>
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
  component: AreaChart,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof AreaChart>;

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
export const SimpleAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <AreaChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.intense"
        />
      </AreaChart>
    </div>
  );
};

// 2.2.b - Stacked Area Chart
export const StackedAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <AreaChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          dataKey="teamA"
          name="Team A"
          type="monotone"
          stackId="1"
          color="chart.background.categorical.azure.moderate"
        />
        <Area
          dataKey="teamB"
          name="Team B"
          type="monotone"
          stackId="1"
          color="chart.background.categorical.emerald.moderate"
        />
      </AreaChart>
    </div>
  );
};

// 2.2.c - Area Chart that Connects Nulls
export const AreaChartConnectNulls: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Heading size="small">Area Chart that does not Connects Nulls :- </Heading>
      <AreaChart width={500} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="pv"
          name="Page A"
          connectNulls
          color="chart.background.categorical.emerald.moderate"
        />
        <Area
          type="monotone"
          dataKey="uv"
          name="Page A"
          color="chart.background.categorical.azure.moderate"
        />
      </AreaChart>
      <Heading size="small">Area Chart that Connects Nulls :- </Heading>
      <AreaChart width={500} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="pv"
          name="Page A"
          connectNulls
          color="chart.background.categorical.emerald.moderate"
        />
        <Area
          type="monotone"
          dataKey="uv"
          name="Page A"
          connectNulls
          color="chart.background.categorical.azure.moderate"
        />
      </AreaChart>
    </div>
  );
};

// 2.2.d - Tiny Area Chart (Sparkline)
export const TinyAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '200px', height: '80px' }}>
      <AreaChart data={chartData}>
        <Area
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.intense"
        />
      </AreaChart>
    </div>
  );
};

// Area Chart with Reference Line
export const AreaChartWithReferenceLine: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <AreaChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          dataKey="teamA"
          name="Team A"
          type="monotone"
          color="chart.background.categorical.azure.moderate"
        />
        <ReferenceLine y={3000} label="Target" color="chart.background.categorical.gray.intense" />
      </AreaChart>
    </div>
  );
};

SimpleAreaChart.storyName = 'Simple Area Chart';
StackedAreaChart.storyName = 'Stacked Area Chart';
AreaChartConnectNulls.storyName = 'Area Chart (Connect Nulls)';
TinyAreaChart.storyName = 'Tiny Area Chart';
AreaChartWithReferenceLine.storyName = 'Area Chart with Reference Line';
