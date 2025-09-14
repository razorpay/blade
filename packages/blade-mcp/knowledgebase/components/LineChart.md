# Line Chart

## Description

LineChart is a data visualization component built on top of Recharts that displays data points connected by lines to show trends over time or categories. It supports multiple lines, different line styles (solid, dashed, dotted), various line types (linear, monotone, step), and includes subcomponents for axes, grid, tooltips, legends, and reference lines. The component is designed for web platforms only and throws errors when used in native mobile applications.

## Important Constraints

- LineChart component is not available for Native mobile apps and will throw an error if used
- LineChart only accepts LineChartLine, LineChartXAxis, LineChartYAxis, LineChartCartesianGrid, LineChartChartTooltip, LineChartLegend, and LineChartReferenceLine components as children
- LineChartLine requires a `dataKey` prop to specify which data property to display
- ReferenceLine requires a `label` prop to display the reference line label
- Only 'default' color theme is currently supported, other themes will log a warning

## TypeScript Types

These types define the props that the LineChart component and its subcomponents accept:

```typescript
// Main LineChart component props
type LineChartProps = {
  /**
   * The color theme of the line chart.
   */
  colorTheme?: colorTheme;
  /**
   * Chart data to be rendered
   */
  data: data[];
  children: React.ReactNode;
} & Partial<Omit<BaseBoxProps, keyof FlexboxProps | keyof GridProps>>;

/ LineChartLine component props
interface LineChartLineProps {
  /**
   * The type of the line.
   *  @default : 'linear'
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
   *  @default : true
   */
  showLegend?: boolean;
  /**
   *  The data key of the x-axis
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


// XAxis component props
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

// YAxis component props
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


// ReferenceLine component props
type ReferenceLineProps = {
  /**
   * The y-coordinate of the reference line.
   */
  y?: RechartsReferenceLineProps['y'];
  /**
   * The x-coordinate  of the reference line.
   */
  x?: RechartsReferenceLineProps['x'];
  /**
   * The label of the reference line.
   */
  label: string;
};

// Other subcomponent props
type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type LegendProps = ComponentProps<typeof RechartsLegend>;
type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;
type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;


// Supporting types
type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;
type colorTheme = 'default';
type data = {
  [key: string]: unknown;
};
```

## Examples

### Basic Line Chart with Multiple Lines

```typescript
import React from 'react';
import {
  LineChart,
  LineChartLine,
  LineChartXAxis,
  LineChartYAxis,
  LineChartCartesianGrid,
  LineChartChartTooltip,
  LineChartLegend,
  LineChartReferenceLine,
} from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function BasicLineChart() {
  const data = [
    { month: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
    { month: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
    { month: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
    { month: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
    { month: 'May', sales: 3500, profit: 1800, revenue: 5300 },
    { month: 'Jun', sales: 4200, profit: 2100, revenue: 6300 },
  ];

  return (
    <Box width="100%" height="400px">
      <LineChart data={data} colorTheme="default">
        <LineChartCartesianGrid />
        <LineChartXAxis dataKey="month" label="Month" />
        <LineChartYAxis label="Amount" />
        <LineChartChartTooltip />
        <LineChartLegend />
        <LineChartLine
          dataKey="sales"
          name="Sales"
          strokeStyle="solid"
          color="chart.background.categorical.azure.moderate"
        />
        <LineChartLine
          dataKey="profit"
          name="Profit"
          strokeStyle="dashed"
          color="chart.background.categorical.emerald.moderate"
        />
        <LineChartLine
          dataKey="revenue"
          name="Revenue"
          strokeStyle="solid"
          color="chart.background.categorical.crimson.moderate"
        />
        <LineChartReferenceLine y={4000} label="Target: 4000" />
      </LineChart>
    </Box>
  );
}
```