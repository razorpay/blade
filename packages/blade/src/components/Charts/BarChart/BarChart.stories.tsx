import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { Box } from '~components/Box';
import {
  ChartBar,
  ChartBarWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '~components/Charts';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="BarChart"
      componentDescription="A Bar Chart component built on top of Recharts with Blade design system styling."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188719&p=f&m=dev"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Charts/_decisions/decisions.md"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { 
         ChartBar,
         ChartBarWrapper,
         ChartXAxis,
         ChartYAxis,
         ChartCartesianGrid,
         ChartTooltip,
         ChartLegend,
        } from '@razorpay/blade/components';
        
        function App() {
          const data = [
            { name: 'Jan', sales: 4000 },
            { name: 'Feb', sales: 3000 },
            { name: 'Mar', sales: 2000 },
          ];
          
          return (
              <ChartBarWrapper data={data}>
                <ChartCartesianGrid />
                <ChartXAxis dataKey="name" />
                <ChartYAxis />
                <ChartTooltip />
                <ChartLegend />
                <ChartBar dataKey="sales" name="Sales" />
              </ChartBarWrapper>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  CHART_BAR_PROPS: 'ChartBar Props',
};

export default {
  title: 'Components/Charts/BarChart',
  component: ChartBar,
  tags: ['autodocs'],
  argTypes: {
    dataKey: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_BAR_PROPS,
      },
    },
    name: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_BAR_PROPS,
      },
    },
    color: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_BAR_PROPS,
      },
    },
    stackId: {
      control: { type: 'text' },
      table: {
        category: propsCategory.CHART_BAR_PROPS,
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
} as Meta<typeof ChartBar>;

const chartData = [
  { name: 'Jan', seriesA: 4000, seriesB: 2400, seriesC: 1200 },
  { name: 'Feb', seriesA: 3000, seriesB: 1398, seriesC: 900 },
  { name: 'Mar', seriesA: 2000, seriesB: 9800, seriesC: 1600 },
  { name: 'Apr', seriesA: 2780, seriesB: 3908, seriesC: 2200 },
  { name: 'May', seriesA: 1890, seriesB: 4800, seriesC: 1700 },
  { name: 'Jun', seriesA: 2390, seriesB: 3800, seriesC: 2100 },
  { name: 'Jul', seriesA: 2390, seriesB: 3800, seriesC: 2100 },
  { name: 'Aug', seriesA: 3000, seriesB: 4800, seriesC: 3000 },
  { name: 'Sep', seriesA: 3500, seriesB: 3400, seriesC: 5300 },
  { name: 'Oct', seriesA: 2000, seriesB: 1400, seriesC: 3300 },
  { name: 'Nov', seriesA: 1400, seriesB: 5400, seriesC: 1300 },
  { name: 'Dec', seriesA: 1200, seriesB: 4600, seriesC: 2000 },
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

export const DefaultChart: StoryFn<typeof ChartBar> = ({
  dataKey = 'seriesA',
  name = 'Series A',
  ...props
}) => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartBarWrapper data={chartData.slice(0, 6)}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey={dataKey} name={name} {...props} />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

export const TinyBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100px" height="50px">
        <ChartBarWrapper data={chartData.slice(0, 6)}>
          <ChartBar dataKey="seriesA" color="chart.background.categorical.azure.moderate" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

TinyBarChart.parameters = {
  controls: { disable: true },
};

export const SimpleBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartBarWrapper data={chartData.slice(0, 6)}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar
            dataKey="seriesA"
            name="Series A"
            color="chart.background.categorical.azure.faint"
          />
          <ChartBar
            dataKey="seriesB"
            name="Series B"
            color="chart.background.categorical.orchid.faint"
          />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

SimpleBarChart.parameters = {
  controls: { disable: true },
};

export const StackedBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartBarWrapper data={chartData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="seriesA" name="Series A" stackId="stack-1" />
          <ChartBar dataKey="seriesB" name="Series B" stackId="stack-1" />
          <ChartBar dataKey="seriesC" name="Series C" stackId="stack-1" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

StackedBarChart.parameters = {
  controls: { disable: true },
};

export const GroupedBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartBarWrapper data={chartData.slice(0, 5)}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="seriesA" name="Series A" />
          <ChartBar dataKey="seriesB" name="Series B" />
          <ChartBar dataKey="seriesC" name="Series C" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

GroupedBarChart.parameters = {
  controls: { disable: true },
};

export const VerticalBarChart: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="500px">
        <ChartBarWrapper data={chartData.slice(0, 5)} layout="vertical">
          <ChartXAxis type="number" />
          <ChartYAxis type="category" dataKey="name" />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="seriesA" name="Series A" stackId="2" />
          <ChartBar dataKey="seriesB" name="Series B" stackId="2" />
          <ChartBar dataKey="seriesC" name="Series C" stackId="2" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

VerticalBarChart.parameters = {
  controls: { disable: true },
};

export const BarChartWithDefaultColorTheme: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="500px">
        <ChartBarWrapper data={chartData.slice(0, 5)} layout="vertical" colorTheme="categorical">
          <ChartXAxis type="number" />
          <ChartYAxis type="category" dataKey="name" />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="seriesA" name="Series A" stackId="2" />
          <ChartBar dataKey="seriesB" name="Series B" stackId="2" />
          <ChartBar dataKey="seriesC" name="Series C" stackId="2" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

BarChartWithDefaultColorTheme.parameters = {
  controls: { disable: true },
};

export const BarChartWithGrid: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="400px">
        <ChartBarWrapper data={chartData.slice(0, 6)}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="seriesA" name="Series A" />
          <ChartBar dataKey="seriesB" name="Series B" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

BarChartWithGrid.parameters = {
  controls: { disable: true },
};

DefaultChart.storyName = 'Default Bar Chart';
TinyBarChart.storyName = 'Tiny Bar Chart';
SimpleBarChart.storyName = 'Simple Bar Chart';
StackedBarChart.storyName = 'Stacked Bar Chart';
VerticalBarChart.storyName = 'Vertical Bar Chart';
BarChartWithDefaultColorTheme.storyName = 'Bar Chart With Default Color Theme';
BarChartWithGrid.storyName = 'Bar Chart With Grid';
