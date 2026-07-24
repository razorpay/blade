import type { AreaProps as RechartAreaProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

type ChartAreaProps = {
  /**
   * The type of the area chart.
   * @default 'monotone'
   */
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  /**
   * Whether to bridge gaps (`null` / `undefined` values) in the data.
   *
   * - `false` (default): the area breaks at null points, leaving a gap (no fill either). Use this
   *   for genuine data outages where no continuity should be implied.
   * - `true`: bridges across null points. With `connectNullsStyle="solid"` (default), the area
   *   fills and strokes across nulls (backward compatible). With `connectNullsStyle="dashed"`, the
   *   fill is gapped and only a dashed bridge line is drawn.
   *
   * Narrowed to `boolean` (instead of `RechartAreaProps['connectNulls']`) intentionally: Blade
   * restricts the API surface to a controlled subset so that `connectNullsStyle` — a Blade-specific
   * concept with no Recharts equivalent — can be offered alongside it. This mirrors `ChartLine`.
   *
   * @default false
   * @see {@link connectNullsStyle} — only takes effect when this prop is `true`
   */
  connectNulls?: boolean;
  /**
   * The style of the line drawn across null points. **Only takes effect when `connectNulls` is
   * `true`** — when `connectNulls` is `false` (or unset) the area simply breaks at null points and
   * this prop is ignored.
   *
   * - `'solid'` (default): the area fills and strokes across null points (backward compatible).
   * - `'dashed'`: the fill is gapped and only a dashed bridge line is drawn across null points,
   *   signalling "no data for this period" without implying a measured value.
   *
   * @default 'solid'
   * @see {@link connectNulls} — must be `true` for this prop to have any effect
   */
  connectNullsStyle?: 'solid' | 'dashed';
  /**
   * Whether to show the legend.
   */
  showLegend?: boolean;
  /**
   * The data key of the area chart.
   */
  dataKey: RechartAreaProps['dataKey'];
  /**
   * The name of the area chart.
   */
  name: RechartAreaProps['name'];
  /**
   * The stack id of the area chart.
   */
  stackId?: RechartAreaProps['stackId'];
  /**
   * The color of the area chart.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Whether to show the dot.
   */
  dot?: RechartAreaProps['dot'];
  /**
   * Whether to show the active dot.
   */
  activeDot?: RechartAreaProps['activeDot'];
  /**
   * Whether to hide the area.
   *
   */
  hide?: boolean;
  /**
   * @private
   */
  _index?: number;
  /**
   * @private
   */
  _colorTheme?: ColorTheme;
  /**
   * @private
   */
  _totalAreas?: number;
  /**
   * @private
   */
  _gradientNamespace: string;
};

type data = {
  [key: string]: string | number | null;
};

type ChartAreaWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the chart.
   * @default 'categorical'
   */
  colorTheme?: ColorTheme;
  /**
   * Chart data to be rendered
   */
  data: data[];
} & BoxProps;

type ChartColorGradientProps = {
  index: number;
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  key: string;
  totalAreaChartChildren: number;
  id: string;
};

type ChartColorGradientData = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  dataKey: RechartAreaProps['dataKey'];
};

export type {
  ChartAreaProps,
  ChartAreaWrapperProps,
  ChartColorGradientProps,
  ChartColorGradientData,
};
