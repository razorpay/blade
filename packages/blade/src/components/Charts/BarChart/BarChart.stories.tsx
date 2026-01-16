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
import { Heading, Text } from '~components/Typography';
import { ArrowSquareDownIcon, ArrowUpIcon } from '~components/Icons';
import { Divider } from '~components/Divider';
import { Badge } from '~components/Badge';
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
                 <ChartBarWrapper data={data}>
                   <ChartCartesianGrid />
                   <ChartXAxis dataKey="name" />
                   <ChartYAxis />
                   <ChartTooltip />
                   <ChartLegend />
                   <ChartBar dataKey="sales" name="Sales" />
                 </ChartBarWrapper>
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
          <ChartBar dataKey="seriesA" color="data.background.categorical.blue.moderate" />
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
            color="data.background.categorical.blue.faint"
          />
          <ChartBar
            dataKey="seriesB"
            name="Series B"
            color="data.background.categorical.purple.faint"
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

// MetricCard component to display above each bar group (matches the funnel chart design)
const MetricCard = ({
  title,
  percentage,
  value,
  change,
  showDivider = true,
}: {
  title: string;
  percentage: string;
  value: string;
  change: number;
  showDivider?: boolean;
}): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="row" flex="1">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap="spacing.2"
        paddingY="spacing.4"
        paddingX="spacing.5"
        flex="1"
      >
        {/* Title with dotted underline */}
        <Text size="small" color="surface.text.gray.muted" textDecorationLine="underline">
          {title}
        </Text>
        {/* Percentage + Value + Change row */}
        <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
          <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="baseline">
            <Text size="medium" weight="semibold" color="surface.text.gray.normal">
              {percentage}
            </Text>
            <Text size="medium" color="surface.text.gray.muted">
              {value}
            </Text>
          </Box>
          {/* Change indicator - using Badge-like styling */}
          <Box
            display="flex"
            flexDirection="row"
            gap="spacing.1"
            alignItems="center"
            paddingY="spacing.1"
            paddingX="spacing.2"
            borderRadius="small"
          >
            <Box
              display="flex"
              flexDirection="row"
              gap="spacing.1"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowSquareDownIcon color="interactive.icon.negative.normal" />

              <Text color="interactive.text.negative.normal">{change}%</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Vertical divider */}
      {showDivider && (
        <Box height="100%" display="flex" alignItems="center">
          <Divider orientation="vertical" />
        </Box>
      )}
    </Box>
  );
};

// Funnel chart metrics data (matches the checkout funnel design)
const funnelMetricsData = [
  { title: 'Checkout initiated', percentage: '100%', value: '1.3K', change: 12 },
  { title: 'Address step reached', percentage: '86%', value: '1.2K', change: 12 },
  { title: 'Payment step reached', percentage: '66%', value: '900', change: 12 },
  { title: 'Payment attempted', percentage: '36%', value: '530', change: 12 },
  { title: 'Sessions converted', percentage: '20%', value: '230', change: 12 },
];

// Chart data for funnel comparison (two dates)
const funnelChartData = [
  { name: 'Checkout', current: 1300, previous: 1500 },
  { name: 'Address', current: 1200, previous: 1300 },
  { name: 'Payment', current: 900, previous: 960 },
  { name: 'Attempted', current: 530, previous: 600 },
  { name: 'Converted', current: 230, previous: 300 },
];

