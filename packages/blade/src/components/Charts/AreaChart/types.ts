import type { AreaProps as RechartAreaProps } from 'recharts';
import type { ChartsCategoricalColorToken } from '../BaseChartComponents/types';

interface AreaProps {
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
  _colorTheme?: 'default' | 'informational';
}

type data = {
  [key: string]: string | number | null;
};

type AreaChartProps = {
  children?: React.ReactNode;
  colorTheme?: 'default' | 'informational';
  data: data[];
};

export type { AreaProps, AreaChartProps };
