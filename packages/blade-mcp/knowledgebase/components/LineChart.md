# LineChart

## Description

LineChart is a data visualization component built on top of Recharts that displays data points connected by lines. It supports multiple lines, different stroke styles (solid, dashed, dotted), various line types (linear, monotone, step), and includes built-in features like tooltips, legends, reference lines, and customizable axes. The component automatically handles color theming and provides responsive behavior for different screen sizes.

## Important Constraints

- `LineChart` component only accepts `LineChartLine`, `LineChartXAxis`, `LineChartYAxis`, `LineChartCartesianGrid`, `LineChartChartTooltip`, `LineChartLegend`, `LineChartReferenceLine` components as children
- `data` prop is required and must be an array of objects
- Each `LineChartLine` component requires a `dataKey` prop that corresponds to a property in the data array
- `colorTheme` can only be 'default' or 'informational'
- `strokeStyle` can only be 'dotted', 'dashed', or 'solid'
- `type` can only be 'step', 'stepAfter', 'stepBefore', 'linear', or 'monotone'

## TypeScript Types

These are the props that the LineChart component and its subcomponents accept:

```typescript
interface LineChartLineProps {
  /**
   * The type of the line.
   * @default: 'linear'
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
  colorTheme?: 'default' ;
  /**
   * Chart data to be rendered
   */
  data: data[];
  children: React.ReactNode;
} & Partial<Omit<BaseBoxProps, keyof FlexboxProps | keyof GridProps>>;

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

## Examples

### Basic Line Chart with Multiple Lines

```tsx
import React from 'react';
import {
  LineChart,
  LineChartLine,
  LineChartXAxis,
  LineChartYAxis,
  LineChartCartesianGrid,
  LineChartChartTooltip,
  LineChartLegend,
} from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function BasicLineChart() {
  const data = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  return (
    <Box width="100%" height="400px">
      <LineChart data={data}>
        <LineChartCartesianGrid />
        <LineChartXAxis dataKey="month" />
        <LineChartYAxis />
        <LineChartChartTooltip />
        <LineChartLegend />
        <LineChartLine
          dataKey="sales"
          name="Sales"
          strokeStyle="solid"
          color="chart.background.categorical.azure.moderate"
        />
        <LineChartLine
          dataKey="revenue"
          name="Revenue"
          strokeStyle="dashed"
          color="chart.background.categorical.emerald.moderate"
        />
      </LineChart>
    </Box>
  );
}
```