import type { PieProps as RechartsPieProps, CellProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils/useColorTheme';
import type { BoxProps } from '~components/Box';

type data = {
  [key: string]: unknown;
};

type ChartRadius = 'small' | 'medium' | 'large';

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
  radius?: ChartRadius;
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
   * @default 'categorical'
   */
  colorTheme?: ColorTheme;
  /**
   * The type of the Donut chart.
   */
  type?: 'circle' | 'semicircle';
};

type Content = {
  value?: string;
  label?: string;
};

type ChartDonutWrapperProps = {
  /**
   * Content to be displayed at center of donut chart
   */
  content?: Content;
  children?: React.ReactNode;
} & BoxProps;

type ChartDonutCellProps = CellProps & {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

export type { ChartDonutWrapperProps, ChartDonutCellProps, ChartDonutProps, ChartRadius };
