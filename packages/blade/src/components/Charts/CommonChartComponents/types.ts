import type {
  XAxisProps as RechartsXAxisProps,
  YAxisProps as RechartsYAxisProps,
  CartesianGridProps as RechartsCartesianGridProps,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ReferenceLineProps as RechartsReferenceLineProps,
} from 'recharts';
import type { Props as RechartsLabelProps } from 'recharts/types/component/Label';
import type { ComponentProps } from 'react';
import type { ChartValueFormat } from '../utils/chartValueFormat';
import type {
  DataColorCategories,
  DataCategoricalEmphasis,
  DataSequentialEmphasis,
} from '~tokens/theme/theme';

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
   * Each data row should hold a numeric value at this key.
   */
  lowerDataKey: string;
  /**
   * The data key for the upper (maximum) bound of the range.
   * Each data row should hold a numeric value at this key.
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
   *
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

/**
 * Where the Y labels sit.
 * - `left`: in a column left of the plot, as wide as the widest label plus a gap.
 * - `right`: in a column right of the plot, as wide as the widest label plus a gap. Each label is
 *   centred on its gridline.
 * - `overlap`: inside the plot, from its left edge, just below their gridline, with a halo.
 * - `outside`: an alias of `right`. It stays for the stories and GenUI nodes that use it.
 */
type ChartYLabelPlacement = 'left' | 'right' | 'overlap' | 'outside';

/** The Y label placement after the wrapper resolves it. `outside` resolves to `right`. */
type ChartResolvedYLabelPlacement = 'left' | 'right' | 'overlap';

/** The stroke style of a ChartLine. The legend draws the line swatch in it. */
type ChartLineStrokeStyle = 'solid' | 'dashed' | 'dotted';

/** The stroke width of the gridlines. `thin` is `border.width.thin`, `thinner` is `border.width.thinner`. */
type ChartGridlineWidth = 'thin' | 'thinner';

/** Where the legend sits. */
type ChartLegendPlacement = 'top' | 'bottom';

/** Where the donut legend sits. `left` and `right` put it beside the ring, in a column. */
type ChartDonutLegendPlacement = ChartLegendPlacement | 'left' | 'right';

/** The gap between the legend and the chart: a Blade spacing token from `spacing.3` to `spacing.8`. */
type ChartLegendGap =
  | 'spacing.3'
  | 'spacing.4'
  | 'spacing.5'
  | 'spacing.6'
  | 'spacing.7'
  | 'spacing.8';

/**
 * The look of a chart.
 * - `v1`: the chart as on Blade master. The display options have no effect.
 * - `v2`: the new look. The Y labels sit in a tight `left` column. Fixed spacing: `spacing.5`
 *   from the legend to the nearest chart element, `spacing.3` from the plot to the X labels, and
 *   no space under the X labels unless the X axis has a `label`. The plot height is the same with
 *   and without `showBorder`. The X labels never wrap and thin out to fit. A line series shows a
 *   line swatch. The display options apply.
 */
type ChartVersion = 'v1' | 'v2';

/** The `version` prop of every chart wrapper: line, area, bar and donut. */
type ChartVersionProps = {
  /**
   * The look of the chart. `v1` renders as Blade master, and the display options have no effect.
   * `v2` is the new look, and the display options apply. Web only.
   * @default 'v1'
   */
  version?: ChartVersion;
};

/**
 * Opt-in legend options of every chart wrapper with a legend: line, area, bar and donut. They
 * apply with `version="v2"` only. Web only: the native charts ignore them.
 */
type ChartLegendDisplayProps = {
  /**
   * Where the legend sits: above or below the chart. On top, it is left-aligned. A legend with
   * `layout="vertical"` stays at the side.
   * @default 'bottom'
   */
  legendPlacement?: ChartLegendPlacement;
  /**
   * Shows or hides the legend. Undefined is auto: the legend shows for 2 or more series (or donut
   * slices) and hides for one. `true` shows it, and adds a `ChartLegend` when the chart has none.
   * `false` hides a `ChartLegend` child.
   * @default undefined (auto)
   */
  showLegend?: boolean;
  /**
   * The gap between the legend and the nearest chart element. On a donut, the gap between the
   * ring and the legend.
   * @default 'spacing.5'
   */
  legendGap?: ChartLegendGap;
};

/**
 * Opt-in display options of ChartBarWrapper, ChartLineWrapper and ChartAreaWrapper. They apply
 * with `version="v2"` only. With `v1`, they have no effect and a development warning shows. Web
 * only: the native charts ignore them. `valueFormat` applies in both versions.
 */
