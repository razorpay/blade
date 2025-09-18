import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ChartDonut, ChartDonutWrapper, ChartTooltip } from '~components/Charts';

export default {
  title: 'Components/Charts/DonutChart',
  component: ChartDonut,
  tags: ['autodocs'],
} as Meta<typeof ChartDonut>;

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartDonutWrapper>
        <ChartDonut dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartDonutWrapper>
    </div>
  );
};

// 2. Donut Chart with Center Text
export const DonutChartWithCenterText: StoryFn<typeof ChartDonut> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartDonutWrapper centerText="₹1.05L">
        <ChartDonut dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartDonutWrapper>
    </div>
  );
};

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartDonutWrapper>
        <ChartDonut dataKey="value" nameKey="name" data={chartData} radius="small" />
        <ChartTooltip />
      </ChartDonutWrapper>
    </div>
  );
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartDonutWrapper>
        <ChartDonut dataKey="value" nameKey="name" data={chartData} radius="large" />
        <ChartTooltip />
      </ChartDonutWrapper>
    </div>
  );
};

// 5. Custom Active Shape Donut Chart
export const CustomActiveShapeDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartDonutWrapper>
        <ChartDonut dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartDonutWrapper>
    </div>
  );
};

// 6. Donut Chart with Color Theme
export const DonutChartWithActiveShape: StoryFn<typeof ChartDonut> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartDonutWrapper>
        <ChartDonut dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartDonutWrapper>
    </div>
  );
};

BasicDonutChart.storyName = 'Basic Donut Chart';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
CustomActiveShapeDonutChart.storyName = 'Custom Active Shape Donut Chart';
DonutChartWithActiveShape.storyName = 'Donut Chart with Color theme';
