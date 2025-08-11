import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ChartTooltip,
} from './AreaCharts';
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

// Data with null values for connectNulls example
const dataWithNulls = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: null },
  { month: 'Apr', sales: null },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

// Simple Area Chart
export const SimpleAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            dataKey="teamA"
            name="Team A"
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Stacked Area Chart
export const StackedAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
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
          />
          <Area
            dataKey="teamB"
            name="Team B"
            type="monotone"
            stackId="1"
          />
          <Area
            dataKey="teamC"
            name="Team C"
            type="monotone"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart that Connects Nulls
export const AreaChartConnectNulls: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dataWithNulls}>
          <CartesianGrid />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            dataKey="sales"
            name="Sales (Connects Nulls)"
            type="monotone"
            connectNulls={true}
            color="feedback.text.positive.subtle"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Tiny Area Chart (Sparkline)
export const TinyAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '200px', height: '80px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <Area
            dataKey="teamA"
            name="Team A"
            type="monotone"
            color="surface.text.gray.normal"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart with Reference Line
export const AreaChartWithReferenceLine: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
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
            color="interactive.background.primary.default"
          />
          <ReferenceLine y={3000} label="Target" color="surface.text.gray.muted" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multiple Area Chart (Non-Stacked)
export const MultipleAreaChart: StoryFn<typeof AreaChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
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
            color="interactive.background.primary.default"
            fillOpacity={0.3}
          />
          <Area
            dataKey="teamB"
            name="Team B"
            type="monotone"
            color="feedback.text.positive.subtle"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart Type Variations
export const AreaTypeVariations: StoryFn<typeof AreaChart> = () => {
  const types: Array<'monotone' | 'linear' | 'step' | 'stepAfter' | 'stepBefore'> = [
    'monotone',
    'linear',
    'step',
    'stepAfter',
    'stepBefore',
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {types.map((type) => (
        <div key={type} style={{ width: '300px', height: '200px' }}>
          <Heading size="small" marginBottom="spacing.2">
            {type.charAt(0).toUpperCase() + type.slice(1)} Type
          </Heading>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.slice(0, 4)}>
              <CartesianGrid />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                dataKey="teamA"
                name="Team A"
                type={type}
                color="interactive.background.primary.default"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

SimpleAreaChart.storyName = 'Simple Area Chart';
StackedAreaChart.storyName = 'Stacked Area Chart';
AreaChartConnectNulls.storyName = 'Area Chart (Connect Nulls)';
TinyAreaChart.storyName = 'Tiny Area Chart';
AreaChartWithReferenceLine.storyName = 'Area Chart with Reference Line';
MultipleAreaChart.storyName = 'Multiple Area Chart';
AreaTypeVariations.storyName = 'Area Type Variations'; 