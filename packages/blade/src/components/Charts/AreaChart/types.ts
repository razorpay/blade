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
   * - `true`: a line bridges across null points while the fill stays gapped underneath (there's
   *   never a fill under a no-data stretch). Use `connectNullsStyle` to control whether that bridge
   *   line is solid or dashed.
   *
   * @default false
   */
  connectNulls?: boolean;
  /**
   * The style of the line drawn across null points when `connectNulls` is `true`. In both cases the
   * area fill is omitted under the no-data stretch — only the bridge line differs.
   *
   * - `'solid'` (default): real data renders as a solid area and the gap is bridged with a solid
   *   line (no fill underneath).
   * - `'dashed'`: real data renders as a solid area and the gap is bridged with a dashed line (no
   *   fill underneath), signalling "no data for this period" without implying a measured value.
   *
   * @default 'solid'
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
  _gradientNamespace?: string;
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
