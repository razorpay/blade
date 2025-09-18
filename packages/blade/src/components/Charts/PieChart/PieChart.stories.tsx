import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ChartPie, ChartPieWrapper, ChartTooltip } from '~components/Charts';

export default {
  title: 'Components/Charts/DonutChart',
  component: ChartPie,
  tags: ['autodocs'],
} as Meta<typeof ChartPie>;

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof ChartPie> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartPieWrapper>
        <ChartPie dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartPieWrapper>
    </div>
  );
};

// 2. Donut Chart with Center Text
export const DonutChartWithCenterText: StoryFn<typeof ChartPie> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartPieWrapper centerText="₹1.05L">
        <ChartPie dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartPieWrapper>
    </div>
  );
};

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof ChartPie> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartPieWrapper>
        <ChartPie dataKey="value" nameKey="name" data={chartData} radius="small" />
        <ChartTooltip />
      </ChartPieWrapper>
    </div>
  );
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof ChartPie> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartPieWrapper>
        <ChartPie dataKey="value" nameKey="name" data={chartData} radius="large" />
        <ChartTooltip />
      </ChartPieWrapper>
    </div>
  );
};

// 5. Custom Active Shape Donut Chart
export const CustomActiveShapeDonutChart: StoryFn<typeof ChartPie> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartPieWrapper>
        <ChartPie dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartPieWrapper>
    </div>
  );
};

// 6. Donut Chart with Color Theme
export const DonutChartWithActiveShape: StoryFn<typeof ChartPie> = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChartPieWrapper>
        <ChartPie dataKey="value" nameKey="name" data={chartData} />
        <ChartTooltip />
      </ChartPieWrapper>
    </div>
  );
};

BasicDonutChart.storyName = 'Basic Donut Chart';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
CustomActiveShapeDonutChart.storyName = 'Custom Active Shape Donut Chart';
DonutChartWithActiveShape.storyName = 'Donut Chart with Color theme';
