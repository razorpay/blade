import type { PieProps as RechartsPieProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { colorTheme } from '../utils/useColorTheme';

type data = {
  [key: string]: unknown;
};

type ChartPieProps = {
  /**
   * The data key of the pie chart.
   */
  dataKey: RechartsPieProps['dataKey'];
  /**
   * The name key of the pie chart.
   */
  nameKey: RechartsPieProps['name'];
  /**
   * The x coordinate of the pie chart.
   */
  cx?: RechartsPieProps['cx'];
  cy?: RechartsPieProps['cy'];
  /**
   * The radius of the pie chart.
   */
  radius?: 'small' | 'medium' | 'large';
  /**
   * The children of the pie chart.
   */
  children?: React.ReactNode;
  /**
   * The data of the pie chart.
   */
  data: data[];
  /**
   * The color theme of the pie chart.
   */
  colorTheme?: colorTheme;
  /**
   * The type of the pie chart.
   */
  type?: 'circle' | 'semicircle';
};

type CellProps = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type ChartPieWrapperProps = {
  /**
   *  Center text of pie chart
   */
  centerText?: string;
  children?: React.ReactNode;
};
export type { ChartPieWrapperProps, CellProps, ChartPieProps };
