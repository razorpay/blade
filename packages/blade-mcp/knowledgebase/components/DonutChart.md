# DonutChart

## Description

DonutChart is a circular data visualization component built on top of Recharts with Blade design system styling. It displays data as segments of a donut-shaped chart with customizable radius, colors, and center text. The component supports both full circle and semicircle variants, making it ideal for displaying proportional data, percentages, and categorical information in an intuitive visual format.

## Important Constraints

- `ChartDonut` component must be wrapped inside `ChartDonutWrapper` component
- `data` prop is required and must be an array of objects with consistent structure
- `dataKey` and `nameKey` props are required to specify which properties to use for values and labels
- `ChartDonutCell` components should be used to customize individual segment colors
- `radius` prop only accepts 'small', 'medium', or 'large' values
- `type` prop only accepts 'circle' or 'semicircle' values
- `colorTheme` prop currently only supports 'categorical' value
- Center text positioning is automatically calculated based on radius size and presence of legend

## TypeScript Types

These are the props that the DonutChart component and its subcomponents accept:

```typescript
type ChartDonutProps = {
  /**
   * The data key of the Donut chart.
   */
  dataKey: RechartsPieProps['dataKey'];
  /**
   * The name key of the Donut chart.
   */
  nameKey: RechartsPieProps['name'];
  /**
   * The x coordinate of the Donut chart.
   */
  cx?: RechartsPieProps['cx'];
  cy?: RechartsPieProps['cy'];
  /**
   * The radius of the Donut chart.
   */
  radius?: ChartRadius;
  /**
   * The children of the Donut chart.
   */
  children?: React.ReactNode;
  /**
   * The data of the Donut chart.
   */
  data: data[];
  /**
   * The color theme of the chart.
   * @default 'categorical'
   */
  colorTheme?:  'categorical';;
  /**
   * The type of the Donut chart.
   */
  type?: 'circle' | 'semicircle';
};

type Content = {
  value?: string;
  label?: string;
};

type ChartDonutWrapperProps = {
  /**
   * Content to be displayed at center of donut chart
   */
  content?: Content | React.ReactNode;
  children?: React.ReactNode;
} & BoxProps;


 ChartDonutCellProps = CellProps & {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type ChartRadius = 'small' | 'medium' | 'large';

type data = {
  [key: string]: unknown;
};

type colorTheme = 'categorical';

type ChartsCategoricalColorToken = `data.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type ChartSequentialColorToken = `data.background.sequential.${Exclude<
  ChartColorCategories,
  'gray'
>}.${keyof ChartSequentialEmphasis}`;
```

## Example

### Basic Donut Chart with Custom Colors and Center Text

```tsx
import React from 'react';
import { 
  ChartDonut,
  ChartDonutWrapper,
  ChartDonutCell,
  ChartTooltip,
  ChartLegend,
} from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function DonutChartExample() {
  const chartData = [
    { name: 'Desktop', value: 400, percentage: 40 },
    { name: 'Mobile', value: 300, percentage: 30 },
    { name: 'Tablet', value: 200, percentage: 20 },
    { name: 'Other', value: 100, percentage: 10 },
  ];

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="400px">
      <ChartDonutWrapper 
        content={{ value: '1000', label: 'Total Users' }} 
        width="500px" 
        height="400px"
        testID="donut-chart-wrapper"
      >
        <ChartDonut 
          dataKey="value" 
          nameKey="name" 
          data={chartData} 
          radius="medium"
          type="circle"
          colorTheme="categorical"
        >
          <ChartDonutCell color="data.background.categorical.blue.moderate" />
          <ChartDonutCell color="data.background.categorical.green.moderate" />
          <ChartDonutCell color="data.background.categorical.gold.moderate" />
          <ChartDonutCell color="data.background.categorical.purple.moderate" />
        </ChartDonut>
        <ChartTooltip />
        <ChartLegend />
      </ChartDonutWrapper>
    </Box>
  );
}

export default DonutChartExample;
```