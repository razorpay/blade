import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  ChartDonut,
  ChartDonutWrapper,
  ChartTooltip,
  ChartLegend,
  ChartDonutCell,
} from '~components/Charts';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Amount } from '~components/Amount';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="DonutChart"
      componentDescription="A Donut component built on top of Recharts with Blade design system styling."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=93596-50164&m=dev"
      apiDecisionLink="https://github.com/razorpay/blade/tree/master/packages/blade/src/components/Charts/_decisions"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
        ChartDonut,
        ChartDonutWrapper,
        ChartTooltip,
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { name: 'Jan', sales: 4000 },
            { name: 'Feb', sales: 3000 },
            { name: 'Mar', sales: 2000 },
          ];
          
          return (
              <ChartDonutWrapper data={data}>
                <ChartDonut dataKey="sales" nameKey="name" data={data} />
                <ChartTooltip />
              </ChartDonutWrapper>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  CHAT_DONUT_PROPS: 'ChartDonut Props',
};

export default {
  title: 'Components/Charts/DonutChart',
  component: ChartDonut,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['circle', 'semicircle'],
      table: {
        category: propsCategory.CHAT_DONUT_PROPS,
      },
    },
    radius: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      table: {
        category: propsCategory.CHAT_DONUT_PROPS,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof ChartDonut>;

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof ChartDonut> = ({ ...args }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper width="500px" height="300px">
        <ChartDonut {...args} dataKey="value" nameKey="name" data={chartData} />
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
};

// 2. Donut Chart with Center Text
export const DonutChartWithCenterText: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper content={{ label: 'Total', value: '1300' }} width="500px" height="300px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData} radius="medium">
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
};

DonutChartWithCenterText.parameters = {
  controls: { disable: true },
};

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper width="500px" height="500px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData} radius="small">
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
};

SmallRadiusDonutChart.parameters = {
  controls: { disable: true },
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper width="500px" height="400px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData} radius="large">
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartTooltip />
        <ChartLegend />
      </ChartDonutWrapper>
    </Box>
  );
};

ExtraLargeRadiusDonutChart.parameters = {
  controls: { disable: true },
};

// 5. Custom Active Shape Donut Chart
export const ChartWithToolTip: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper width="500px" height="300px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData}>
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartTooltip />
        <ChartLegend />
      </ChartDonutWrapper>
    </Box>
  );
};

ChartWithToolTip.parameters = {
  controls: { disable: true },
};

// 6. Donut Chart with Color Theme
export const DonutChartWithColorTheme: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper width="500px" height="300px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData} colorTheme="categorical" />
        <ChartTooltip />
        <ChartLegend />
      </ChartDonutWrapper>
    </Box>
  );
};

DonutChartWithColorTheme.parameters = {
  controls: { disable: true },
};

// 7. Donut Chart with Semi Circle
export const SemiCircleDonutChart: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper width="500px" height="300px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData} type="semicircle">
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
};

SemiCircleDonutChart.parameters = {
  controls: { disable: true },
};

// 8. Donut Chart with Center Text
export const SemiCircleDonutChartWithCenterText: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper content={{ value: '1300' }} width="500px" height="300px">
        <ChartTooltip />
        <ChartDonut dataKey="value" nameKey="name" data={chartData} type="semicircle">
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
      </ChartDonutWrapper>
    </Box>
  );
};

SemiCircleDonutChartWithCenterText.parameters = {
  controls: { disable: true },
};

// 9. Donut Chart with Amount
export const DonutChartWithAmount: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      flexDirection="column"
    >
      <Box>
        <ChartDonutWrapper
          width="500px"
          height="300px"
          content={<Amount value={200} size="2xlarge" type="heading" />}
        >
          <ChartDonut dataKey="value" nameKey="name" data={chartData}>
            <ChartDonutCell color="chart.background.sequential.azure.600" />
            <ChartDonutCell color="chart.background.sequential.azure.500" />
            <ChartDonutCell color="chart.background.sequential.azure.400" />
            <ChartDonutCell color="chart.background.sequential.azure.300" />
            <ChartDonutCell color="chart.background.sequential.azure.200" />
          </ChartDonut>
          <ChartLegend />
          <ChartTooltip />
        </ChartDonutWrapper>
      </Box>
    </Box>
  );
};

DonutChartWithAmount.parameters = {
  controls: { disable: true },
};

export const DonutChartWithVerticalLegend: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box>
      <ChartDonutWrapper
        width="500px"
        height="300px"
        content={<Amount value={200} size="2xlarge" type="heading" />}
      >
        <ChartDonut dataKey="value" nameKey="name" data={chartData}>
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartLegend layout="vertical" align="right" />
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
};

DonutChartWithVerticalLegend.parameters = {
  controls: { disable: true },
};

export const DonutChartWithCustomColor: StoryFn<typeof ChartDonut> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <ChartDonutWrapper content={{ value: '1300' }} width="500px" height="300px">
        <ChartDonut dataKey="value" nameKey="name" data={chartData}>
          <ChartDonutCell color="chart.background.sequential.azure.600" />
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
        </ChartDonut>
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
};

BasicDonutChart.storyName = 'Default Donut Chart';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
ChartWithToolTip.storyName = 'Custom ToolTip Donut Chart';
DonutChartWithColorTheme.storyName = 'Donut Chart with Color theme';
SemiCircleDonutChart.storyName = 'SemiCircle Donut Chart';
SemiCircleDonutChartWithCenterText.storyName = 'SemiCircle Donut Chart with Label and Text';
DonutChartWithCustomColor.storyName = 'Donut Chart with Blade Components';
