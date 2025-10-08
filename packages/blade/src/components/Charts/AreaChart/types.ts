import type { AreaProps as RechartAreaProps } from 'recharts';
import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

type ChartAreaProps = {
  /**
   * The type of the area chart.
   * @default 'linear'
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
  _colorTheme?: ColorTheme;
  /**
   * @private
   */
  _totalAreas?: number;
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
  color?: ChartsCategoricalColorToken;
  key: string;
  totalAreaChartChildren: number;
  id: string;
};

type ChartColorGradientData = {
  color?: ChartsCategoricalColorToken;
  dataKey: RechartAreaProps['dataKey'];
};

export type {
  ChartAreaProps,
  ChartAreaWrapperProps,
  ChartColorGradientProps,
  ChartColorGradientData,
};
