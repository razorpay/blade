import type { LineProps as RechartsLineProps } from 'recharts';
import type { ChartsCategoricalColorToken } from '../BaseChartComponents/types';
import type {
  BaseBoxProps,
  FlexboxProps,
  GridProps,
} from '~components/Box/BaseBox/types/propsTypes';

interface LineChartLineProps {
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
   * If we don't have data for some points should we connect the line or should skip it.
   */
  connectNulls?: boolean;
  /**
   * Include this particular line in legend.
   *  @default : true
   */
  showLegend?: boolean;
  /**
   *  The data key of the x-axis
   */
  dataKey: string;
  /**
   * Name of the line in line chart.
   * if no provided, we will use the data key as the name.
   */
  name?: string;
  /**
   * Color of the line in line chart.
   * if no provided, we will pick colors from the default theme colors.
   */
  color?: ChartsCategoricalColorToken;
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
  _colorTheme?: 'default' | 'informational';
}

type data = {
  [key: string]: unknown;
};

// TypeScript prop types
type LineChartProps = {
  /**
   * The color theme of the line chart.
   */
  colorTheme?: 'default' | 'informational';
  /**
   * Chart data to be rendered
   */
  data: data[];
  children: React.ReactNode;
} & Partial<Omit<BaseBoxProps, keyof FlexboxProps | keyof GridProps>>;

export type { LineChartLineProps, LineChartProps };
