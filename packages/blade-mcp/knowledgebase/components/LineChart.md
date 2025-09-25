## Component Name

LineChart

## Description

LineChart is a data visualization component built on top of Recharts with Blade design system styling that renders line charts for displaying trends and patterns in continuous data over time. It consists of ChartLineWrapper as the main container and ChartLine components for individual data series, along with supporting chart components like axes, grids, tooltips, and legends. The component supports multiple line series, various line styles (solid, dashed, dotted), stepped lines, null value handling, reference lines, and customizable colors while maintaining accessibility and responsive design principles.

## Important Constraints

- `ChartLineWrapper` component only accepts `ChartLine`, `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid`, `ChartTooltip`, `ChartLegend`, and `ChartReferenceLine` components as children
- `dataKey` prop is required for `ChartLine` component and must match a key in the data array
- `data` prop is required for `ChartLineWrapper` and must be an array of objects
- `color` prop only accepts chart categorical color tokens in the format `chart.background.categorical.{colorName}.{emphasis}`
- Currently only supports `colorTheme="default"` - other color themes will fallback to default

## TypeScript Types

The following types represent the props that the LineChart component and its subcomponents accept. These types allow you to properly configure the component according to your needs.

```typescript
interface ChartLineProps {
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

type data = {
  [key: string]: unknown;
};

type ChartLineWrapperProps = {
  /**
   * The color theme of the line chart.
   */
  colorTheme?: colorTheme;
  /**
   * Chart data to be rendered
   */
  data: data[];
  children: React.ReactNode;
} & BoxProps;

type ChartReferenceLineProps = {
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

type ChartXAxisProps = Omit<RechartsXAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the x-axis.
   */
  label?: string;
  /**
   * The data key of the x-axis.
   */
  dataKey?: string;
};

type ChartYAxisProps = Omit<RechartsYAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
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

type ChartLegendProps = ComponentProps<typeof RechartsLegend>;

type ChartCartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type colorTheme = 'categorical';
```

## Examples

### Basic Line Chart with Multiple Series

A comprehensive example showing a line chart with multiple data series, axis labels, grid, tooltip, legend, and reference line with different stroke styles and colors.

```typescript
import React from 'react';
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
import { Box } from '@razorpay/blade/components';

function BasicLineChart() {
  const data = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Apr', revenue: 2780, expenses: 3908 },
    { month: 'May', revenue: 1890, expenses: 4800 },
    { month: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={data}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" label="Month" />
        <ChartYAxis label="Amount ($)" />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey="revenue"
          name="Revenue"
          strokeStyle="solid"
          color="chart.background.categorical.emerald.moderate"
        />
        <ChartLine
          dataKey="expenses"
          name="Expenses"
          strokeStyle="solid"
          color="chart.background.categorical.crimson.moderate"
        />
        <ChartReferenceLine y={3000} label="Target: $3000" />
      </ChartLineWrapper>
    </Box>
  );
}

export default BasicLineChart;
```