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
         ChartLegend,
         Box,
       } from '@razorpay/blade/components';
       
       const chartData = [
         { name: 'Group A', value: 400 },
         { name: 'Group B', value: 300 },
         { name: 'Group C', value: 300 },
         { name: 'Group D', value: 200 },
         { name: 'Group E', value: 100 },
       ];
       
       function App() {
         return (
           <Box width="400px" height="400px">
             <Box width="100%" height="400px">
               <ChartDonutWrapper
                 content={{
                   label: 'Total',
                   value: '1300',
                 }}
               >
                 <ChartDonut dataKey="value" nameKey="name" data={chartData} />
                 <ChartLegend />
                 <ChartTooltip />
               </ChartDonutWrapper>
             </Box>
           </Box>
         );
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
];

/**
 * Example data with custom keys to demonstrate dataKey and nameKey props
 * - `category`, `code`, or `shortName` can be used as the nameKey (label for each segment)
 * - `revenue` or `orders` can be used as the dataKey (value for segment size)
 */
const salesByCategory = [
  { category: 'Electronics', code: 'ELEC', shortName: 'Electronics', revenue: 45000, orders: 120 },
  { category: 'Clothing', code: 'CLTH', shortName: 'Clothing', revenue: 32000, orders: 280 },
  {
    category: 'Home & Garden',
    code: 'HOME',
    shortName: 'Home & Garden',
    revenue: 28000,
    orders: 95,
  },
  { category: 'Sports', code: 'SPRT', shortName: 'Sports', revenue: 18000, orders: 150 },
  { category: 'Books', code: 'BOOK', shortName: 'Books', revenue: 12000, orders: 320 },
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

export const DonutChartWithCustomKeys: StoryFn<typeof ChartDonut> = (args) => {
  const { type, radius, dataKey = 'revenue', nameKey = 'category', ...wrapperProps } = args;

  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartDonutWrapper {...wrapperProps}>
          <ChartDonut
            type={type}
            radius={radius}
            dataKey={dataKey}
            nameKey={nameKey}
            data={salesByCategory}
          />
          <ChartLegend />
          <ChartTooltip />
        </ChartDonutWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// Add controls for dataKey and nameKey
DonutChartWithCustomKeys.argTypes = {
  dataKey: {
    control: { type: 'select' },
    options: ['revenue', 'orders'],
    defaultValue: 'revenue',
    description: 'Field to use for segment values',
    table: {
      category: propsCategory.CHART_DONUT_PROPS,
    },
  },
  nameKey: {
    control: { type: 'select' },
    options: ['category', 'code', 'shortName'],
    defaultValue: 'category',
    description: 'Field to use for segment labels',
    table: {
      category: propsCategory.CHART_DONUT_PROPS,
    },
  },
};

// Override the controls exclude for this specific story
DonutChartWithCustomKeys.parameters = {
  controls: {
    exclude: ['cx', 'cy', 'children', 'data'],
  },
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
          <ChartDonutCell color="data.background.categorical.gold.faint" />
          <ChartDonutCell color="data.background.categorical.blue.faint" />
          <ChartDonutCell color="data.background.categorical.orange.faint" />
          <ChartDonutCell color="data.background.categorical.red.faint" />
          <ChartDonutCell color="data.background.categorical.purple.faint" />
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
          <ChartDonutCell color="data.background.sequential.blue.500" />
          <ChartDonutCell color="data.background.sequential.blue.400" />
          <ChartDonutCell color="data.background.sequential.blue.300" />
          <ChartDonutCell color="data.background.sequential.blue.200" />
          <ChartDonutCell color="data.background.sequential.blue.100" />
        </ChartDonut>
        <ChartLegend />
        <ChartTooltip />
      </ChartDonutWrapper>
    </ChartsWrapper>
  );
};

BasicDonutChart.storyName = 'Default Donut Chart';
DonutChartWithCustomKeys.storyName = 'Donut Chart with Custom dataKey and nameKey';
DonutChartWithCenterText.storyName = 'Donut Chart with Center Text';
SmallRadiusDonutChart.storyName = 'Small Radius Donut Chart';
ExtraLargeRadiusDonutChart.storyName = 'Extra Large Radius Donut Chart';
DonutChartWithColorTheme.storyName = 'Donut Chart with Color theme';
SemiCircleDonutChart.storyName = 'SemiCircle Donut Chart';
DonutChartWithCustomColor.storyName = 'Donut Chart with Custom colors';
