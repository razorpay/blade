import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ChartTooltip,
} from './lineCharts';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="LineChart"
      componentDescription="A Line Chart component built on top of Recharts with Blade design system styling."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
          LineChart, 
          Line, 
          XAxis, 
          YAxis, 
          CartesianGrid, 
          Tooltip, 
          Legend, 
          ResponsiveContainer 
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { name: 'Jan', sales: 4000 },
            { name: 'Feb', sales: 3000 },
            { name: 'Mar', sales: 2000 },
          ];
          
          return (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="sales" name="Sales" />
              </LineChart>
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
  title: 'Components/Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof LineChart>;

// Sample data for charts
const chartData = [
  { month: 'Jan', teamA: 4000, teamB: 2400 },
  { month: 'Feb', teamA: 3000, teamB: 1398 },
  { month: 'Mar', teamA: 2000, teamB: 9800 },
  { month: 'Apr', teamA: 2780, teamB: 3908 },
  { month: 'May', teamA: 1890, teamB: 4800 },
  { month: 'Jun', teamA: 2390, teamB: 3800 },
];

const forecastData = [
  { date: 'Jan', historical: 4000, forecast: null },
  { date: 'Feb', historical: 3000, forecast: null },
  { date: 'Mar', historical: 2000, forecast: null },
  { date: 'Apr', historical: null, forecast: 2780 },
  { date: 'May', historical: null, forecast: 1890 },
  { date: 'Jun', historical: null, forecast: 2390 },
];

// Simple Line Chart Example
export const SimpleLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            dataKey="teamA"
            name="Team A"
            strokeStyle="solid"
            color="interactive.background.primary.default"
          />
          <Line
            dataKey="teamB"
            name="Team B"
            strokeStyle="solid"
            color="feedback.text.positive.subtle"
          />
          <ReferenceLine y={2200} label="Minimum" color="surface.text.gray.muted" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Tiny Line Chart Example
export const TinyLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '200px', height: '100px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            dataKey="teamA"
            strokeStyle="solid"
            color="surface.text.gray.normal"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Forecast Line Chart Example
export const ForecastLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={forecastData}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip />
          <Legend />
          <Line
            dataKey="historical"
            name="Historical Data"
            connectNulls={true}
            color="interactive.background.primary.default"
          />
          <Line
            dataKey="forecast"
            name="Forecast"
            strokeStyle="dashed"
            connectNulls={true}
            legendType="none"
            color="feedback.text.notice.subtle"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

SimpleLineChart.storyName = 'Simple Line Chart';
TinyLineChart.storyName = 'Tiny Line Chart';
ForecastLineChart.storyName = 'Forecast Line Chart';