export const GroupedBarChartWithMetrics: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box display="flex" flexDirection="column" gap="spacing.4">
        {/* Header Section */}
        <Box display="flex" flexDirection="column" gap="spacing.2" paddingX="spacing.5">
          {/* Title with dotted underline */}
          <Text
            size="medium"
            weight="medium"
            color="surface.text.gray.normal"
            textDecorationLine="underline"
          >
            Checkout conversion funnel
          </Text>
          {/* Main metric row */}
          <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
            <Heading size="xlarge" weight="semibold">
              20%
            </Heading>
            <Badge color="negative" size="small" icon={ArrowUpIcon}>
              12%
            </Badge>
          </Box>
          {/* Subtitle */}
          <Text size="small" color="surface.text.gray.muted">
            Checkout conversion decreased from 22% to 20%
          </Text>
        </Box>

        {/* Metric cards row positioned above the chart */}
        <Box display="flex" flexDirection="row" width="100%">
          {funnelMetricsData.map((item, index) => (
            <MetricCard
              key={item.title}
              title={item.title}
              percentage={item.percentage}
              value={item.value}
              change={item.change}
              showDivider={index < funnelMetricsData.length - 1}
            />
          ))}
        </Box>

        {/* Bar Chart */}
        <Box width="100%" height="320px">
          <ChartBarWrapper data={funnelChartData}>
            <ChartXAxis dataKey="name" hide />
            <ChartYAxis hide />
            <ChartTooltip />
            <ChartLegend />
            <ChartBar
              dataKey="current"
              name="Oct 28, 2025"
              color="data.background.sequential.blue.400"
              label={{
                position: 'top',
                content: (props: any) => {
                  const { value, x = 0, y = 0, width = 0 } = props;
                  const numValue = typeof value === 'number' ? value : 0;
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 8}
                      fill="#768EA7"
                      fontSize={12}
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {numValue >= 1000 ? `${(numValue / 1000).toFixed(1)}K` : numValue}
                    </text>
                  );
                },
              }}
            />
            <ChartBar
              dataKey="previous"
              name="Oct 25, 2025"
              color="data.background.sequential.blue.100"
              label={{
                position: 'top',
                content: (props: any) => {
                  const { value, x = 0, y = 0, width = 0 } = props;
                  const numValue = typeof value === 'number' ? value : 0;
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 8}
                      fill="#768EA7"
                      fontSize={12}
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {numValue >= 1000 ? `${(numValue / 1000).toFixed(1)}K` : numValue}
                    </text>
                  );
                },
              }}
            />
          </ChartBarWrapper>
        </Box>
      </Box>
    </ChartsWrapper>
  );
};

GroupedBarChartWithMetrics.storyName = 'Grouped Bar Chart With Metrics';
GroupedBarChartWithMetrics.parameters = {
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

export const BarChartWithSequentialColors: StoryFn<typeof ChartBar> = () => {
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
            color="data.background.sequential.blue.500"
            stackId={1}
          />
          <ChartBar
            dataKey="seriesB"
            name="Series B"
            color="data.background.sequential.blue.200"
            stackId={1}
          />
          <ChartBar
            dataKey="seriesC"
            name="Series C"
            color="data.background.sequential.blue.100"
            stackId={1}
          />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

BarChartWithSequentialColors.parameters = {
  controls: { disable: true },
};

// Data for large labels example
const largeLabelsData = [
  {
    category: 'Premium Enterprise Solutions',
    quarterlyRevenue: 125000,
    operationalExpenses: 85000,
  },
  {
    category: 'Small Business Subscriptions',
    quarterlyRevenue: 98000,
    operationalExpenses: 62000,
  },
  {
    category: 'Individual Professional Plans',
    quarterlyRevenue: 75000,
    operationalExpenses: 45000,
  },
  {
    category: 'Government & Non-Profit Contracts',
    quarterlyRevenue: 156000,
    operationalExpenses: 98000,
  },
  {
    category: 'Educational Institution Licenses',
    quarterlyRevenue: 67000,
    operationalExpenses: 38000,
  },
  {
    category: 'Healthcare Sector Partnerships',
    quarterlyRevenue: 189000,
    operationalExpenses: 112000,
  },
];

// Bar Chart with Large Labels (labels are automatically wrapped to prevent overlap)
export const BarChartWithLargeLabels: StoryFn<typeof ChartBar> = () => {
  return (
    <ChartsWrapper>
      <Box width="100%" height="500px">
        <ChartBarWrapper data={largeLabelsData} colorTheme="categorical">
          <ChartXAxis dataKey="category" />
          <ChartYAxis label="Amount in USD ($)" />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="quarterlyRevenue" name="Quarterly Revenue from All Sources" />
        </ChartBarWrapper>
      </Box>
    </ChartsWrapper>
  );
};

BarChartWithLargeLabels.parameters = {
  controls: { disable: true },
};

DefaultChart.storyName = 'Default Bar Chart';
TinyBarChart.storyName = 'Tiny Bar Chart';
SimpleBarChart.storyName = 'Simple Bar Chart';
StackedBarChart.storyName = 'Stacked Bar Chart';
VerticalBarChart.storyName = 'Vertical Bar Chart';
BarChartWithDefaultColorTheme.storyName = 'Bar Chart With Default Color Theme';
BarChartWithGrid.storyName = 'Bar Chart With Grid';
BarChartWithSequentialColors.storyName = 'Bar Chart with sequential colors';
BarChartWithLargeLabels.storyName = 'Bar Chart with Large Labels';
