import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  ChartAreaWrapper,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartReferenceLine,
} from '~components/Charts';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Amount } from '~components/Amount';
import { Text } from '~components/Typography/Text';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AreaChart"
      componentDescription="An Area Chart component built on top of Recharts with Blade design system styling."
      apiDecisionLink={
        'https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Charts/_decisions/decisions.md'
      }
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188717&p=f&m=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
         ChartAreaWrapper,
         ChartArea,
         ChartXAxis,
         ChartYAxis,
         ChartCartesianGrid,
         ChartTooltip,
         ChartLegend,
         ChartReferenceLine,
         Box,
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { month: 'Jan', teamA: 4000 },
            { month: 'Feb', teamA: 3000 },
            { month: 'Mar', teamA: 2000 },
            { month: 'Apr', teamA: 2780 },
            { month: 'May', teamA: 1890 },
            { month: 'Jun', teamA: 2390 },
          ];
          
          return (
            <Box width="100%" height="100%">
              <ChartAreaWrapper data={data}>
                <ChartCartesianGrid />
                <ChartXAxis dataKey="month" />
                <ChartYAxis />
                <ChartTooltip />
                <ChartArea dataKey="teamA" name="Team A" />
              </ChartAreaWrapper>
            </Box>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  CHART_AREA_PROPS: 'ChartArea Props',
};

export default {
  title: 'Components/Charts/AreaChart',
  component: ChartArea,
  tags: ['autodocs'],
  argTypes: {
    // ChartArea specific props
    type: {
      control: { type: 'select' },
      options: ['step', 'stepAfter', 'stepBefore', 'linear', 'monotone'],
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    connectNulls: {
      control: { type: 'boolean' },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    showLegend: {
      control: { type: 'boolean' },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    dataKey: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    name: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    stackId: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    color: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    dot: {
      control: { disable: true },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    activeDot: {
      control: { disable: true },
      table: {
        category: propsCategory.CHART_AREA_PROPS,
      },
    },
    // Hide private props from Storybook
    _index: {
      table: { disable: true },
    },
    _colorTheme: {
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof ChartArea>;

// Sample data for charts
const chartData = [
  { month: 'Jan', teamA: 4000, teamB: 2400, teamC: 1800 },
  { month: 'Feb', teamA: 3000, teamB: 1398, teamC: 2200 },
  { month: 'Mar', teamA: 2000, teamB: 9800, teamC: 1500 },
  { month: 'Apr', teamA: 2780, teamB: 3908, teamC: 2800 },
  { month: 'May', teamA: 1890, teamB: 4800, teamC: 2100 },
  { month: 'Jun', teamA: 2390, teamB: 3800, teamC: 2500 },
];

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    pv: 3908,
    amt: 2000,
    uv: null,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// Sample data for card examples
const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15200 },
  { month: 'Mar', revenue: 14800 },
  { month: 'Apr', revenue: 18100 },
  { month: 'May', revenue: 19500 },
  { month: 'Jun', revenue: 22300 },
];

const trafficData = [
  { day: 'Mon', visitors: 2400 },
  { day: 'Tue', visitors: 1398 },
  { day: 'Wed', visitors: 3800 },
  { day: 'Thu', visitors: 3908 },
  { day: 'Fri', visitors: 4800 },
  { day: 'Sat', visitors: 3800 },
  { day: 'Sun', visitors: 4300 },
];

// 2.2.a - Simple Area Chart
export const SimpleAreaChart: StoryFn<typeof ChartArea> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="500px">
      <ChartAreaWrapper data={chartData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartArea
          dataKey={dataKey}
          name={name}
          type="monotone"
          color="chart.background.categorical.azure.intense"
          {...args}
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// 2.2.b - Stacked Area Chart
export const StackedAreaChart: StoryFn<typeof ChartArea> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="500px">
      <ChartAreaWrapper data={chartData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea
          dataKey={dataKey}
          name={name}
          type="monotone"
          stackId="1"
          color="chart.background.categorical.azure.moderate"
          {...args}
        />
        <ChartArea
          dataKey={dataKey}
          name={name}
          type="monotone"
          stackId="1"
          color="chart.background.categorical.crimson.moderate"
          {...args}
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// 2.2.c - Area Chart that Connects Nulls
export const AreaChartConnectNulls: StoryFn<typeof ChartArea> = ({
  dataKey = 'uv',
  name = 'Page A',
  ...args
}) => {
  return (
    <Box width="100%" height="100%">
      <Heading size="small">Area Chart that does not Connects Nulls :- </Heading>
      <Box width="500px" height="200px">
        <ChartAreaWrapper data={data}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartArea
            type="monotone"
            dataKey={dataKey}
            name={name}
            color="chart.background.categorical.emerald.moderate"
            {...args}
          />
        </ChartAreaWrapper>
      </Box>

      <Heading size="small">Area Chart that Connects Nulls :- </Heading>
      <Box width="500px" height="200px">
        <ChartAreaWrapper data={data}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartArea
            type="monotone"
            dataKey={dataKey}
            name={name}
            connectNulls
            color="chart.background.categorical.emerald.moderate"
            {...args}
          />
        </ChartAreaWrapper>
      </Box>
    </Box>
  );
};

// 2.2.d - Tiny Area Chart (Sparkline)
export const TinyAreaChart: StoryFn<typeof ChartArea> = ({
  dataKey = 'uv',
  name = 'Page A',
  ...args
}) => {
  return (
    <Box width="100px" height="50px">
      <ChartAreaWrapper data={data}>
        <ChartArea
          dataKey={dataKey}
          name={name}
          type="monotone"
          color="chart.background.categorical.azure.intense"
          connectNulls
          {...args}
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// Area Chart with Reference Line
export const AreaChartWithReferenceLine: StoryFn<typeof ChartArea> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea
          dataKey={dataKey}
          name={name}
          type="monotone"
          color="chart.background.categorical.azure.moderate"
          {...args}
        />
        <ChartReferenceLine y={3000} label="Target" />
      </ChartAreaWrapper>
    </Box>
  );
};

export const AreaChartWithReferenceLineVertical: StoryFn<typeof ChartArea> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea
          dataKey={dataKey}
          name={name}
          type="monotone"
          color="chart.background.categorical.azure.moderate"
          {...args}
        />
        <ChartReferenceLine x="Apr" label="Target" />
      </ChartAreaWrapper>
    </Box>
  );
};

// Area Chart with Default Color Theme
export const AreaChartWithDefaultColorTheme: StoryFn<typeof ChartArea> = ({
  dataKey = 'teamA',
  name = 'Success',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData} colorTheme="categorical">
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea dataKey={dataKey} name={name} {...args} />
      </ChartAreaWrapper>
    </Box>
  );
};

export const MultipleAreaChartWithDefaultColorTheme: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData} colorTheme="categorical">
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea dataKey="teamA" name="value1" />
        <ChartArea dataKey="teamB" name="value2" />
      </ChartAreaWrapper>
    </Box>
  );
};
// Area Chart with Default Color Theme
export const AreaChartWithDefaultColorAndCustomColor: StoryFn<typeof ChartArea> = ({
  dataKey = 'teamA',
  name = 'Success',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData} colorTheme="categorical">
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartArea dataKey={dataKey} name={name} {...args} />
        <ChartArea
          dataKey="teamB"
          name="Team B"
          color="chart.background.categorical.cider.strong"
          {...args}
        />
      </ChartAreaWrapper>
    </Box>
  );
};

