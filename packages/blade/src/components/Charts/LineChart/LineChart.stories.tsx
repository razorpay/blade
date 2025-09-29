import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartReferenceLine,
} from '~components/Charts/CommonChartComponents';
import { ChartLine, ChartLineWrapper } from '~components/Charts/LineChart';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="LineChart"
      componentDescription="A Line Chart component built on top of Recharts with Blade design system styling."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=93596-46375&m=dev"
      apiDecisionLink="https://github.com/razorpay/blade/blob/5920fbd32c70793454f8c8c6ff544b2a7413afb5/packages/blade/src/components/Charts/_decisions/decisions.md"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
         ChartLine,
         ChartLineWrapper,
         ChartXAxis,
         ChartYAxis,
         ChartCartesianGrid,
         ChartTooltip,
         ChartLegend,
         ChartReferenceLine,
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { name: 'Jan', sales: 4000 },
            { name: 'Feb', sales: 3000 },
            { name: 'Mar', sales: 2000 },
          ];
          
          return (
              <ChartLineWrapper data={data}>
                <ChartCartesianGrid />
                <ChartXAxis dataKey="name" />
                <ChartYAxis />
                <ChartTooltip />
                <ChartLegend />
                <ChartLine dataKey="sales" name="Sales" />
              </ChartLineWrapper>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  CHAT_LINE_PROPS: 'ChartLine Props',
};

export default {
  title: 'Components/Charts/LineChart',
  component: ChartLine,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['step', 'stepAfter', 'stepBefore', 'linear', 'monotone'],
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    connectNulls: {
      control: { type: 'boolean' },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    showLegend: {
      control: { type: 'boolean' },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    strokeStyle: {
      control: { type: 'select' },
      options: ['dotted', 'dashed', 'solid'],
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    dataKey: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    name: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    color: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    dot: {
      control: { disable: true },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
      },
    },
    activeDot: {
      control: { disable: true },
      table: {
        category: propsCategory.CHAT_LINE_PROPS,
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
} as Meta<typeof ChartLine>;

// Sample data for charts
const chartData = [
  { month: 'Jan', teamA: 4000, teamB: 2400 },
  { month: 'Feb', teamA: 3000, teamB: 1398 },
  { month: 'Mar', teamA: 2000, teamB: 9800 },
  { month: 'Apr', teamA: 2780, teamB: 3908 },
  { month: 'May', teamA: 1890, teamB: 4800 },
  { month: 'Jun', teamA: 2390, teamB: 3800 },
];

const forecastData = [
  { date: 'Jan', historical: 4000, forecast: null },
  { date: 'Feb', historical: 3000, forecast: null },
  { date: 'Mar', historical: 2000, forecast: null },
  { date: 'Apr', historical: 2500, forecast: 2500 },
  { date: 'May', historical: null, forecast: 4000 },
  { date: 'Jun', historical: null, forecast: 2390 },
];

// Data with null values for connectNulls example
const dataWithNulls = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: null },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

// Data for stepped line chart example
const steppedData = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 150 },
  { month: 'Mar', value: 120 },
  { month: 'Apr', value: 200 },
  { month: 'May', value: 180 },
  { month: 'Jun', value: 250 },
];

// Simple Line Chart Example
export const SimpleLineChart: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey={dataKey}
          name={name}
          strokeStyle="solid"
          color="chart.background.categorical.azure.moderate"
          {...args}
        />
        <ChartReferenceLine y={1500} label="Avg: 1200" />
      </ChartLineWrapper>
    </Box>
  );
};

// Simple Line chart with vertical line
export const SimpleLineChartWithVerticalLine: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={chartData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey={dataKey}
          name={name}
          strokeStyle="solid"
          color="chart.background.categorical.azure.moderate"
          {...args}
        />
        <ChartReferenceLine x="Apr" label="Avg: 1200" />
      </ChartLineWrapper>
    </Box>
  );
};

// Tiny Line Chart Example (no dots for cleaner look)
export const TinyLineChart: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="200px" height="100px">
      <ChartLineWrapper data={chartData}>
        <ChartLine
          dataKey={dataKey}
          name={name}
          strokeStyle="solid"
          color="chart.background.categorical.azure.strong"
          dot={false}
          activeDot={false}
          {...args}
        />
      </ChartLineWrapper>
    </Box>
  );
};

// Forecast Line Chart Example
export const ForecastLineChart: StoryFn<typeof ChartLine> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={forecastData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="date" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey="historical"
          name="Historical Data"
          connectNulls={true}
          color="chart.background.categorical.azure.moderate"
        />
        <ChartLine
          dataKey="forecast"
          name="Forecasted Data"
          strokeStyle="dashed"
          connectNulls={true}
          showLegend={false}
          color="chart.background.categorical.azure.moderate"
        />
      </ChartLineWrapper>
    </Box>
  );
};

ForecastLineChart.parameters = {
  controls: { disable: true },
};

// Line Chart that Connects Nulls
export const LineChartConnectNulls: StoryFn<typeof ChartLine> = () => {
  return (
    <Box width="100%" height="400px">
      <Heading size="small">Line Chart that do not Connects Nulls (default)</Heading>
      <ChartLineWrapper data={dataWithNulls}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey="sales"
          name="Sales (Connects Nulls)"
          color="chart.background.categorical.emerald.moderate"
        />
      </ChartLineWrapper>
      <Heading size="small">Line Chart that Connects Nulls</Heading>
      <ChartLineWrapper data={dataWithNulls}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey="sales"
          name="Sales (Connects Nulls)"
          connectNulls={true}
          color="chart.background.categorical.emerald.moderate"
        />
      </ChartLineWrapper>
    </Box>
  );
};

LineChartConnectNulls.parameters = {
  controls: { disable: true },
};

// Stepped Line Chart Example
export const SteppedLineChart: StoryFn<typeof ChartLine> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={steppedData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey="value"
          name="Stepped Line"
          type="step"
          color="chart.background.categorical.azure.moderate"
        />
      </ChartLineWrapper>
    </Box>
  );
};

SteppedLineChart.parameters = {
  controls: { disable: true },
};

// Line Chart with Default Color Theme
export const LineChartWithDefaultColorTheme: StoryFn<typeof ChartLine> = () => {
  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={chartData} colorTheme="default">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine dataKey="teamA" name="value 2" />
        <ChartLine dataKey="teamB" name="Value 1" />
      </ChartLineWrapper>
    </Box>
  );
};

LineChartWithDefaultColorTheme.parameters = {
  controls: { disable: true },
};

//Line Chart with X and Y axis labels
export const LineChartWithXAndYAxisLabels: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={chartData}>
        <ChartXAxis dataKey="month" label="Month" />
        <ChartYAxis label="Sales" />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey={dataKey}
          name={name}
          color="chart.background.categorical.emerald.moderate"
          {...args}
        />
        <ChartLine
          dataKey={dataKey}
          name={name}
          color="chart.background.categorical.crimson.moderate"
          {...args}
        />
      </ChartLineWrapper>
    </Box>
  );
};

SimpleLineChart.storyName = 'Simple Line Chart';
SimpleLineChartWithVerticalLine.storyName = 'Simple Line Chart with vertical line';
TinyLineChart.storyName = 'Tiny Line Chart';
ForecastLineChart.storyName = 'Forecast Line Chart';
LineChartConnectNulls.storyName = 'Line Chart (Connect Nulls)';
SteppedLineChart.storyName = 'Stepped Line Chart';
LineChartWithDefaultColorTheme.storyName = 'Line Chart with  Color Theme';
LineChartWithXAndYAxisLabels.storyName = 'Line Chart with X and Y axis labels';
