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
  dataKey: RechartsPieProps['dataKey'];
  nameKey: RechartsPieProps['name'];
  cx?: RechartsPieProps['cx'];
  cy?: RechartsPieProps['cy'];
  radius?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  data: data[];
  colorTheme?: colorTheme;
};

type CellProps = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type ChartPieWrapperProps = {
  centerText?: string;
  type?: 'donut' | 'pie';
  children?: React.ReactNode;
};
export type { ChartPieWrapperProps, CellProps, ChartPieProps };