// Area Chart inside Card - Dashboard Widget Example
export const AreaChartInCard: StoryFn<typeof ChartArea> = () => {
  return (
    <Box display="flex" gap="spacing.5" flexWrap="wrap">
      {/* Revenue Card */}
      <Card width="320px">
        <CardHeader>
          <CardHeaderLeading title="Monthly Revenue" subtitle="Last 6 months" />
        </CardHeader>
        <CardBody>
          <Box marginBottom="spacing.4">
            <Amount value={22300} size="large" color="surface.text.gray.normal" />
            <Text size="small" color="feedback.text.positive.intense">
              +18% from last month
            </Text>
          </Box>
          <Box height="120px">
            <ChartAreaWrapper data={revenueData}>
              <ChartArea
                dataKey="revenue"
                name="Revenue"
                type="monotone"
                color="chart.background.categorical.emerald.moderate"
              />
            </ChartAreaWrapper>
          </Box>
        </CardBody>
      </Card>

      {/* Website Traffic Card */}
      <Card width="320px">
        <CardHeader>
          <CardHeaderLeading title="Website Traffic" subtitle="This week" />
        </CardHeader>
        <CardBody>
          <Box marginBottom="spacing.4">
            <Text size="large" weight="semibold" color="surface.text.gray.normal">
              23,194 visitors
            </Text>
            <Text size="small" color="feedback.text.negative.intense">
              -5% from last week
            </Text>
          </Box>
          <Box height="120px">
            <ChartAreaWrapper data={trafficData}>
              <ChartArea
                dataKey="visitors"
                name="Visitors"
                type="monotone"
                color="chart.background.categorical.azure.moderate"
              />
            </ChartAreaWrapper>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

AreaChartInCard.parameters = {
  controls: { disable: true },
};

export const AreaChartWithCartesianGrid: StoryFn<typeof ChartArea> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={chartData} colorTheme="categorical">
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartCartesianGrid />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartArea
          name="Team B"
          color="chart.background.categorical.cider.strong"
          dataKey="teamB"
        />
      </ChartAreaWrapper>
    </Box>
  );
};

AreaChartWithDefaultColorTheme.storyName = 'Single Area Chart with Color Theme';
SimpleAreaChart.storyName = 'Simple Area Chart';
StackedAreaChart.storyName = 'Stacked Area Chart';
AreaChartConnectNulls.storyName = 'Area Chart (Connect Nulls)';
TinyAreaChart.storyName = 'Tiny Area Chart /  Chart ';
AreaChartWithReferenceLine.storyName = 'Area Chart with Reference Line';
AreaChartWithReferenceLineVertical.storyName = 'Area Chart with Reference Line (Vertical)';
AreaChartInCard.storyName = 'Area Chart / Spark Chart in Card (Dashboard Widget)';
