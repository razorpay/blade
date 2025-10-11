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
  CHART_DONUT_PROPS: 'ChartDonut Props',
  CHART_DONUT_WRAPPER_PROPS: 'ChartDonutWrapper Props',
};

export default {
  title: 'Components/Charts/DonutChart',
  component: ChartDonut,
  tags: ['autodocs'],
  argTypes: {
    // ChartDonut props
    type: {
      control: { type: 'select' },
      options: ['circle', 'semicircle'],
      table: {
        category: propsCategory.CHART_DONUT_PROPS,
      },
    },
    radius: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      table: {
        category: propsCategory.CHART_DONUT_PROPS,
      },
    },
    // ChartDonutWrapper props
    content: {
      control: { type: 'object' },
      table: {
        category: propsCategory.CHART_DONUT_WRAPPER_PROPS,
      },
    },
    colorTheme: {
      control: { type: 'select' },
      options: ['categorical'],
      table: {
        category: propsCategory.CHART_DONUT_WRAPPER_PROPS,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
    controls: {
      exclude: ['dataKey', 'nameKey', 'cx', 'cy', 'children', 'data'],
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

const ChartsWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box
      width="100%"
      height="100%"
      backgroundColor="surface.background.gray.intense"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="spacing.8"
      borderRadius="medium"
    >
      {children}
    </Box>
  );
};

const chartsLargeData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
  { name: 'Group F', value: 100 },
  { name: 'Group G', value: 100 },
  { name: 'Group H', value: 100 },
  // { name: 'Group I', value: 100 },
  // { name: 'Group J', value: 100 },
  // { name: 'Group K', value: 100 },
  // { name: 'Group L', value: 100 },
  // { name: 'Group M', value: 100 },
  // { name: 'Group N', value: 100 },
  // { name: 'Group O', value: 100 },
  // { name: 'Group P', value: 100 },
];

// 1. Basic Donut Chart
export const BasicDonutChart: StoryFn<typeof ChartDonut> = (args) => {
  // Extract ChartDonut props and ChartDonutWrapper props
  const { type, radius, dataKey, nameKey, data, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartDonutWrapper
          content={{
            label: 'Total',
            value: '1300',
          }}
          {...wrapperProps}
        >
          <ChartDonut type={type} radius={radius} dataKey="value" nameKey="name" data={chartData} />
          <ChartLegend />
          <ChartTooltip />
        </ChartDonutWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// 2. Donut Chart with Center Text
export const DonutChartWithCenterText: StoryFn<typeof ChartDonut> = (args) => {
  // Extract ChartDonut props and ChartDonutWrapper props
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper
        content={{ label: 'Total', value: '1300' }}
        width="500px"
        height="300px"
        {...wrapperProps}
      >
        <ChartDonut
          dataKey="value"
          nameKey="name"
          data={chartData}
          radius={radius || 'medium'}
          type={type}
        />

        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

// 3. Small Radius Donut Chart
export const SmallRadiusDonutChart: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper width="500px" height="500px" {...wrapperProps}>
        <ChartDonut
          dataKey="value"
          nameKey="name"
          data={chartData}
          radius={radius || 'small'}
          type={type}
        >
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
        </ChartDonut>
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

// 4. Extra Large Radius Donut Chart
export const ExtraLargeRadiusDonutChart: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper width="500px" height="400px" {...wrapperProps}>
        <ChartDonut
          dataKey="value"
          nameKey="name"
          data={chartData}
          radius={radius || 'large'}
          type={type}
        >
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
        </ChartDonut>
        <ChartTooltip />
        <ChartLegend />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

// Donut Chart with Color Theme
export const DonutChartWithColorTheme: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper width="500px" height="300px" {...wrapperProps}>
        <ChartDonut
          dataKey="value"
          nameKey="name"
          data={chartData}
          colorTheme="categorical"
          radius={radius}
          type={type}
        />
        <ChartTooltip />
        <ChartLegend />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

// Donut Chart with Semi Circle
export const SemiCircleDonutChart: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper width="500px" height="300px" {...wrapperProps}>
        <ChartDonut
          dataKey="value"
          nameKey="name"
          data={chartData}
          radius={radius}
          type={type || 'semicircle'}
        >
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
        </ChartDonut>
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

// Donut Chart with Amount
export const DonutChartWithAmount: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper
        width="500px"
        height="300px"
        content={<Amount value={200} size="2xlarge" type="heading" />}
        {...wrapperProps}
      >
        <ChartDonut dataKey="value" nameKey="name" data={chartData} type={type} radius={radius}>
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
        </ChartDonut>
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

export const DonutChartWithVerticalLegend: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper
        width="500px"
        height="300px"
        content={<Amount value={200} size="2xlarge" type="heading" />}
        {...wrapperProps}
      >
        <ChartDonut dataKey="value" nameKey="name" data={chartData} type={type} radius={radius}>
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
        </ChartDonut>
        <ChartLegend layout="vertical" align="right" />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

export const DonutChartWithCustomColor: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper content={{ value: '1300' }} width="500px" height="300px" {...wrapperProps}>
        <ChartDonut dataKey="value" nameKey="name" data={chartData} type={type} radius={radius}>
          <ChartDonutCell color="chart.background.categorical.topaz.faint" />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
          <ChartDonutCell />
        </ChartDonut>
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

export const DonutChartWithLargeData: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper width="500px" height="500px" {...wrapperProps}>
        <ChartDonut
          dataKey="value"
          nameKey="name"
          data={chartsLargeData}
          type={type}
          radius={radius}
        />
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

export const DonutChartWithSequentialColors: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <ChartDonutWrapper
        width="500px"
        height="300px"
        content={<Amount value={200} size="2xlarge" type="heading" />}
        {...wrapperProps}
      >
        <ChartDonut dataKey="value" nameKey="name" data={chartData} type={type} radius={radius}>
          <ChartDonutCell color="chart.background.sequential.azure.500" />
          <ChartDonutCell color="chart.background.sequential.azure.400" />
          <ChartDonutCell color="chart.background.sequential.azure.300" />
          <ChartDonutCell color="chart.background.sequential.azure.200" />
          <ChartDonutCell color="chart.background.sequential.azure.100" />
        </ChartDonut>
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

BasicDonutChart.storyName = 'Default Donut Chart';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
DonutChartWithColorTheme.storyName = 'Donut Chart with Color theme';
SemiCircleDonutChart.storyName = 'SemiCircle Donut Chart';
DonutChartWithCustomColor.storyName = 'Donut Chart with Blade Components';
