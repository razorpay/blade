# BarChart

## Component Name

BarChart

## Description

BarChart is a comprehensive data visualization component that renders interactive bar charts with support for grouped, stacked, and vertical layouts. It provides customizable colors, animations, and interactive features like hover states and tooltips. The component is built on top of Recharts and integrates seamlessly with Blade's design system, offering consistent styling and accessibility features. BarChart supports multiple data series, custom color themes, and various chart configurations for displaying categorical data effectively.

## Important Constraints

- `ChartBarWrapper` component only accepts `ChartBar`, `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid`, `ChartTooltip`, `ChartLegend`, and `ChartReferenceLine` components as children.
- `data` prop is required and must be an array of objects with consistent data structure
- `dataKey` prop is required for each `ChartBar` component and must correspond to a property in the data array
- `stackId` must be consistent across all bars that should be stacked together
- `layout="vertical"` requires `ChartXAxis` to have `type="number"` and `ChartYAxis` to have `type="category"`
- Color tokens must follow the exact format: `chart.background.categorical.{color}.{emphasis}` or `chart.background.sequential.{color}.{number}`

## TypeScript Types

These types define the props that the BarChart component and its subcomponents accept:

```typescript
type ChartBarProps = Omit<RechartsBarProps, 'fill' | 'dataKey' | 'name' | 'label' | 'activeBar'> & {
  /**
   * The data key of the bar chart.
   */
  dataKey: RechartsBarProps['dataKey'];
  /**
   * The name of the bar chart.
   */
  name?: RechartsBarProps['name'];
  /**
   * The color of the bar chart.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * The stack id of the bar chart.
   */
  stackId?: RechartsBarProps['stackId'];
  /**
   * The active bar of the bar chart.
   */
  activeBar?: RechartsBarProps['activeBar'];
  /**
   * The label of the bar chart.
   */
  label?: RechartsBarProps['label'];
  /**
   * The show legend of the bar chart.
  */
  showLegend?: boolean;
};

type data = {
  [key: string]: unknown;
};

type ChartBarWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the bar chart.
   */
  colorTheme?: colorTheme;
  /**
   * The orientation of the bar chart.
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Chart data to be rendered
   */
  data: data[];
} & BoxProps;


type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type ChartSequentialColorToken = `chart.background.sequential.${Exclude<ChartColorCategories, 'gray'>}.${keyof ChartSequentialEmphasis}`;

type colorTheme = 'default';

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

type ChartCartesianGridProps = Omit<RechartsCartesianGridProps, 'strokeDasharray' | 'verticalFill' | 'horizontalFill'>;

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
```

## Example

### Basic BarChart with Multiple Series

```tsx
import React from 'react';
import {
  ChartBar,
  ChartBarWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '@razorpay/blade/components';

const salesData = [
  { month: 'Jan', revenue: 4000, profit: 2000, expenses: 1000 },
  { month: 'Feb', revenue: 3000, profit: 1500, expenses: 800 },
  { month: 'Mar', revenue: 5000, profit: 3000, expenses: 1200 },
  { month: 'Apr', revenue: 4500, profit: 2500, expenses: 1100 },
];

const BasicBarChart = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ChartBarWrapper data={salesData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLegend />
        <ChartBar
          dataKey="revenue"
          name="Revenue"
          color="chart.background.categorical.azure.moderate"
        />
        <ChartBar
          dataKey="profit"
          name="Profit"
          color="chart.background.categorical.emerald.moderate"
        />
        <ChartBar
          dataKey="expenses"
          name="Expenses"
          color="chart.background.categorical.crimson.moderate"
        />
      </ChartBarWrapper>
    </div>
  );
};
```