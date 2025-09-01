import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ChartToolTip,
  Legend,
  ReferenceLine,
} from '../BaseChartComponents';
import { LineChart, Line } from './lineCharts';
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
              <LineChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="sales" name="Sales" />
              </LineChart>
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
  { date: 'Apr', historical: 2500, forecast: 2500 },
  { date: 'May', historical: null, forecast: 4000 },
  { date: 'Jun', historical: null, forecast: 2390 },
];

// Data with null values for connectNulls example
const dataWithNulls = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: null },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

// Data for stepped line chart example
const steppedData = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 150 },
  { month: 'Mar', value: 120 },
  { month: 'Apr', value: 200 },
  { month: 'May', value: 180 },
  { month: 'Jun', value: 250 },
];

// Simple Line Chart Example
export const SimpleLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LineChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Line
          dataKey="teamA"
          name="Team A"
          strokeStyle="solid"
          color="chart.background.categorical.azure.moderate"
        />
        <Line
          dataKey="teamB"
          name="Team B"
          strokeStyle="solid"
          color="chart.background.categorical.emerald.moderate"
        />
        <ReferenceLine y={1500} label="Avg: 1200" />
      </LineChart>
    </div>
  );
};

// Tiny Line Chart Example (no dots for cleaner look)
export const TinyLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '200px', height: '100px' }}>
      <LineChart data={chartData}>
        <Line
          dataKey="teamA"
          strokeStyle="solid"
          color="chart.background.categorical.azure.strong"
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </div>
  );
};

// Line Chart with Custom Dots
export const LineChartWithCustomDots: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LineChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Line
          dataKey="teamA"
          name="Team A (No Dots)"
          strokeStyle="solid"
          color="chart.background.categorical.azure.moderate"
          dot={false}
          activeDot={true}
        />
        <Line
          dataKey="teamB"
          name="Team B (Custom Dots)"
          strokeStyle="solid"
          color="chart.background.categorical.crimson.moderate"
          dot={{ r: 6, fill: '#22c55e', stroke: '#16a34a', strokeWidth: 2 }}
          activeDot={{ r: 8, fill: '#22c55e', stroke: '#ffffff', strokeWidth: 3 }}
        />
      </LineChart>
    </div>
  );
};

// Showcase Different Dot Configurations
export const DotConfigurationShowcase: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LineChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="month" label="Months" />
        <YAxis dataKey="teamA" label="Active Users" />
        <ChartToolTip />
        <Legend />
        {/* Default dots */}
        <Line
          dataKey="teamA"
          name="Default Dots"
          color="chart.background.categorical.azure.moderate"
          dot={true}
          activeDot={true}
        />
      </LineChart>
    </div>
  );
};

// Forecast Line Chart Example
export const ForecastLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LineChart data={forecastData}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Line
          dataKey="historical"
          name="Historical Data"
          connectNulls={true}
          color="chart.background.categorical.azure.moderate"
        />
        <Line
          dataKey="forecast"
          name="Forecast"
          strokeStyle="dashed"
          connectNulls={true}
          showLegend={false}
          color="chart.background.categorical.gray.moderate"
        />
      </LineChart>
    </div>
  );
};

// Line Chart that Connects Nulls
export const LineChartConnectNulls: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Heading size="small">Line Chart that do not Connects Nulls (default)</Heading>
      <LineChart data={dataWithNulls}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Line
          dataKey="sales"
          name="Sales (Connects Nulls)"
          color="chart.background.categorical.emerald.moderate"
        />
      </LineChart>
      <Heading size="small">Line Chart that Connects Nulls</Heading>
      <LineChart data={dataWithNulls}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Line
          dataKey="sales"
          name="Sales (Connects Nulls)"
          connectNulls={true}
          color="chart.background.categorical.emerald.moderate"
        />
      </LineChart>
    </div>
  );
};

// Stepped Line Chart Example
export const SteppedLineChart: StoryFn<typeof LineChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LineChart data={steppedData}>
        <CartesianGrid />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Line
          dataKey="value"
          name="Stepped Line"
          type="step"
          color="chart.background.categorical.azure.moderate"
        />
      </LineChart>
    </div>
  );
};

SimpleLineChart.storyName = 'Simple Line Chart';
TinyLineChart.storyName = 'Tiny Line Chart';
LineChartWithCustomDots.storyName = 'Line Chart with Custom Dots';
DotConfigurationShowcase.storyName = 'Dot Configuration Showcase';
ForecastLineChart.storyName = 'Forecast Line Chart';
LineChartConnectNulls.storyName = 'Line Chart (Connect Nulls)';
SteppedLineChart.storyName = 'Stepped Line Chart';
