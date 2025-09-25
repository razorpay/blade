import type { AreaProps as RechartAreaProps } from 'recharts';
import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { colorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

type ChartAreaProps = {
  /**
   * The type of the area chart.
   */
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  /**
   * Whether to connect nulls.
   */
  connectNulls?: RechartAreaProps['connectNulls'];
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
  color?: ChartsCategoricalColorToken;
  /**
   * Whether to show the dot.
   */
  dot?: RechartAreaProps['dot'];
  /**
   * Whether to show the active dot.
   */
  activeDot?: RechartAreaProps['activeDot'];
  /**
   * @private
   */
  _index?: number;
  /**
   * @private
   */
  _colorTheme?: colorTheme;
};

type data = {
  [key: string]: string | number | null;
};

type ChartAreaWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the chart.
   * @default 'categorical
   */
  colorTheme?: colorTheme;
  /**
   * Chart data to be rendered
   */
  data: data[];
} & BoxProps;

export type { ChartAreaProps, ChartAreaWrapperProps };
