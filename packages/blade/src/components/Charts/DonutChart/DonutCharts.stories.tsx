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

// Custom active shape component
const CustomActiveShape = (props: {
  cx: number;
  cy: number;
  outerRadius: number;
  startAngle: number;
  fill: string;
  name: string;
  value: number;
}): JSX.Element => {
  const { cx, cy, outerRadius, startAngle, fill } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN / 2 + startAngle);
  const cos = Math.cos(-RADIAN / 2 + startAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <path
        d={`M ${sx} ${sy} L ${mx} ${my} L ${ex} ${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={sx} cy={sy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
      <path
        d={`M ${sx} ${sy} L ${mx} ${my} L ${ex} ${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {props.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {props.value}
      </text>
    </g>
  );
};

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <DonutChart data={chartData} dataKey="value" nameKey="name">
        <ChartToolTip />
        <Legend />
      </DonutChart>
    </div>
  );
};

// // 2. Donut Chart with Center Text
// export const DonutChartWithCenterText: StoryFn<typeof DonutChart> = () => {
//   return (
//     <div style={{ width: '100%', height: '400px' }}>
//       <DonutChart
//         data={largeChartData}
//         dataKey="value"
//         nameKey="name"
//         radius="large"
//         centerText="₹1.05L"
//       >
//         <ChartToolTip />
//         <Legend />
//       </DonutChart>
//     </div>
//   );
// };

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '300px', height: '200px' }}>
      <DonutChart data={chartData.slice(0, 3)} dataKey="value" nameKey="name" radius="small">
        <ChartToolTip />
      </DonutChart>
    </div>
  );
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <DonutChart data={chartData} dataKey="value" nameKey="name" radius="extraLarge">
        <ChartToolTip />
        <Legend />
      </DonutChart>
    </div>
  );
};

// 5. Custom Active Shape Donut Chart
export const CustomActiveShapeDonutChart: StoryFn<typeof DonutChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <DonutChart
        data={chartData}
        dataKey="value"
        nameKey="name"
        radius="large"
        activeShape={<CustomActiveShape />}
      >
        <Legend />
      </DonutChart>
    </div>
  );
};

BasicDonutChart.storyName = 'Basic Donut Chart';
// DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
CustomActiveShapeDonutChart.storyName = 'Custom Active Shape Donut Chart';
