# BarChart

## Component Name

BarChart

## Description

BarChart is a comprehensive data visualization component that renders interactive bar charts with support for grouped, stacked, and vertical layouts. It provides customizable colors, animations, and interactive features like hover states and tooltips. The component is built on top of Recharts and integrates seamlessly with Blade's design system, offering consistent styling and accessibility features. BarChart supports multiple data series, custom color themes, and various chart configurations for displaying categorical data effectively.

## Important Constraints

- `ChartBarWrapper` component only accepts `ChartBar`, `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid`, `ChartTooltip`, `ChartLegend`, `ChartReferenceLine`, and `ChartReferenceBand` components as children.
- A reference band shows a min–max range behind the bars. Two ways to declare one, and they behave differently:
  - `ChartReferenceBand` — one range for the whole chart, **always visible**, gets a legend swatch by default.
  - `rangeLowerDataKey` + `rangeUpperDataKey` on `ChartBar` — a range per bar, **revealed only while that bar is hovered** (so several ranges in a grouped chart don't overlap into an unreadable wash), colour-matched to its bar, no legend swatch by default.
- A band needs **both** range bound keys set. Only one is ignored — nothing renders.
- Reference band values must be numeric and present on every row of `data`, under the keys named by the lower/upper props.
- `data` prop is required and must be an array of objects with consistent data structure
- `dataKey` prop is required for each `ChartBar` component and must correspond to a property in the data array
- `stackId` must be consistent across all bars that should be stacked together
- `layout="vertical"` requires `ChartXAxis` to have `type="number"` and `ChartYAxis` to have `type="category"`
- Color tokens must follow the exact format: `data.background.categorical.{color}.{emphasis}` or `data.background.sequential.{color}.{number}`
- Bar animations are controlled internally to ensure smooth entry/exit animations while preventing unwanted animations during tooltip hover interactions

## TypeScript Types

These types define the props that the BarChart component and its subcomponents accept:

```typescript
type ChartBarProps = Omit<RechartsBarProps, 'fill' | 'dataKey' | 'name' | 'label' | 'activeBar'> & {
  /**
   * The data key corresponding to a property in the data array.
   */
  dataKey: RechartsBarProps['dataKey'];
  /**
   * The name of the bar shown in tooltip and legend.
   * If not provided, the dataKey will be used as the name.
   */
  name?: RechartsBarProps['name'];
  /**
   * The color of the bar.
   * If not provided, colors will be picked from the default theme colors.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * The stack id of the bar chart.
   * Bars with the same stackId will be stacked on top of each other.
   */
  stackId?: RechartsBarProps['stackId'];
  /**
   * The active bar configuration for hover states.
   * @default false
   */
  activeBar?: RechartsBarProps['activeBar'];
  /**
   * The label configuration for the bar chart.
   * Can be a boolean, object, or custom render function.
   * @default false
   */
  label?: RechartsBarProps['label'];
  /**
   * Whether to show this bar in the legend.
   * @default true
   */
  showLegend?: boolean;
  /**
   * Whether to hide this bar. When true, the bar will not be rendered.
   * This is typically controlled internally by legend click interactions.
   */
  hide?: boolean;
  /**
   * The width of the bar in pixels.
   */
  barSize?: RechartsBarProps['barSize'];
  /**
   * Data key for the lower (min) bound of this bar's reference range.
   * A band is drawn for this bar only when both rangeLowerDataKey and rangeUpperDataKey are set.
   * The band is revealed while this bar is hovered.
   */
  rangeLowerDataKey?: string;
  /**
   * Data key for the upper (max) bound of this bar's reference range.
   */
  rangeUpperDataKey?: string;
  /**
   * Label shown for this bar's range in the legend and the tooltip.
   * @default 'Industry range'
   */
  rangeName?: string;
  /**
   * Fill color of this bar's range band.
   * @default the bar's own resolved color
   */
  rangeColor?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Whether to show a legend swatch for this bar's range band.
   * Off by default because the band is only on screen while its bar is hovered.
   * @default false
   */
  showRangeLegend?: boolean;
};

type ChartReferenceBandProps = {
  /**
   * The data key for the lower (minimum) bound of the range.
   * Each data row should hold a numeric value at this key.
   */
  lowerDataKey: string;
  /**
   * The data key for the upper (maximum) bound of the range.
   */
  upperDataKey: string;
  /**
   * The label shown for the range in the legend and the tooltip.
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

type data = {
  [key: string]: unknown;
};

type ChartBarWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the bar chart.
   */
  colorTheme?:  'categorical';
  /**
   * The orientation of the bar chart.
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Chart data to be rendered
   */
  data: data[];
} & BoxProps;


type ChartsCategoricalColorToken = `data.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

type ChartSequentialColorToken = `data.background.sequential.${Exclude<ChartColorCategories, 'gray'>}.${keyof ChartSequentialEmphasis}`;

type colorTheme = 'categorical';


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
   *  Optional secondary data key for multi-line X-axis labels.
   *  When provided, the X-axis will display two lines of text:
   *  - Primary label (from dataKey)
   *  - Secondary label (from secondaryDataKey)
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

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;


type Layout = 'horizontal' | 'vertical';
type Align = 'left' | 'right';

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type ChartLegendProps = ComponentProps<typeof RechartsLegend> & {
  layout?: Layout;
  align?: Align;
};


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

## Usage Guidelines

**Do**

- Use `BarChart` for comparing discrete categorical values across groups.
- Wrap in `ChartBarWrapper` and compose with `ChartBar`, `ChartXAxis`, `ChartYAxis`, `ChartTooltip`, `ChartLegend`.
- Use `stackId` on multiple `ChartBar` components to create stacked bars showing composition.
- Use `layout="vertical"` for horizontal bars — remember to set `ChartXAxis type="number"` and `ChartYAxis type="category"`.
- Use both categorical and sequential color tokens — BarChart supports both palettes unlike other charts.
- Use `ChartReferenceBand` when there is **one** range the whole chart is measured against (e.g. a single success-rate series vs the industry percentile band).
- Use the `range*` props on `ChartBar` when **each** bar has its own range (e.g. grouped bars per payment method, each with its own industry band).
- Pass `formatter` to `ChartTooltip` when values carry a unit — it formats the bar's value and both range bounds, so the tooltip reads `62%` and `48%–70%`.

**Don't**

- Don't use `BarChart` for time-series trends — use `LineChart` or `AreaChart` instead.
- Don't use `BarChart` for proportional/percentage composition — use `DonutChart` instead.
- Don't add `<Defs/>` elements — color and gradient handling is managed internally.
- Don't forget to swap axis types when using `layout="vertical"`.
- Don't set `showRangeLegend` on many grouped bars at once — the bands are hover-revealed one at a time, so a row of permanent swatches advertises ranges that aren't on screen.
- Don't combine a chart-wide `ChartReferenceBand` with per-bar `range*` props on the same bar — the bar's own range wins and the chart-wide one is ignored for it.

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
          color="data.background.categorical.blue.moderate"
        />
        <ChartBar
          dataKey="profit"
          name="Profit"
          color="data.background.categorical.green.moderate"
        />
        <ChartBar
          dataKey="expenses"
          name="Expenses"
          color="data.background.categorical.gold.moderate"
        />
      </ChartBarWrapper>
    </div>
  );
};
```

### BarChart with a Reference Band (one range for the whole chart)

```tsx
import React from 'react';
import {
  ChartBar,
  ChartBarWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartReferenceBand,
} from '@razorpay/blade/components';

