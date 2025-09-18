import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  ChartBar,
  ChartBarWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '~components/Charts';

export default {
  title: 'Components/Charts/BarChart',
  component: ChartBar,
  tags: ['autodocs'],
} as Meta<typeof ChartBar>;

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

export const TinyBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <div style={{ width: '100px', height: '50px' }}>
      <ChartBarWrapper data={chartData.slice(0, 6)}>
        <ChartBar dataKey="seriesA" color="chart.background.categorical.azure.moderate" />
      </ChartBarWrapper>
    </div>
  );
};

export const SimpleBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ChartBarWrapper data={chartData.slice(0, 6)}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartBar
          dataKey="seriesA"
          name="Series A"
          color="chart.background.categorical.azure.moderate"
        />
        <ChartBar
          dataKey="seriesB"
          name="Series B"
          color="chart.background.categorical.orchid.moderate"
        />
      </ChartBarWrapper>
    </div>
  );
};

export const StackedBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ChartBarWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartBar
          dataKey="seriesA"
          name="Series A"
          stackId="stack-1"
          color="chart.background.sequential.crimson.500"
        />
        <ChartBar
          dataKey="seriesB"
          name="Series B"
          stackId="stack-1"
          color="chart.background.sequential.crimson.400"
        />
        <ChartBar
          dataKey="seriesC"
          name="Series C"
          stackId="stack-1"
          color="chart.background.sequential.crimson.300"
        />
      </ChartBarWrapper>
    </div>
  );
};

export const GroupedBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ChartBarWrapper data={chartData.slice(0, 5)}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartBar dataKey="seriesA" name="Series A" color="chart.background.sequential.azure.500" />
        <ChartBar
          dataKey="seriesB"
          name="Series B"
          color="chart.background.sequential.crimson.500"
        />
        <ChartBar
          dataKey="seriesC"
          name="Series C"
          color="chart.background.sequential.magenta.500"
        />
      </ChartBarWrapper>
    </div>
  );
};

export const VerticalBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ChartBarWrapper data={chartData.slice(0, 5)} layout="vertical">
        <ChartCartesianGrid />
        <ChartXAxis type="number" />
        <ChartYAxis type="category" dataKey="name" />
        <ChartTooltip />
        <ChartLegend />
        <ChartBar
          dataKey="seriesA"
          name="Series A"
          color="chart.background.sequential.azure.400"
          stackId="2"
        />
        <ChartBar
          dataKey="seriesB"
          name="Series B"
          color="chart.background.sequential.azure.500"
          stackId="2"
        />
        <ChartBar
          dataKey="seriesC"
          name="Series C"
          color="chart.background.sequential.azure.600"
          stackId="2"
        />
      </ChartBarWrapper>
    </div>
  );
};

export const BarChartWithInformationalColorTheme: StoryFn<typeof ChartBar> = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ChartBarWrapper data={chartData.slice(0, 5)} layout="vertical" colorTheme="default">
        <ChartCartesianGrid />
        <ChartXAxis type="number" />
        <ChartYAxis type="category" dataKey="name" />
        <ChartTooltip />
        <ChartLegend />
        <ChartBar dataKey="seriesA" name="Series A" stackId="2" />
        <ChartBar dataKey="seriesB" name="Series B" stackId="2" />
        <ChartBar dataKey="seriesC" name="Series C" stackId="2" />
      </ChartBarWrapper>
    </div>
  );
};

TinyBarChart.storyName = 'Tiny Bar Chart';
SimpleBarChart.storyName = 'Simple Bar Chart';
StackedBarChart.storyName = 'Stacked Bar Chart';
VerticalBarChart.storyName = 'Vertical Bar Chart';
BarChartWithInformationalColorTheme.storyName = 'Bar Chart With Informational Color Theme';