type ChartWrapperDisplayProps = {
  /**
   * Shows or hides a border around the plot: one line on the left, the right and the bottom.
   * Each line is drawn once, in the colour and the width of the gridlines (`gridlineWidth`).
   * With no border, only the horizontal gridlines show, and the bottom gridline is the baseline.
   *
   * With `yLabelPlacement="overlap"`, the border puts the Y labels in a `left` column.
   * @default false
   */
  showBorder?: boolean;
  /**
   * Where the Y labels sit.
   * - `left`: a column left of the plot. The column is as wide as the widest label plus
   *   `spacing.3`, with no fixed gutter. The widest label starts at the left edge of the chart.
   *   Labels align towards the axis, with tabular digits.
   * - `right`: a column right of the plot, as `left` but mirrored. Each label is centred on its
   *   gridline. The gridlines end `spacing.3` before the column. The bottom label hides when it
   *   meets an X label.
   * - `overlap`: inside the plot, from its left edge, just below each gridline, with a halo in the
   *   surface colour. The bottom label is not drawn. With `showBorder`, it shows as `left`.
   * - `outside`: an alias of `right`.
   *
   * A bar chart with `layout="vertical"` always takes `left`: its category names sit in a column
   * as wide as the widest name plus `spacing.3`.
   * @default 'left'
   */
  yLabelPlacement?: ChartYLabelPlacement;
  /**
   * Shows or hides the horizontal gridlines of `ChartCartesianGrid`.
   * @default true
   */
  yGridlines?: boolean;
  /**
   * The stroke width of the gridlines and the border: `thin` (`border.width.thin`, 1px) or
   * `thinner` (`border.width.thinner`, 0.5px).
   * @default 'thinner'
   */
  gridlineWidth?: ChartGridlineWidth;
  /**
   * The value format of the chart, in en-IN. ChartYAxis writes its ticks compact (₹1.5L, 1.5K,
   * 12.5%) and ChartTooltip writes values in full (₹1,23,450.00, 1,23,450, 12.5%), unless they
   * get their own `tickFormatter` or `formatter`.
   */
  valueFormat?: ChartValueFormat;
} & ChartLegendDisplayProps &
  ChartVersionProps;
type Align = 'left' | 'right';
type ChartName = 'bar' | 'donut' | 'line' | 'area' | 'sankey' | 'funnel';
type DataColorMapping = Record<
  string,
  {
    colorToken: ChartsCategoricalColorToken | ChartSequentialColorToken;
    isCustomColor: boolean;
  }
>;

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
   * Provides the dataKey of the clicked legend item and the new selected dataKeys array.
   */
  onSelectedDataKeysChange?: ({
    dataKey,
    selectedKeysArray,
  }: {
    dataKey: string;
    selectedKeysArray: string[];
  }) => void;
};

type ChartCartesianGridProps = Omit<
  RechartsCartesianGridProps,
  'strokeDasharray' | 'verticalFill' | 'horizontalFill'
>;

type ChartsCategoricalColorToken = `data.background.categorical.${DataColorCategories}.${keyof DataCategoricalEmphasis}`;
type ChartSequentialColorToken = `data.background.sequential.${Exclude<
  DataColorCategories,
  'gray'
>}.${keyof DataSequentialEmphasis}`;

type ChartColorToken = ChartsCategoricalColorToken | ChartSequentialColorToken;

/**
 * Pre-computed map of index to secondary label value for X-axis secondary labels.
 * This is computed in chart wrappers when secondaryDataKey is provided.
 */
type SecondaryLabelMap = Record<number, string | number | undefined>;

/**
 * Legend info for a reference band, surfaced through context so the shared
 * legend can render a swatch for it (the band's bound lines are invisible, so
 * they don't produce a Recharts legend entry).
 */
type ReferenceBandLegendInfo = {
  name: string;
  color: ChartsCategoricalColorToken | ChartSequentialColorToken;
  fillOpacity: number;
};

/**
 * Map of a line's dataKey to its reference-band range keys, surfaced through context so the shared
 * tooltip can show the industry range (low–high) for each series next to its value.
 */
type RangeMap = Record<
  string,
  {
    rangeLowerDataKey: string;
    rangeUpperDataKey: string;
    rangeName?: string;
  }
>;

