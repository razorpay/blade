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
import { ChipGroup, Chip } from '~components/Chip';

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
           Box,
         } from '@razorpay/blade/components';
         
         function App() {
           const data = [
             { name: 'Jan', sales: 4000 },
             { name: 'Feb', sales: 3000 },
             { name: 'Mar', sales: 2000 },
           ];
         
           return (
             <Box width="400px" height="400px">
               <ChartLineWrapper data={data}>
                 <ChartCartesianGrid />
                 <ChartXAxis dataKey="name" />
                 <ChartYAxis />
                 <ChartTooltip />
                 <ChartLegend />
                 <ChartLine dataKey="sales" name="Sales" />
               </ChartLineWrapper>
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

// Data for switchable time periods
const monthlyData = [
  { period: 'Jan', revenue: 4500, expenses: 2800 },
  { period: 'Feb', revenue: 5200, expenses: 3100 },
  { period: 'Mar', revenue: 4800, expenses: 2900 },
  { period: 'Apr', revenue: 6100, expenses: 3500 },
  { period: 'May', revenue: 5800, expenses: 3200 },
  { period: 'Jun', revenue: 6500, expenses: 3800 },
];

const yearlyData = [
  { period: '2019', revenue: 45000, expenses: 28000 },
  { period: '2020', revenue: 52000, expenses: 31000 },
  { period: '2021', revenue: 61000, expenses: 35000 },
  { period: '2022', revenue: 72000, expenses: 42000 },
  { period: '2023', revenue: 85000, expenses: 48000 },
  { period: '2024', revenue: 96000, expenses: 52000 },
];

const minuteData = [
  { period: '0:00', revenue: 120, expenses: 85 },
  { period: '0:15', revenue: 135, expenses: 92 },
  { period: '0:30', revenue: 148, expenses: 98 },
  { period: '0:45', revenue: 162, expenses: 105 },
  { period: '1:00', revenue: 178, expenses: 112 },
  { period: '1:15', revenue: 195, expenses: 125 },
];

// Data for multiple charts dashboard

// Data for 10+ lines chart - Regional Sales Performance
const regionalSalesData = [
  {
    month: 'Jan',
    northAmerica: 4200,
    southAmerica: 2800,
    europe: 3500,
    asia: 5200,
    africa: 1800,
    oceania: 2100,
    middleEast: 2400,
    centralAsia: 1900,
    eastAsia: 4800,
    southEastAsia: 3200,
    caribbean: 1500,
    scandinavia: 2600,
  },
  {
    month: 'Feb',
    northAmerica: 4500,
    southAmerica: 3100,
    europe: 3800,
    asia: 5500,
    africa: 2100,
    oceania: 2300,
    middleEast: 2700,
    centralAsia: 2200,
    eastAsia: 5100,
    southEastAsia: 3500,
    caribbean: 1700,
    scandinavia: 2900,
  },
  {
    month: 'Mar',
    northAmerica: 4800,
    southAmerica: 3400,
    europe: 4100,
    asia: 5800,
    africa: 2400,
    oceania: 2500,
    middleEast: 3000,
    centralAsia: 2500,
    eastAsia: 5400,
    southEastAsia: 3800,
    caribbean: 1900,
    scandinavia: 3200,
  },
  {
    month: 'Apr',
    northAmerica: 5200,
    southAmerica: 3700,
    europe: 4500,
    asia: 6200,
    africa: 2700,
    oceania: 2800,
    middleEast: 3300,
    centralAsia: 2800,
    eastAsia: 5800,
    southEastAsia: 4100,
    caribbean: 2200,
    scandinavia: 3500,
  },
  {
    month: 'May',
    northAmerica: 5500,
    southAmerica: 4000,
    europe: 4800,
    asia: 6600,
    africa: 3000,
    oceania: 3100,
    middleEast: 3600,
    centralAsia: 3100,
    eastAsia: 6200,
    southEastAsia: 4400,
    caribbean: 2500,
    scandinavia: 3800,
  },
  {
    month: 'Jun',
    northAmerica: 5900,
    southAmerica: 4300,
    europe: 5200,
    asia: 7000,
    africa: 3300,
    oceania: 3400,
    middleEast: 3900,
    centralAsia: 3400,
    eastAsia: 6600,
    southEastAsia: 4700,
    caribbean: 2800,
    scandinavia: 4100,
  },
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
      {' '}
      {children}{' '}
    </Box>
  );
};

// Simple Line Chart Example
export const SimpleLineChart: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <ChartsWrapper>
      <Box width="95%" height="400px">
        <ChartLineWrapper data={chartData}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine
            dataKey={dataKey}
            name={name}
            strokeStyle="solid"
            color="data.background.categorical.blue.moderate"
            {...args}
          />
          <ChartReferenceLine y={1500} label="Avg: 1200" />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// Simple Line chart with vertical line
export const SimpleLineChartWithVerticalLine: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartLineWrapper data={chartData}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine
            dataKey={dataKey}
            name={name}
            strokeStyle="solid"
            color="data.background.categorical.blue.moderate"
            {...args}
          />
          <ChartReferenceLine x="Apr" label="Avg: 1200" />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// Tiny Line Chart Example (no dots for cleaner look)
export const TinyLineChart: StoryFn<typeof ChartLine> = ({
  dataKey = 'teamA',
  name = 'Team A',
  ...args
}) => {
  return (
    <ChartsWrapper>
      <Box width="200px" height="100px">
        <ChartLineWrapper data={chartData}>
          <ChartLine
            dataKey={dataKey}
            name={name}
            strokeStyle="solid"
            color="data.background.categorical.blue.strong"
            dot={false}
            activeDot={false}
            {...args}
          />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// Forecast Line Chart Example
export const ForecastLineChart: StoryFn<typeof ChartLine> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartLineWrapper data={forecastData}>
          <ChartXAxis dataKey="date" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine
            dataKey="historical"
            name="Historical Data"
            connectNulls={true}
            color="data.background.categorical.blue.moderate"
          />
          <ChartLine
            dataKey="forecast"
            name="Forecasted Data"
            strokeStyle="dashed"
            connectNulls={true}
            showLegend={false}
            color="data.background.categorical.blue.moderate"
          />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

ForecastLineChart.parameters = {
  controls: { disable: true },
};

// Line Chart that Connects Nulls
export const LineChartConnectNulls: StoryFn<typeof ChartLine> = () => {
  return (
    <Box width="100%" height="100%">
      <ChartsWrapper>
        <Box display="flex" gap="spacing.4" flexDirection="column" width="50%" height="400px">
          <Heading size="small">Line Chart that Connects Nulls</Heading>
          <ChartLineWrapper data={dataWithNulls}>
            <ChartXAxis dataKey="month" />
            <ChartYAxis />
            <ChartTooltip />
            <ChartLegend />
            <ChartLine
              dataKey="sales"
              name="Sales (Connects Nulls)"
              connectNulls={true}
              color="data.background.categorical.green.moderate"
            />
          </ChartLineWrapper>
        </Box>
        <Box display="flex" gap="spacing.4" flexDirection="column" width="50%" height="400px">
          <Heading size="small">Line Chart that do not Connects Nulls (default)</Heading>
          <ChartLineWrapper data={dataWithNulls}>
            <ChartXAxis dataKey="month" />
            <ChartYAxis />
            <ChartTooltip />
            <ChartLegend />
            <ChartLine
              dataKey="sales"
              name="Sales (Do Not Connects Nulls)"
              color="data.background.categorical.green.moderate"
            />
          </ChartLineWrapper>
        </Box>
      </ChartsWrapper>
    </Box>
  );
};

LineChartConnectNulls.parameters = {
  controls: { disable: true },
};

// Stepped Line Chart Example
export const SteppedLineChart: StoryFn<typeof ChartLine> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartLineWrapper data={steppedData}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine
            dataKey="value"
            name="Stepped Line"
            type="step"
            color="data.background.categorical.blue.moderate"
          />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

SteppedLineChart.parameters = {
  controls: { disable: true },
};

// Line Chart with Default Color Theme
export const LineChartWithDefaultColorTheme: StoryFn<typeof ChartLine> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartLineWrapper data={chartData} colorTheme="categorical">
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine dataKey="teamA" name="value 2" />
          <ChartLine dataKey="teamB" name="Value 1" />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
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
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartLineWrapper data={chartData}>
          <ChartXAxis dataKey="month" label="Month" />
          <ChartYAxis label="Sales" />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine
            dataKey={dataKey}
            name={name}
            color="data.background.categorical.green.moderate"
            {...args}
          />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

// Line Chart with Switchable Time Periods
export const LineChartWithSwitchableTimePeriods: StoryFn<typeof ChartLine> = () => {
  const [timePeriod, setTimePeriod] = React.useState<'month' | 'year' | 'minute'>('month');

  const dataMap = {
    month: { data: monthlyData, label: 'Month' },
    year: { data: yearlyData, label: 'Year' },
    minute: { data: minuteData, label: 'Time (Minutes)' },
  };

  const currentData = dataMap[timePeriod];

  return (
    <ChartsWrapper>
      <Box display="flex" flexDirection="column" width="100%" height="100%">
        <Box marginBottom="spacing.5">
          <ChipGroup
            accessibilityLabel="Select time period"
            selectionType="single"
            value={timePeriod}
            onChange={({ values }) => setTimePeriod(values[0] as 'month' | 'year' | 'minute')}
          >
            <Chip value="month">Monthly</Chip>
            <Chip value="year">Yearly</Chip>
            <Chip value="minute">Per Minute</Chip>
          </ChipGroup>
        </Box>

        <Box width="100%" height="400px">
          <ChartLineWrapper data={currentData.data} colorTheme="categorical">
            <ChartXAxis dataKey="period" label={currentData.label} />
            <ChartYAxis label="Amount ($)" />
            <ChartTooltip />
            <ChartLegend />
            <ChartLine
              dataKey="revenue"
              name="Revenue"
              color="data.background.categorical.blue.strong"
            />
            <ChartLine
              dataKey="expenses"
              name="Expenses"
              color="data.background.categorical.red.strong"
            />
          </ChartLineWrapper>
        </Box>
      </Box>
    </ChartsWrapper>
  );
};

LineChartWithSwitchableTimePeriods.parameters = {
  controls: { disable: true },
};

// Line Chart with 10+ Lines - Regional Sales
export const LineChartWithManyLines: StoryFn<typeof ChartLine> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="500px">
        <ChartLineWrapper data={regionalSalesData} colorTheme="categorical">
          <ChartXAxis dataKey="month" label="Month" />
          <ChartYAxis label="Sales ($)" />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine dataKey="northAmerica" name="North America" />
          <ChartLine dataKey="southAmerica" name="South America" />
          <ChartLine dataKey="europe" name="Europe" />
          <ChartLine dataKey="asia" name="Asia" />
          <ChartLine dataKey="africa" name="Africa" />
          <ChartLine dataKey="oceania" name="Oceania" />
          <ChartLine dataKey="middleEast" name="Middle East" />
          <ChartLine dataKey="centralAsia" name="Central Asia" />
          <ChartLine dataKey="eastAsia" name="East Asia" />
          <ChartLine dataKey="southEastAsia" name="South East Asia" />
          <ChartLine dataKey="caribbean" name="Caribbean" />
          <ChartLine dataKey="scandinavia" name="Scandinavia" />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

LineChartWithManyLines.parameters = {
  controls: { disable: true },
};

export const LineChartWithCartesianGrid: StoryFn<typeof ChartLine> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="500px">
        <ChartLineWrapper data={regionalSalesData} colorTheme="categorical">
          <ChartXAxis dataKey="month" label="Month" />
          <ChartYAxis label="Sales ($)" />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine dataKey="northAmerica" name="North America" />
          <ChartLine dataKey="southAmerica" name="South America" />
          <ChartLine dataKey="europe" name="Europe" />
          <ChartLine dataKey="asia" name="Asia" />
          <ChartCartesianGrid />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

LineChartWithCartesianGrid.parameters = {
  controls: { disable: true },
};

// Data for multi-line X-axis labels example
const multiLineAxisData = [
  { time: '10:00', day: 'Mon', revenue: 4500, orders: 120 },
  { time: '11:00', day: 'Mon', revenue: 5200, orders: 145 },
  { time: '12:00', day: 'Mon', revenue: 6100, orders: 180 },
  { time: '13:00', day: 'Tue', revenue: 4800, orders: 135 },
  { time: '14:00', day: 'Tue', revenue: 5500, orders: 160 },
  { time: '15:00', day: 'Tue', revenue: 5900, orders: 170 },
];

// Line Chart with Multi-line X-Axis Labels
export const LineChartWithMultiLineXAxis: StoryFn<typeof ChartLine> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartLineWrapper data={multiLineAxisData} colorTheme="categorical">
          <ChartXAxis dataKey="time" secondaryLabelKey="day" label="Time / Day" />
          <ChartYAxis label="Revenue ($)" />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine dataKey="revenue" name="Revenue" />
          <ChartLine dataKey="orders" name="Orders" />
        </ChartLineWrapper>
      </Box>
    </ChartsWrapper>
  );
};

LineChartWithMultiLineXAxis.parameters = {
  controls: { disable: true },
};

SimpleLineChart.storyName = 'Simple Line Chart';
SimpleLineChartWithVerticalLine.storyName = 'Simple Line Chart with vertical line';
TinyLineChart.storyName = 'Tiny Line Chart';
ForecastLineChart.storyName = 'Forecast Line Chart';
LineChartConnectNulls.storyName = 'Line Chart (Connect Nulls)';
SteppedLineChart.storyName = 'Stepped Line Chart';
LineChartWithDefaultColorTheme.storyName = 'Line Chart with  Color Theme';
LineChartWithXAndYAxisLabels.storyName = 'Line Chart with X and Y axis labels';
LineChartWithSwitchableTimePeriods.storyName = 'Line Chart with Switchable Time Periods';
LineChartWithManyLines.storyName = 'Line Chart with many lines';
LineChartWithMultiLineXAxis.storyName = 'Line Chart with Multi-line X-Axis Labels';
