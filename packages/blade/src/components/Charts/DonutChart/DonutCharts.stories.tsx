import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ChartToolTip, Legend } from '../BaseChartComponents';
import { DonutChart, Pie } from './DonutCharts';

export default {
  title: 'Components/Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
} as Meta<typeof DonutChart>;

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

const largeChartData = [
  { name: 'Revenue', value: 4500 },
  { name: 'Expenses', value: 3200 },
  { name: 'Profit', value: 1300 },
  { name: 'Taxes', value: 800 },
];

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DonutChart data={chartData} dataKey="value" nameKey="name" radius="small">
        <ChartToolTip />
        <Legend />
      </DonutChart>
    </div>
  );
};

// 2. Donut Chart with Center Text
export const DonutChartWithCenterText: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DonutChart
        data={largeChartData}
        dataKey="value"
        nameKey="name"
        radius="small"
        centerText="₹1.05L"
      >
        <ChartToolTip />
        <Legend />
      </DonutChart>
    </div>
  );
};

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DonutChart data={chartData.slice(0, 3)} dataKey="value" nameKey="name" radius="small">
        <ChartToolTip />
      </DonutChart>
    </div>
  );
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DonutChart data={chartData} dataKey="value" nameKey="name" radius="large">
        <ChartToolTip />
        <Legend />
      </DonutChart>
    </div>
  );
};

// 5. Custom Active Shape Donut Chart
export const CustomActiveShapeDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DonutChart data={chartData} dataKey="value" nameKey="name" radius="large">
        <Legend />
      </DonutChart>
    </div>
  );
};

// 6. Donut Chart with Color Theme
export const DonutChartWithActiveShape: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DonutChart data={chartData} dataKey="value" nameKey="name" radius="large">
        <Legend />
      </DonutChart>
    </div>
  );
};

BasicDonutChart.storyName = 'Basic Donut Chart';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
CustomActiveShapeDonutChart.storyName = 'Custom Active Shape Donut Chart';
DonutChartWithActiveShape.storyName = 'Donut Chart with Color theme';