// `industryLow` / `industryHigh` are the industry's 25th and 75th percentile for that day.
const successRateData = [
  { period: 'Apr 1', successRate: 45, industryLow: 38, industryHigh: 58 },
  { period: 'Apr 2', successRate: 52, industryLow: 42, industryHigh: 64 },
  { period: 'Apr 3', successRate: 62, industryLow: 48, industryHigh: 70 },
  { period: 'Apr 4', successRate: 70, industryLow: 52, industryHigh: 73 },
];

const SuccessRateVsIndustry = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ChartBarWrapper data={successRateData}>
        <ChartReferenceBand
          lowerDataKey="industryLow"
          upperDataKey="industryHigh"
          name="Industry range"
        />
        <ChartXAxis dataKey="period" />
        <ChartYAxis label="Success rate (%)" />
        <ChartTooltip formatter={(value) => `${Number(value)}%`} />
        <ChartLegend />
        <ChartBar dataKey="successRate" name="Success rate" barSize={24} />
      </ChartBarWrapper>
    </div>
  );
};
```

### Grouped BarChart with a Reference Band per Bar

Each bar declares its own range. The bands are revealed on hover, one at a time — hovering a bar
also fades the other series and shades that category.

```tsx
import React from 'react';
import {
  ChartBar,
  ChartBarWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
} from '@razorpay/blade/components';

const methodData = [
  { period: 'Apr 1', card: 54, cardLow: 42, cardHigh: 64, upi: 76, upiLow: 64, upiHigh: 86 },
  { period: 'Apr 2', card: 57, cardLow: 45, cardHigh: 67, upi: 79, upiLow: 67, upiHigh: 89 },
  { period: 'Apr 3', card: 50, cardLow: 38, cardHigh: 60, upi: 72, upiLow: 60, upiHigh: 82 },
];

const SuccessRateByMethod = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ChartBarWrapper data={methodData}>
        <ChartXAxis dataKey="period" />
        <ChartYAxis label="Success rate (%)" />
        <ChartTooltip formatter={(value) => `${Number(value)}%`} />
        <ChartLegend />
        <ChartBar
          dataKey="card"
          name="Card"
          color="data.background.categorical.purple.moderate"
          rangeLowerDataKey="cardLow"
          rangeUpperDataKey="cardHigh"
          rangeName="Card industry range"
        />
        <ChartBar
          dataKey="upi"
          name="UPI"
          color="data.background.categorical.blue.moderate"
          rangeLowerDataKey="upiLow"
          rangeUpperDataKey="upiHigh"
          rangeName="UPI industry range"
        />
      </ChartBarWrapper>
    </div>
  );
};
```