import type { BarProps as RechartsBarProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { colorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

type ChartBarProps = {
  /**
   * The data key of the bar chart.
   */
  dataKey: RechartsBarProps['dataKey'];
  /**
   * The name of the bar chart.
   */
  name?: RechartsBarProps['name']; // default to dataKey
  /**
   * The color of the bar chart.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * The stack id of the bar chart.
   */
  stackId?: RechartsBarProps['stackId'];
  /**
   * The active bar of the bar chart.
   */
  activeBar?: RechartsBarProps['activeBar'];
  /**
   * The label of the bar chart.
   */
  label?: RechartsBarProps['label'];
  /**
   * The show legend of the bar chart.
   */
  showLegend?: boolean;
  /**
   * The index of the bar chart.
   * @private
   */
  _index?: number;
};

type data = {
  [key: string]: string | number;
};

type ChartBarWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the bar chart.
   */
  colorTheme?: colorTheme;
  /**
   * The layout of the bar chart.
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Chart data to be rendered
   */
  data: data[];
} & BoxProps;

interface BarChartContextType {
  layout?: 'horizontal' | 'vertical';
  activeIndex?: number;
  colorTheme: colorTheme;
  totalBars: number;
}

export type { ChartBarProps, ChartBarWrapperProps, BarChartContextType };
