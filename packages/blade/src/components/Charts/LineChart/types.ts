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
