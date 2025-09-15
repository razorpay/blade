import type { AreaProps as RechartAreaProps } from 'recharts';
import type { ChartsCategoricalColorToken } from '../BaseChartComponents/types';
import type { colorTheme } from '../utils';

interface ChartAreaProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  connectNulls?: boolean;
  showLegend?: boolean;
  dataKey: string;
  name: string;
  stackId?: string | number;
  color?: ChartsCategoricalColorToken;
  dot?: RechartAreaProps['dot'];
  activeDot?: RechartAreaProps['activeDot'];
  /**
   * @private
   */
  _index?: number;
  /**
   * @private
   */
  _colorTheme?: colorTheme;
}

type data = {
  [key: string]: string | number | null;
};

type ChartAreaWrapperProps = {
  children?: React.ReactNode;
  colorTheme?: colorTheme;
  data: data[];
};

export type { ChartAreaProps, ChartAreaWrapperProps };
