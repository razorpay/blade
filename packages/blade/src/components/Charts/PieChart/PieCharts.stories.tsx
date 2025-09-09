import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { PieChart, Pie } from './PieCharts';

export default {
  title: 'Components/Charts/DonutChart',
  component: PieChart,
  tags: ['autodocs'],
} as Meta<typeof PieChart>;

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PieChart dataKey="value">
        <Pie dataKey="value" nameKey="name" data={chartData} />
      </PieChart>
    </div>
  );
};

// 2. Donut Chart with Center Text
export const DonutChartWithCenterText: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PieChart centerText="₹1.05L">
        <Pie dataKey="value" nameKey="name" data={chartData} />
      </PieChart>
    </div>
  );
};

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PieChart>
        <Pie dataKey="value" nameKey="name" data={chartData} />
      </PieChart>
    </div>
  );
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PieChart>
        <Pie dataKey="value" nameKey="name" data={chartData} />
      </PieChart>
    </div>
  );
};

// 5. Custom Active Shape Donut Chart
export const CustomActiveShapeDonutChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PieChart>
        <Pie dataKey="value" nameKey="name" data={chartData} />
      </PieChart>
    </div>
  );
};

// 6. Donut Chart with Color Theme
export const DonutChartWithActiveShape: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PieChart>
        <Pie dataKey="value" nameKey="name" data={chartData} />
      </PieChart>
    </div>
  );
};

BasicDonutChart.storyName = 'Basic Donut Chart';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
CustomActiveShapeDonutChart.storyName = 'Custom Active Shape Donut Chart';
DonutChartWithActiveShape.storyName = 'Donut Chart with Color theme';
