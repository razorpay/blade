# Charts

## Description

Charts is a comprehensive data visualization library built on top of Recharts with Blade design system styling. It provides LineChart components along with essential chart elements like axes, grids, tooltips, legends, and reference lines. The library supports multiple line types, stroke styles, color theming, and includes built-in accessibility features for creating interactive and responsive data visualizations.

## Important Constraints

- LineChart component only accepts `Line` components as direct children for data visualization
- Maximum of 10 lines are allowed per chart (throws error in development mode if exceeded)
- `data` prop is required for LineChart and must be an array of objects
- `dataKey` prop is required for each `Line` component to specify which data property to visualize
- `label` prop is required for `ReferenceLine` components
- Only `XAxis`, `YAxis`, `CartesianGrid`, `ChartTooltip`, `Legend`, `ReferenceLine`, and `ResponsiveContainer` components are supported as children alongside `Line` components
- `ReferenceLine` requires either `x` or `y` prop to be specified (not both)

## TypeScript Types

These are the props that the Charts components and their subcomponents accept:

```typescript
interface LineProps {
  /**
   * The type of the line.
   * @default: 'monotone'
   */
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  /**
   * The dot of the line.
   */
  dot?: RechartsLineProps['dot'];
  /**
   * The active dot we shows at line chart
   */
  activeDot?: RechartsLineProps['activeDot'];
  /**
   * If we don't have data for some points should we connect the line or should skip it.
   */
  connectNulls?: boolean;
  /**
   * Include this particular line in legend.
   * @default: true
   */
  showLegend?: boolean;
  /**
   * The data key of the x-axis
   */
  dataKey: string;
  /**
   * Name of the line in line chart.
   * if no provided, we will use the data key as the name.
   */
  name?: string;
  /**
   * Color of the line in line chart.
   * if no provided, we will pick colors from the default theme colors.
   */
  color?: ChartsCategoricalColorToken;
  /**
   * Style of the line in line chart.
   * @default: solid
   */
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
}

type LineChartProps = {
  /**
   * The color theme of the line chart.
   */
  colorTheme?: 'default' | 'informational';
  /**
   * Chart data to be rendered
   */
  data: data[];
  children: React.ReactNode;
};

type data = {
  [key: string]: unknown;
};

type ReferenceLineProps = {
  /**
   * The y-coordinate of the reference line.
   */
  y?: RechartsReferenceLineProps['y'];
  /**
   * The x-coordinate of the reference line.
   */
  x?: RechartsReferenceLineProps['x'];
  /**
   * The label of the reference line.
   */
  label: string;
};

type XAxisProps = Omit<RechartsXAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the x-axis.
   */
  label?: string;
  /**
   * The data key of the x-axis.
   */
  dataKey?: string;
};

type YAxisProps = Omit<RechartsYAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the y-axis.
   */
  label?: string;
  /**
   * The data key of the y-axis.
   */
  dataKey?: string;
};

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type LegendProps = ComponentProps<typeof RechartsLegend>;
type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;
type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;
```

## Example

### Complete Dashboard with Multiple Charts

```typescript
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ChartTooltip, 
  Legend, 
  ReferenceLine,
  Box,
  Heading
} from '@razorpay/blade/components';

function AnalyticsDashboard() {
  const salesData = [
    { month: 'Jan', teamA: 4000, teamB: 2400, target: 3000 },
    { month: 'Feb', teamA: 3000, teamB: 1398, target: 3000 },
    { month: 'Mar', teamA: 2000, teamB: 9800, target: 3000 },
    { month: 'Apr', teamA: 2780, teamB: 3908, target: 3000 },
    { month: 'May', teamA: 1890, teamB: 4800, target: 3000 },
    { month: 'Jun', teamA: 2390, teamB: 3800, target: 3000 },
  ];

  const forecastData = [
    { date: 'Jan', historical: 4000, forecast: null },
    { date: 'Feb', historical: 3000, forecast: null },
    { date: 'Mar', historical: 2000, forecast: null },
    { date: 'Apr', historical: 2500, forecast: 2500 },
    { date: 'May', historical: null, forecast: 4000 },
    { date: 'Jun', historical: null, forecast: 2390 },
  ];

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" padding="spacing.6">
      <Heading size="large">Sales Analytics Dashboard</Heading>
      
      <Box width="100%" height="400px">
        <Heading size="medium" marginBottom="spacing.4">Team Performance Comparison</Heading>
        <LineChart data={salesData} colorTheme="default" testID="sales-chart">
          <CartesianGrid />
          <XAxis dataKey="month" label="Month" />
          <YAxis label="Sales Amount" />
          <ChartTooltip />
          <Legend />
          <Line
            dataKey="teamA"
            name="Team A Sales"
            strokeStyle="solid"
            type="monotone"
            color="chart.background.categorical.azure.moderate"
            dot={true}
            activeDot={true}
            showLegend={true}
          />
          <Line
            dataKey="teamB"
            name="Team B Sales"
            strokeStyle="dashed"
            type="linear"
            color="chart.background.categorical.emerald.moderate"
            dot={false}
            activeDot={true}
            showLegend={true}
          />
          <ReferenceLine y={3000} label="Target: 3000" />
        </LineChart>
      </Box>

      <Box width="100%" height="400px">
        <Heading size="medium" marginBottom="spacing.4">Historical vs Forecast</Heading>
        <LineChart data={forecastData} colorTheme="informational">
          <CartesianGrid />
          <XAxis dataKey="date" label="Date" />
          <YAxis label="Revenue" />
          <ChartTooltip />
          <Legend />
          <Line
            dataKey="historical"
            name="Historical Data"
            connectNulls={true}
            strokeStyle="solid"
            color="chart.background.categorical.azure.moderate"
            type="monotone"
          />
          <Line
            dataKey="forecast"
            name="Forecasted Data"
            strokeStyle="dashed"
            connectNulls={true}
            showLegend={false}
            color="chart.background.categorical.azure.moderate"
            type="linear"
          />
        </LineChart>
      </Box>
    </Box>
  );
}

export default AnalyticsDashboard;
```