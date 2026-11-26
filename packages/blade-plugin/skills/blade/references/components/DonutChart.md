# DonutChart

## Description

DonutChart is a circular data visualization component built on top of Recharts with Blade design system styling. It displays data as segments of a donut-shaped chart with customizable radius, colors, and center text. The component supports both full circle and semicircle variants, making it ideal for displaying proportional data, percentages, and categorical information in an intuitive visual format.

## Important Constraints

- `ChartDonut` component must be wrapped inside `ChartDonutWrapper` component
- `data` prop is required and must be an array of objects with consistent structure
- Set `dataKey` and `nameKey` props to specify which properties to use for values and labels
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
  dataKey?: RechartsPieProps['dataKey'];
  /**
   * The name key of the Donut chart.
   */
  nameKey?: RechartsPieProps['nameKey'];
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
  colorTheme?: 'categorical';
  /**
   * The type of the Donut chart.
   */
  type?: 'circle' | 'semicircle';
};

type Content = {
  value?: string;
  label?: string;
};

/**
 * The look of a chart. `v1` renders as before, and the display options have no effect.
 * `v2` is the new look. The legend options sit on `ChartLegend` and apply with `v2` only.
 * Web only: the native charts ignore them and warn in development.
 */
type ChartVersion = 'v1' | 'v2';

type ChartVersionProps = {
  /** @default 'v1' */
  version?: ChartVersion;
};

/** A Blade spacing token from `spacing.3` to `spacing.8`. */
type ChartLegendGap = 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.6' | 'spacing.7' | 'spacing.8';

type ChartValueFormat = {
  /** `currency`: an amount. `count`: whole numbers. `percent`: a value already in percent. */
  type: 'currency' | 'count' | 'percent';
  /** For `currency`. @default 'INR' */
  currency?: string;
};

/** The legend options of `ChartLegend` (in addition to the recharts Legend props). */
type ChartLegendDisplayOptions = {
  /**
   * Where the legend sits: above, below, left or right of the ring. The ring and the legend are
   * one group, centred in the box. `version="v2"` only.
   * When set, it wins over recharts' `verticalAlign` (and `left` or `right` over `align`), and a
   * development warning shows when both are set.
   * @default 'bottom'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * The gap between the ring and the legend. `version="v2"` only.
   * @default 'spacing.5'
   */
  gap?: ChartLegendGap;
};

type ChartDonutWrapperProps = {
  /**
   * Content to be displayed at center of donut chart
   */
  content?: Content | React.ReactNode;
  children?: React.ReactNode;
  /**
   * en-IN value format of the tooltip values (₹1,23,450.00), unless the tooltip has its own
   * `formatter`. Works in `v1` too. Web only.
   */
  valueFormat?: ChartValueFormat;
} & ChartVersionProps & BoxProps;


type ChartDonutCellProps = CellProps & {
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

## Usage Guidelines

**Do**

- Use `DonutChart` for displaying proportional/percentage data showing parts of a whole.
- Always wrap `ChartDonut` inside `ChartDonutWrapper` — standalone use is not supported.
- Use the `content` prop on `ChartDonutWrapper` to display a summary value/label in the center hole.
- Use `ChartDonutCell` components (one per data item) to customize segment colors.
- Use `type="semicircle"` for half-donut displays when vertical space is constrained.

**Don't**

- Don't put multiple `ChartDonut` components inside one wrapper — only one is allowed.
- Don't use `DonutChart` for time-series trends — use `LineChart` or `AreaChart` instead.
- Don't use `DonutChart` for comparing absolute values across categories — use `BarChart` instead.
- Don't mismatch the number of `ChartDonutCell` components with data items.

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

### Donut Chart with the v2 Look

`version="v2"` turns on the new look. The legend options sit on `ChartLegend`: `placement` puts the legend above, below, left or right of the ring, and `gap` sets the space between them. A `ChartLegend` child shows the legend. With none, the chart has no legend.

```tsx
import React from 'react';
import {
  Box,
  ChartDonut,
  ChartDonutWrapper,
  ChartTooltip,
  ChartLegend,
} from '@razorpay/blade/components';

function DonutChartV2() {
  const data = [
    { name: 'UPI', value: 52000 },
    { name: 'Cards', value: 24000 },
    { name: 'Netbanking', value: 14000 },
  ];

  return (
    <Box width="100%" height="320px">
      <ChartDonutWrapper version="v2" valueFormat={{ type: 'currency', currency: 'INR' }}>
        <ChartDonut dataKey="value" nameKey="name" data={data} radius="medium" />
        <ChartTooltip />
        <ChartLegend placement="right" gap="spacing.6" />
      </ChartDonutWrapper>
    </Box>
  );
}

export default DonutChartV2;
```
