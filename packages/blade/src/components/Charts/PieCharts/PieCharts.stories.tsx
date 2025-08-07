import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ChartTooltip,
} from './PieCharts';
import { Heading } from '~components/Typography/Heading';
import { Text } from '~components/Typography/Text';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="PieChart"
      componentDescription="A Pie Chart component built on top of Recharts with Blade design system styling."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
          PieChart, 
          Pie, 
          Cell,
          Tooltip, 
          Legend, 
          ResponsiveContainer 
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { name: 'Group A', value: 400 },
            { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 },
            { name: 'Group D', value: 200 },
          ];
          
          const COLORS = ['interactive.background.primary.default', 'feedback.text.positive.subtle', 'feedback.text.notice.subtle', 'surface.text.gray.muted'];
          
          return (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
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
  title: 'Components/Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof PieChart>;

// Sample data for charts
const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = [
  'interactive.background.primary.default',
  'feedback.text.positive.subtle',
  'feedback.text.notice.subtle',
  'surface.text.gray.muted',
];

// 1. Simple Pie Chart
export const SimplePieChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" label={<Label />}>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Half Pie Chart (StraightAngleChart)
export const HalfPieChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            circleType="half"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Simple Donut Chart
export const DonutChart: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            donutRadius="medium"
            paddingAngle="small"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Donut with Text in Center
export const DonutWithCenterText: StoryFn<typeof PieChart> = () => {
  const totalValue = pieData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            donutRadius="large"
            paddingAngle="small"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                      >
                        {totalValue.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} style={{ fontSize: '14px' }}>
                        Total
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 5. Donut Size Variations
export const DonutSizeVariations: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {(['small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
        <div key={size} style={{ width: '200px', height: '200px' }}>
          <Text size="medium" weight="semibold" marginBottom="spacing.2">
            {size.charAt(0).toUpperCase() + size.slice(1)} Donut
          </Text>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData.slice(0, 3)} dataKey="value" cx="50%" cy="50%" donutRadius={size}>
                {pieData.slice(0, 3).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

// 6. Circle Type Variations
export const CircleTypeVariations: StoryFn<typeof PieChart> = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {(['full', 'half', 'quarter'] as const).map((type) => (
        <div key={type} style={{ width: '250px', height: '250px' }}>
          <Text size="medium" weight="semibold" marginBottom="spacing.2">
            {type.charAt(0).toUpperCase() + type.slice(1)} Circle
          </Text>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                circleType={type}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

SimplePieChart.storyName = 'Simple Pie Chart';
HalfPieChart.storyName = 'Half Pie Chart';
DonutChart.storyName = 'Donut Chart';
DonutWithCenterText.storyName = 'Donut with Center Text';
DonutSizeVariations.storyName = 'Donut Size Variations';
CircleTypeVariations.storyName = 'Circle Type Variations';
