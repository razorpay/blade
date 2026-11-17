import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { BoxProps } from '~components/Box';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type data = {
  [key: string]: string | number;
};

type ChartFunnelProps = {
  /**
   * Key of the count in each row of `ChartFunnelWrapper`'s `data`.
   */
  dataKey: string;
  /**
   * Key of the step name in each row of `ChartFunnelWrapper`'s `data`.
   * @default 'name'
   */
  nameKey?: string;
  /**
   * Colour of the funnel. Hover uses a darker step of the same colour.
   * @default 'data.background.categorical.blue.moderate'
   */
  color?: ChartsCategoricalColorToken;
};

type ChartFunnelWrapperProps = {
  /**
   * One row per step, in funnel order.
   */
  data: data[];
  /**
   * One `<ChartFunnel>`, plus an optional `<ChartTooltip>`.
   */
  children: React.ReactNode;
} & BoxProps &
  TestID &
  DataAnalyticsAttribute;

export type { ChartFunnelProps, ChartFunnelWrapperProps };
