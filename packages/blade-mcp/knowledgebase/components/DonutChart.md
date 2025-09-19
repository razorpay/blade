## Component Name

DonutChart

## Description

DonutChart is a data visualization component built on top of Recharts with Blade design system styling that renders donut charts for displaying categorical data as proportional segments. It consists of ChartDonutWrapper as the main container and ChartDonut components for the data visualization, along with supporting chart components like tooltips. The component supports both full circle and semicircle donut charts, customizable radius sizes, center text display, color themes, and individual cell customization while maintaining accessibility and responsive design principles.

## Important Constraints

- `ChartDonutWrapper` component only accepts `ChartDonut`, `ChartTooltip`, and `Cell` components as children
- `dataKey` and `nameKey` props are required for `ChartDonut` component and must match keys in the data array
- `data` prop is required for `ChartDonutWrapper` and must be an array of objects
- `color` prop only accepts chart categorical or sequential color tokens in the format `chart.background.categorical.{colorName}.{emphasis}` or `chart.background.sequential.{colorName}.{number}`
- Currently only supports `colorTheme="default"` - other color themes will fallback to default
- `radius` prop only accepts 'small', 'medium', or 'large' values
- `type` prop only accepts 'circle' or 'semicircle' values

## TypeScript Types

The following types represent the props that the DonutChart component and its subcomponents accept. These types allow you to properly configure the component according to your needs.

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
  radius?: 'small' | 'medium' | 'large';
  /**
   * The children of the Donut chart.
   */
  children?: React.ReactNode;
  /**
   * The data of the Donut chart.
   */
  data: data[];
  /**
   * The color theme of the Donut chart.
   */
  colorTheme?: colorTheme;
  /**
   * The type of the Donut chart.
   */
  type?: 'circle' | 'semicircle';
};

type CellProps = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type ChartDonutWrapperProps = {
  /**
   *  Center text of Donut chart
   */
  centerText?: string;
  children?: React.ReactNode;
} & Partial<Omit<BaseBoxProps, keyof FlexboxProps | keyof GridProps>>;

type data = {
  [key: string]: unknown;
};

type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type ChartSequentialColorToken = `chart.background.sequential.${Exclude<
  ChartColorCategories,
  'gray'
>}.${keyof ChartSequentialEmphasis}`;

type colorTheme = 'default';
```

## Examples

### Basic Donut Chart with Center Text

A comprehensive example showing a donut chart with center text, different radius sizes, and custom colors for individual segments.

```typescript
import React from 'react';
import {
  ChartDonut,
  ChartDonutWrapper,
  ChartTooltip,
  Cell,
} from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function BasicDonutChart() {
  const data = [
    { name: 'Desktop', value: 400, color: 'chart.background.categorical.azure.moderate' },
    { name: 'Mobile', value: 300, color: 'chart.background.categorical.emerald.moderate' },
    { name: 'Tablet', value: 200, color: 'chart.background.categorical.orchid.moderate' },
    { name: 'Other', value: 100, color: 'chart.background.categorical.crimson.moderate' },
  ];

  return (
    <Box width="100%" height="400px">
      <ChartDonutWrapper centerText="Total: 1000">
        <ChartDonut 
          dataKey="value" 
          nameKey="name" 
          data={data} 
          radius="medium"
          type="circle"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} color={entry.color} />
          ))}
        </ChartDonut>
        <ChartTooltip />
      </ChartDonutWrapper>
    </Box>
  );
}

export default BasicDonutChart;
```