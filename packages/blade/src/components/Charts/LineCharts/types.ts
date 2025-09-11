import type { LineProps as RechartsLineProps, LineChart as RechartsLineChart } from 'recharts';
import type { ComponentProps } from 'react';
import type { ChartsCategoricalColorToken } from '../BaseChartComponents/types';

interface LineProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  dot?: RechartsLineProps['dot'];
  activeDot?: RechartsLineProps['activeDot'];
  connectNulls?: boolean;
  showLegend?: boolean;
  dataKey: string;
  name?: string;
  color?: ChartsCategoricalColorToken;
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

// TypeScript prop types
type LineChartProps = ComponentProps<typeof RechartsLineChart> & {
  colorTheme?: 'default' | 'informational';
};

export type { LineProps, LineChartProps };
