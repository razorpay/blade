import type { LineProps as RechartsLineProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

interface ChartLineProps {
  /**
   * The type of the line.
   *  @default : 'linear'
   */
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  /**
   * The dot of the line.
   */
  dot?: RechartsLineProps['dot'];
  /**
   * The active dot we shows at line chart
   */
  activeDot?: RechartsLineProps['activeDot'];
  /**
   * Whether to bridge gaps (`null` / `undefined` values) in the data.
   *
   * - `false` (default): the line breaks at null points, leaving a gap. Use this for genuine data
   *   outages where no continuity should be implied.
   * - `true`: the line is connected across null points. Use `connectNullsStyle` to control whether
   *   the bridge is drawn as a solid or dashed line.
   *
   * @default false
   */
  connectNulls?: boolean;
  /**
   * The style of the line drawn across null points when `connectNulls` is `true`.
   *
   * - `'solid'` (default): nulls are bridged with a solid line.
   * - `'dashed'`: real data renders as a solid line while the stretch across null points renders
   *   dashed, signalling "no data for this period" without implying a measured value.
   *
   * Note: `'dotted'` (which `strokeStyle` supports) is intentionally not offered for null bridges.
   * A dotted bridge reads as a decorative line style rather than a "missing data" signal, and the
   * dashed style is the agreed convention for representing gaps in this chart (see the
   * SR-data-null discussion). If a dotted bridge is ever needed, extend this union and the
   * rendering helpers together.
   *
   * Note: When `strokeStyle` is also set to `'dashed'`, the null bridge becomes visually
   * indistinguishable from the rest of the line. In that case, consider using `connectNullsStyle`
   * set to `'solid'` (the default) so the bridge reads as a continuous segment, or use a
   * different `strokeStyle` for the line to keep the dashed bridge visually distinct.
   *
   * @default 'solid'
   */
  connectNullsStyle?: 'solid' | 'dashed';
  /**
   * Include this particular line in legend.
   *  @default : true
   */
  showLegend?: boolean;
  /**
   *  The data key of the x-axis
   */
  dataKey: RechartsLineProps['dataKey'];
  /**
   * Name of the line in line chart.
   * if no provided, we will use the data key as the name.
   */
  name?: RechartsLineProps['name'];
  /**
   * Color of the line in line chart.
   * if no provided, we will pick colors from the default theme colors.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Data key for the lower (minimum) bound of this line's reference band.
   * When both `rangeLowerDataKey` and `rangeUpperDataKey` are provided, a shaded range band is
   * drawn behind this line (e.g. the industry min–max range for this metric).
   */
  rangeLowerDataKey?: string;
  /**
   * Data key for the upper (maximum) bound of this line's reference band.
   * @see rangeLowerDataKey
   */
  rangeUpperDataKey?: string;
  /**
   * Legend / tooltip label for this line's reference band.
   * @default 'Industry range'
   */
  rangeName?: string;
  /**
   * Fill color of this line's reference band.
   * @default the line's own color (auto color-matched)
   */
  rangeColor?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Inline label annotating the upper bound of this line's band (e.g. `'p75'`), drawn at the band's
   * upper edge. Only shown when `showRangeLabels` is `true`.
   */
  rangeUpperLabel?: string;
  /**
   * Inline label annotating the lower bound of this line's band (e.g. `'p25'`), drawn at the band's
   * lower edge. Only shown when `showRangeLabels` is `true`.
   */
  rangeLowerLabel?: string;
  /**
   * Whether to show the inline `rangeUpperLabel` / `rangeLowerLabel` edge labels on this line's band.
   *
   * Defaults to `false` because the per-line range API is designed for the Industry SR use case,
   * where a chart can render multiple trend lines each with its own band. Drawing edge labels on
   * every band by default would clutter the chart. Enable per-line when there is only one line, or
   * when a specific line's bounds need to be called out.
   *
   * Note: the standalone `ChartReferenceBand` component defaults `showRangeLabels` to `true`,
   * since it renders a single band where the labels aid readability. The defaults differ
   * intentionally — see that prop's JSDoc for the rationale.
   *
   * @default false
   */
  showRangeLabels?: boolean;
  /**
   * Whether to show this line's reference band as a separate entry in the legend.
   *
   * Defaults to the line's own `showLegend` value, so the band's swatch follows the line's legend
   * visibility unless explicitly overridden. Set this to `false` to hide only the band's legend
   * swatch while keeping the line's entry, or to `true` to show the band's swatch while hiding the
   * line's entry (`showLegend={false}` + `showRangeLegend={true}`).
   *
   * This mirrors the standalone `ChartReferenceBand` component's `showLegend` prop, allowing
   * independent control of the band's legend visibility for per-line bands.
   *
   * @default the line's `showLegend` value
   */
  showRangeLegend?: boolean;
  /**
   * Style of the line in line chart.
   * @default: solid
   */
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
  /**
   * @private
   */
  _index?: number; // Add this for internal use
  /**
   * @private
   */
  _colorTheme?: ColorTheme;
  /**
   * @private
   */
  _totalLines?: number;
  /**
   * Whether to hide this line (controlled by legend click)
   */
  hide?: boolean;
}

type data = {
  [key: string]: unknown;
};

// TypeScript prop types
type ChartLineWrapperProps = {
  /**
   * The color theme of the chart.
   * @default 'categorical'
   */
  colorTheme?: ColorTheme;
  /**
   * Chart data to be rendered
   */
  data: data[];
  children: React.ReactNode;
} & BoxProps;

export type { ChartLineProps, ChartLineWrapperProps };
