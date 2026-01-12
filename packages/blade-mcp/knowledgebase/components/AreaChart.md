# AreaChart

## Component Name

AreaChart

## Description

AreaChart is a data visualization component built on top of Recharts that displays quantitative data as filled areas under curves. It supports single and multiple data series, stacked areas, and various styling options. The component is designed for showing trends over time, comparing multiple datasets, and highlighting data patterns with customizable colors and interactive features.

## Important Constraints

- Maximum of 10 areas can be configured in a single chart (throws error if exceeded)
- `ChartAreaWrapper` only accepts `ChartArea` components as direct children for proper indexing
- `dataKey` prop is required for each `ChartArea` component to specify which data field to display
- `name` prop is required for each `ChartArea` component for legend and tooltip display
- Data array must contain objects with consistent key structure across all data points
- `colorTheme` currently only supports 'default' value (other themes will log warning)

## TypeScript Types

These types define the props that the AreaChart component and its subcomponents accept:

```typescript

type ChartAreaProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  connectNulls?: boolean;
  showLegend?: boolean;
  dataKey: string;
  name: string;
  stackId?: string | number;
  color?: ChartsCategoricalColorToken;
  dot?: RechartAreaProps['dot'];
  activeDot?: RechartAreaProps['activeDot'];
}

type data = {
  [key: string]: string | number | null;
};

type ChartAreaWrapperProps = {
  children?: React.ReactNode;
  colorTheme?:  'categorical';
  data: data[];
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
  /**
   * Optional secondary data key for multi-line X-axis labels.
   * When provided, the X-axis will display two lines of text:
   * - Primary label (from dataKey)
   * - Secondary label (from secondaryDataKey)
   * @example
   * // Data: [{ date: 'Jan', year: '2024' }, { date: 'Feb', year: '2024' }]
   * <ChartXAxis dataKey="date" secondaryDataKey="year" />
   * // Renders:
   * //   Jan        Feb
   * //  2024       2024
   */
   secondaryDataKey?: string;
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


type Layout = 'horizontal' | 'vertical';
type Align = 'left' | 'right';

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type ChartLegendProps = ComponentProps<typeof RechartsLegend> & {
  layout?: Layout;
  align?: Align;
};


type ChartCartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

type ChartsCategoricalColorToken = `data.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type colorTheme = 'categorical';
```

## Examples

### Basic Area Chart with Single Data Series

```typescript
import React from 'react';
import {
  ChartAreaWrapper,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  Box,
} from '@razorpay/blade/components';

function BasicAreaChart() {
  const data = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
  ];

  return (
    <Box width="100%" height="400px">
      <ChartAreaWrapper data={data}>
        <ChartCartesianGrid />
        <CharChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <Area
          dataKey="revenue"
          name="Revenue"
          type="monotone"
          color="data.background.categorical.azure.intense"
        />
      </ChartAreaWrapper>
    </Box>
  );
}
```
