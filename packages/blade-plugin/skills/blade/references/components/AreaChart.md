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
- `colorTheme` currently only supports 'categorical' value

## TypeScript Types

These types define the props that the AreaChart component and its subcomponents accept:

```typescript

type ChartAreaProps = {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  connectNulls?: boolean;
  /**
   * The style of the line drawn across null points. Only has an effect when `connectNulls` is `true`.
   * @default 'solid'
   */
  connectNullsStyle?: 'solid' | 'dashed';
  showLegend?: boolean;
  dataKey: RechartAreaProps['dataKey'];
  name: RechartAreaProps['name'];
  stackId?: RechartAreaProps['stackId'];
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  dot?: RechartAreaProps['dot'];
  activeDot?: RechartAreaProps['activeDot'];
  /**
   * Whether to hide the area.
   */
  hide?: boolean;
}

type data = {
  [key: string]: string | number | null;
};

type ChartActivePointItem = {
  dataKey: string;
  name: string;
  value: number | string | undefined;
  /** The value as the chart writes it: the tooltip `formatter`, else `valueFormat`, else raw. */
  formattedValue: string;
  /** The CSS colour of the series. */
  color: string;
  /** The series colour as a chart colour token, as ChartLine, ChartBar and ChartDonutCell take it. */
  colorToken: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

/** The point a pointer, a tap or the arrow keys make active. */
type ChartActivePoint = {
  /** The index of the data row. On a donut, the index of the slice. */
  index: number;
  /** The raw label: the X value (Y on a horizontal bar chart), or the slice name. */
  label: string;
  formattedLabel: string;
  items: ChartActivePointItem[];
};

type ChartActivePointProps = {
  /**
   * Called when the active point changes, and with null when the pointer leaves. Not on every
   * move. Works in `v1` and `v2`, web and native. Use it to show the value in your own UI, for
   * example a headline above the chart. Leave out `ChartTooltip` to show no tooltip.
   *
   * The text follows the `ChartTooltip` `formatter` and `labelFormatter`, which get the row in
   * `payload`, as in recharts. A custom `ChartTooltip` `content` is not mirrored. On a donut,
   * `label` is the raw slice name and `labelFormatter` writes `formattedLabel`.
   */
  onActivePointChange?: (point: ChartActivePoint | null) => void;
};

/**
 * The look of a chart. `v1` renders as before, and the display options have no effect.
 * `v2` is the new look: a tight Y label column, fixed spacing, X labels that thin out to fit.
 * The display options apply with `v2` only. Web only: the native charts ignore them.
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

type ChartLegendDisplayProps = {
  /**
   * Where the legend sits. On a donut, `left` and `right` put it beside the ring.
   * @default 'bottom'
   */
  legendPlacement?: 'top' | 'bottom';
  /**
   * Undefined is auto: the legend shows for 2 or more series (or donut slices) and hides for one.
   * `true` shows it and adds a `ChartLegend` when there is none. `false` hides it.
   */
  showLegend?: boolean;
  /**
   * The gap between the legend and the nearest chart element.
   * @default 'spacing.5'
   */
  legendGap?: ChartLegendGap;
};

/** Display options. They apply with `version="v2"` only, except `valueFormat`. */
type ChartWrapperDisplayProps = {
  /**
   * A line on the left, the right and the bottom of the plot, in the gridline colour and width.
   * With no border, the bottom gridline is the baseline.
   * @default false
   */
  showBorder?: boolean;
  /**
   * Where the Y labels sit: a column `left` or `right` of the plot, or `overlap` inside the plot.
   * `overlap` with `showBorder` shows as `left`. `outside` is an alias of `right`.
   * A bar chart with `layout="vertical"` always takes `left`.
   * @default 'left'
   */
  yLabelPlacement?: 'left' | 'right' | 'overlap' | 'outside';
  /** @default true */
  yGridlines?: boolean;
  /**
   * Gridline and border width: `thin` (1px) or `thinner` (0.5px).
   * @default 'thinner'
   */
  gridlineWidth?: 'thin' | 'thinner';
  /**
   * en-IN value format: compact Y ticks (₹1.5L) and full tooltip values (₹1,23,450.00),
   * unless the axis or tooltip has its own formatter. Works in `v1` too.
   */
  valueFormat?: ChartValueFormat;
} & ChartLegendDisplayProps &
  ChartVersionProps;

type ChartAreaWrapperProps = {
  children?: React.ReactNode;
  colorTheme?:  'categorical';
  data: data[];
} & ChartWrapperDisplayProps & ChartActivePointProps & BoxProps;

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

- Use `AreaChart` for showing trends over time with filled regions to emphasize volume or cumulative data.
- Wrap in `ChartAreaWrapper` with `data` prop and compose with `ChartArea`, `ChartXAxis`, `ChartYAxis`, `ChartTooltip`, `ChartLegend`.
- Use `stackId` on multiple `ChartArea` components to create stacked area visualizations showing cumulative proportions.
- Use `connectNulls={true}` when your data has gaps that should be interpolated across.
- Use `type="monotone"` (default) for smooth curves; `type="step"` for discrete step data.

**Don't**

- Don't use more than 10 `ChartArea` components per chart — this is the maximum enforced limit.
- Don't use `AreaChart` for categorical comparisons — use `BarChart` instead.
- Don't use `AreaChart` for showing parts of a whole — use `DonutChart` for proportional data.
- Don't try to customize chart margins — they are predefined internally.

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
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartArea
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