// State type - contains only the state values
type CommonChartComponentsStateType = {
  dataColorMapping?: DataColorMapping;
  chartName?: ChartName;
  selectedDataKeys?: string[];
  /**
   * Pre-computed map of index to secondary label value for X-axis secondary labels
   */
  secondaryLabelMap?: SecondaryLabelMap;
  /**
   * The number of data points in the chart, used for tick width calculation
   */
  dataLength?: number;
  /**
   * The data rows of the chart. ChartXAxis measures its labels from them.
   */
  chartData?: ReadonlyArray<Record<string, unknown>>;
  /**
   * Legend info for each reference band present in the chart (one per line with a range, plus any
   * standalone band), so the legend can render a swatch per band.
   */
  referenceBands?: ReferenceBandLegendInfo[];
  /**
   * Map of line dataKey -> range keys, so the tooltip can show each series' industry range.
   */
  rangeMap?: RangeMap;
  /**
   * The look of the chart. Every part reads it. Undefined is `v1`.
   */
  chartVersion?: ChartVersion;
  /**
   * The resolved border. ChartYAxis draws it and ChartCartesianGrid leaves out its base gridline.
   */
  showBorder?: boolean;
  /**
   * True for a bar chart with `layout="vertical"`: its Y axis holds category names.
   */
  isVerticalBar?: boolean;
  /**
   * The resolved Y label placement. ChartYAxis reads it.
   */
  yLabelPlacement?: ChartResolvedYLabelPlacement;
  /**
   * The resolved horizontal gridlines. ChartCartesianGrid reads it.
   */
  yGridlines?: boolean;
  /**
   * The resolved gridline width. Undefined keeps recharts' 1px. ChartCartesianGrid and the border
   * read it.
   */
  gridlineWidth?: ChartGridlineWidth;
  /**
   * The legend placement. ChartLegend reads it.
   */
  legendPlacement?: ChartDonutLegendPlacement;
  /**
   * The resolved legend visibility. `false` hides ChartLegend. Undefined with `v1`.
   */
  isLegendVisible?: boolean;
  /**
   * The resolved legend gap token. ChartLegend reads it.
   */
  legendGap?: ChartLegendGap;
  /**
   * The `radius` size of the ChartDonut. The `v2` donut legend reads it to sit next to the ring.
   */
  donutRadius?: 'small' | 'medium' | 'large';
  /**
   * The stroke style of each ChartLine, by dataKey. The legend of a line chart reads it.
   */
  lineStrokeStyles?: Record<string, ChartLineStrokeStyle>;
  /**
   * The value format of the chart wrapper. ChartYAxis and ChartTooltip read it.
   */
  valueFormat?: ChartValueFormat;
};

// Dispatch type - contains only the updater functions
type CommonChartComponentsDispatchType = {
  setDataColorMapping?: (dataColorMapping: DataColorMapping) => void;
  /**
   * Internal handler to set visible data keys.
   * Called by ChartLegend to sync selection state.
   */
  setSelectedDataKeys?: (selectedDataKeys: string[]) => void;
};

// Legacy combined type for backward compatibility
type CommonChartComponentsContextType = CommonChartComponentsStateType &
  CommonChartComponentsDispatchType;

/**
 * Props for custom label content renderer in chart components.
 * Use this type when providing a custom `content` function to the `label` prop.
 *
 * @example
 * ```tsx
 * <ChartBar
 *   dataKey="value"
 *   label={{
 *     position: 'top',
 *     content: (props: ChartLabelContentProps) => {
 *       const { x, y, width, value } = props;
 *       return <text x={x + width / 2} y={y - 8}>{value}</text>;
 *     },
 *   }}
 * />
 * ```
 */
type ChartLabelContentProps = RechartsLabelProps;

export type {
  CommonChartComponentsContextType,
  CommonChartComponentsStateType,
  CommonChartComponentsDispatchType,
  ChartReferenceLineProps,
  ChartReferenceBandProps,
  ReferenceBandLegendInfo,
  RangeMap,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
  ChartLabelContentProps,
  Layout,
  Align,
  ChartYLabelPlacement,
  ChartResolvedYLabelPlacement,
  ChartGridlineWidth,
  ChartLegendPlacement,
  ChartDonutLegendPlacement,
  ChartLegendGap,
  ChartLineStrokeStyle,
  ChartLegendDisplayProps,
  ChartWrapperDisplayProps,
  ChartVersion,
  ChartVersionProps,
  ChartValueFormat,
  DataColorMapping,
  ChartColorToken,
  SecondaryLabelMap,
};
