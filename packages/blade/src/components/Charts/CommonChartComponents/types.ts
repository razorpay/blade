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
  /**
   * Text label annotating the upper (max) bound of the range, drawn at the band's upper edge
   * (e.g. `'p75'`). Only shown when `showRangeLabels` is `true`.
   */
  upperLabel?: string;
  /**
   * Text label annotating the lower (min) bound of the range, drawn at the band's lower edge
   * (e.g. `'p25'`). Only shown when `showRangeLabels` is `true`.
   */
  lowerLabel?: string;
  /**
   * Whether to show the `upperLabel` / `lowerLabel` range labels on the band.
   * @default true
   */
  showRangeLabels?: boolean;
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
type Align = 'left' | 'right';
type ChartName = 'bar' | 'donut' | 'line' | 'area' | 'sankey';
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
   * Legend info for each reference band present in the chart (one per line with a range, plus any
   * standalone band), so the legend can render a swatch per band.
   */
  referenceBands?: ReferenceBandLegendInfo[];
  /**
   * Map of line dataKey -> range keys, so the tooltip can show each series' industry range.
   */
  rangeMap?: RangeMap;
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
  DataColorMapping,
  ChartColorToken,
  SecondaryLabelMap,
};
