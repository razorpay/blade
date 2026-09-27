## Component Name

LineChart

## Description

LineChart is a data visualization component built on top of Recharts with Blade design system styling that renders line charts for displaying trends and patterns in continuous data over time. It consists of ChartLineWrapper as the main container and ChartLine components for individual data series, along with supporting chart components like axes, grids, tooltips, and legends. The component supports multiple line series, various line styles (solid, dashed, dotted), stepped lines, null value handling, reference lines, and customizable colors while maintaining accessibility and responsive design principles.

## Important Constraints

- `ChartLineWrapper` component only accepts `ChartLine`, `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid`, `ChartTooltip`, `ChartLegend`, `ChartReferenceLine`, and `ChartReferenceBand` components as children
- `dataKey` prop is required for `ChartLine` component and must match a key in the data array
- `data` prop is required for `ChartLineWrapper` and must be an array of objects
- `color` prop accepts chart color tokens in the format `data.background.categorical.{colorName}.{emphasis}` or `data.background.sequential.{colorName}.{emphasis}`
- Currently only supports `colorTheme="categorical"` - other color themes will fallback to categorical
- When hovering over a line, other lines will fade to 20% opacity to highlight the hovered line
- Lines have an invisible 15px hover target area for better mouse interaction UX

## TypeScript Types

The following types represent the props that the LineChart component and its subcomponents accept. These types allow you to properly configure the component according to your needs.

```typescript
interface ChartLineProps {
  /**
   * The type of the line.
   * @default 'linear'
   */
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  /**
   * The dot of the line.
   * @default false
   */
  dot?: RechartsLineProps['dot'];
  /**
   * The active dot shown on the line chart when hovered.
   * @default true
   */
  activeDot?: RechartsLineProps['activeDot'];
  /**
   * If we don't have data for some points, should we connect the line or skip it.
   */
  connectNulls?: boolean;
  /**
   * The style of the line drawn across null points when `connectNulls` is `true`.
   * @default 'solid'
   */
  connectNullsStyle?: 'solid' | 'dashed';
  /**
   * Include this particular line in legend.
   * @default true
   */
  showLegend?: boolean;
  /**
   * The data key corresponding to a property in the data array.
   */
  dataKey: RechartsLineProps['dataKey'];
  /**
   * Name of the line in line chart.
   * If not provided, the dataKey will be used as the name.
   */
  name?: RechartsLineProps['name'];
  /**
   * Color of the line in line chart.
   * If not provided, colors will be picked from the default theme colors.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Data key for the lower (minimum) bound of this line's reference band.
   * When both `rangeLowerDataKey` and `rangeUpperDataKey` are set, a shaded band is drawn behind this line.
   */
  rangeLowerDataKey?: string;
  /**
   * Data key for the upper (maximum) bound of this line's reference band.
   */
  rangeUpperDataKey?: string;
  /**
   * Legend and tooltip label for this line's reference band.
   * @default 'Industry range'
   */
  rangeName?: string;
  /**
   * Fill color of this line's reference band.
   * @default the color of the line
   */
  rangeColor?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Whether to show this line's reference band as a separate legend entry.
   * @default the `showLegend` value of the line
   */
  showRangeLegend?: boolean;
  /**
   * Style of the line in line chart.
   * @default 'solid'
   */
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
  /**
   * Whether to hide this line. When true, the line will not be rendered.
   * This is typically controlled internally by legend click interactions.
   */
  hide?: boolean;
}

type data = {
  [key: string]: unknown;
};

type ChartLineWrapperProps = {
  /**
   * The color theme of the line chart.
   */
  colorTheme?:  'categorical';
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

type ChartReferenceBandProps = {
  /**
   * The data key for the lower (minimum) bound of the range.
   * Each data row must have a numeric value at this key.
   */
  lowerDataKey: string;
  /**
   * The data key for the upper (maximum) bound of the range.
   * Each data row must have a numeric value at this key.
   */
  upperDataKey: string;
  /**
   * The label shown for the range in the legend.
   * @default 'Reference band'
   */
  name?: string;
  /**
   * The fill color of the range band.
   * @default 'data.background.categorical.blue.faint'
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Whether to show a legend entry for the range.
   * @default true
   */
  showLegend?: boolean;
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
    /**
   * The interval of the x-axis.
   * @default: 0
   * @example
   * // Data: [{ date: 'Jan', year: '2024' }, { date: 'Feb', year: '2024' }]
   * <ChartXAxis dataKey="date" interval={1} />
   * // Renders:
   * //   Jan
   * //   Feb
   *
   * note: if you can't  see all labels in case of large labels. try setting interval 0
   */
  interval?: number;
  /**
   * Custom formatter function to transform tick values before display.
   * Useful for formatting timestamps, currencies, or other numeric values.
   *
   * @param value - The raw tick value from the data
   * @param index - The index of the tick
   * @returns The formatted string to display
   *
   * @example
   * // Format timestamp to readable date
   * <ChartXAxis
   *   dataKey="timestamp"
   *   tickFormatter={(value) => new Date(value).toLocaleDateString()}
   * />
   *
   * @example
   * // Format currency values
   * <ChartXAxis
   *   dataKey="amount"
   *   tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
   * />
   */
  tickFormatter?: (value: string, index: number) => string;
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

type Layout = 'horizontal' | 'vertical';
type Align = 'left' | 'right';

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type ChartLegendProps = ComponentProps<typeof RechartsLegend> & {
  layout?: Layout;
  align?: Align;
  /**
   * Array of dataKeys that are currently selected.
   * When provided, the component is in controlled mode.
   */
  selectedDataKeys?: string[];
  /**
   * Default selected dataKeys for uncontrolled mode.
   * If not provided, all dataKeys are selected by default.
   */
  defaultSelectedDataKeys?: string[];
  /**
   * Callback fired when the selection changes.
   */
  onSelectedDataKeysChange?: ({
    dataKey,
    selectedKeysArray,
  }: {
    dataKey: string;
    selectedKeysArray: string[];
  }) => void;
};


type ChartCartesianGridProps = Omit<RechartsCartesianGridProps, 'strokeDasharray' | 'verticalFill' | 'horizontalFill'>;

type ChartsCategoricalColorToken = `data.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type ChartSequentialColorToken = `data.background.sequential.${Exclude<ChartColorCategories, 'gray'>}.${keyof ChartSequentialEmphasis}`;

