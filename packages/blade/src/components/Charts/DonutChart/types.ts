import type { PieProps as RechartsPieProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { colorTheme } from '../utils/useColorTheme';
import type { BoxProps } from '~components/Box';

type data = {
  [key: string]: unknown;
};

type ChartDonutProps = {
  /**
   * The data key of the Donut chart.
   */
  dataKey: RechartsPieProps['dataKey'];
  /**
   * The name key of the Donut chart.
   */
  nameKey: RechartsPieProps['name'];
  /**
   * The x coordinate of the Donut chart.
   */
  cx?: RechartsPieProps['cx'];
  cy?: RechartsPieProps['cy'];
  /**
   * The radius of the Donut chart.
   */
  radius?: 'small' | 'medium' | 'large';
  /**
   * The children of the Donut chart.
   */
  children?: React.ReactNode;
  /**
   * The data of the Donut chart.
   */
  data: data[];
  /**
   * The color theme of the chart.
   * @default 'categorical
   */
  colorTheme?: colorTheme;
  /**
   * The type of the Donut chart.
   */
  type?: 'circle' | 'semicircle';
};

type CellProps = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type ChartDonutWrapperProps = {
  /**
   *  Center text of Donut chart
   */
  centerText?: string;
  children?: React.ReactNode;
} & BoxProps;
export type { ChartDonutWrapperProps, CellProps, ChartDonutProps };
