import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { XAxis, YAxis, CartesianGrid, ChartToolTip, Legend } from '../BaseChartComponents';
import { BarChart, Bar } from './BarCharts';

export default {
  title: 'Components/Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
} as Meta<typeof BarChart>;

const chartData = [
  { name: 'Jan', seriesA: 4000, seriesB: 2400, seriesC: 1200 },
  { name: 'Feb', seriesA: 3000, seriesB: 1398, seriesC: 900 },
  { name: 'Mar', seriesA: 2000, seriesB: 9800, seriesC: 1600 },
  { name: 'Apr', seriesA: 2780, seriesB: 3908, seriesC: 2200 },
  { name: 'May', seriesA: 1890, seriesB: 4800, seriesC: 1700 },
  { name: 'Jun', seriesA: 2390, seriesB: 3800, seriesC: 2100 },
  { name: 'Jul', seriesA: 2390, seriesB: 3800, seriesC: 2100 },
  { name: 'Aug', seriesA: 3000, seriesB: 4800, seriesC: 3000 },
  { name: 'Sep', seriesA: 3500, seriesB: 3400, seriesC: 5300 },
  { name: 'Oct', seriesA: 2000, seriesB: 1400, seriesC: 3300 },
  { name: 'Nov', seriesA: 1400, seriesB: 5400, seriesC: 1300 },
  { name: 'Dec', seriesA: 1200, seriesB: 4600, seriesC: 2000 },
];

// 2.3.a - TinyBarChart
export const TinyBarChart: StoryFn<typeof BarChart> = () => {
  return (
    <div style={{ width: '100px', height: '50px' }}>
      <BarChart data={chartData.slice(0, 6)}>
        <Bar dataKey="seriesA" color="chart.background.categorical.azure.moderate" />
      </BarChart>
    </div>
  );
};

// 2.3.b - SimpleBarChart
export const SimpleBarChart: StoryFn<typeof BarChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart data={chartData.slice(0, 6)}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Bar
          dataKey="seriesA"
          name="Series A"
          color="chart.background.categorical.azure.moderate"
        />
        <Bar
          dataKey="seriesB"
          name="Series B"
          color="chart.background.categorical.orchid.moderate"
        />
      </BarChart>
    </div>
  );
};

// 2.3.c - StackedBarChart
export const StackedBarChart: StoryFn<typeof BarChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart data={chartData}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Bar
          dataKey="seriesA"
          name="Series A"
          stackId="stack-1"
          color="chart.background.sequential.crimson.500"
        />
        <Bar
          dataKey="seriesB"
          name="Series B"
          stackId="stack-1"
          color="chart.background.sequential.crimson.400"
        />
        <Bar
          dataKey="seriesC"
          name="Series C"
          stackId="stack-1"
          color="chart.background.sequential.crimson.300"
        />
      </BarChart>
    </div>
  );
};

export const GroupedBarChart: StoryFn<typeof BarChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart data={chartData.slice(0, 5)}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartToolTip />
        <Legend />
        <Bar dataKey="seriesA" name="Series A" color="chart.background.sequential.azure.500" />
        <Bar dataKey="seriesB" name="Series B" color="chart.background.sequential.crimson.500" />
        <Bar dataKey="seriesC" name="Series C" color="chart.background.sequential.magenta.500" />
      </BarChart>
    </div>
  );
};

// 2.4.d - Vertical Bar Chart
export const VerticalBarChart: StoryFn<typeof BarChart> = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <BarChart data={chartData.slice(0, 5)} layout="vertical">
        <CartesianGrid />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <ChartToolTip />
        <Legend />
        <Bar
          dataKey="seriesA"
          name="Series A"
          color="chart.background.sequential.azure.400"
          stackId="2"
        />
        <Bar
          dataKey="seriesB"
          name="Series B"
          color="chart.background.sequential.azure.500"
          stackId="2"
        />
        <Bar
          dataKey="seriesC"
          name="Series C"
          color="chart.background.sequential.azure.600"
          stackId="2"
        />
      </BarChart>
    </div>
  );
};

TinyBarChart.storyName = 'Tiny Bar Chart';
SimpleBarChart.storyName = 'Simple Bar Chart';
StackedBarChart.storyName = 'Stacked Bar Chart';
VerticalBarChart.storyName = 'Vertical Bar Chart';