type colorTheme = 'categorical';
```

## Usage Guidelines

**Do**

- Use `LineChart` for displaying time-series trends and comparing multiple data series over time.
- Wrap in `ChartLineWrapper` and compose with `ChartLine`, `ChartXAxis`, `ChartYAxis`, `ChartTooltip`, `ChartLegend`.
- Use `strokeStyle="dashed"` for forecast or projected data to visually distinguish from actual data.
- Use `connectNulls={true}` for datasets with missing values that should show continuous lines.
- Use `ChartReferenceLine` to add target/threshold lines for context.
- Use `ChartReferenceBand` (or `rangeLowerDataKey` and `rangeUpperDataKey` on `ChartLine`) to show a min–max range behind the lines.

**Don't**

- Don't use `LineChart` when you want to emphasize volume or cumulative data — use `AreaChart` (same as LineChart but with filled region).
- Don't use `LineChart` for categorical comparisons — use `BarChart` instead.
- Don't use `LineChart` for proportional data — use `DonutChart` for parts-of-a-whole visualization.

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
          color="data.background.categorical.emerald.moderate"
        />
        <ChartLine
          dataKey="expenses"
          name="Expenses"
          strokeStyle="solid"
          color="data.background.categorical.crimson.moderate"
        />
        <ChartReferenceLine y={3000} label="Target: $3000" />
      </ChartLineWrapper>
    </Box>
  );
}

export default BasicLineChart;
```

### Line Chart with Reference Band

Use `ChartReferenceBand` to show a shaded range (for example, the range of similar businesses) behind the line.

```tsx
import React from 'react';
import {
  Box,
  ChartLine,
  ChartLineWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartReferenceBand,
  ChartReferenceLine,
} from '@razorpay/blade/components';

function LineChartWithReferenceBand() {
  const data = [
    { month: 'Jan', activeUsers: 1100, min: 900, max: 1400 },
    { month: 'Feb', activeUsers: 1250, min: 950, max: 1450 },
    { month: 'Mar', activeUsers: 1180, min: 1000, max: 1500 },
    { month: 'Apr', activeUsers: 1320, min: 1050, max: 1550 },
  ];

  return (
    <Box width="100%" height="400px">
      <ChartLineWrapper data={data}>
        <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Reference band" />
        <ChartXAxis dataKey="month" />
        <ChartYAxis label="Active users" />
        <ChartTooltip />
        <ChartLegend />
        <ChartLine
          dataKey="activeUsers"
          name="Active users"
          color="data.background.categorical.gray.intense"
        />
        <ChartReferenceLine y={1200} label="Avg: 1,200" />
      </ChartLineWrapper>
    </Box>
  );
}

export default LineChartWithReferenceBand;
```
